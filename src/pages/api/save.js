function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function toBase64Utf8(input) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function getRuntimeEnv(context) {
  const runtimeEnv = context.locals?.runtime?.env ?? {};
  const processEnv = typeof process !== "undefined" && process?.env ? process.env : {};

  return {
    ...processEnv,
    ...runtimeEnv,
  };
}

function cleanEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseRepoConfig(env) {
  const token = cleanEnvValue(env?.GITHUB_TOKEN);
  const configuredOwner = cleanEnvValue(env?.GITHUB_OWNER);
  const configuredRepo = cleanEnvValue(env?.GITHUB_REPO);
  const branch = cleanEnvValue(env?.GITHUB_BRANCH) || "main";

  let owner = configuredOwner;
  let repo = configuredRepo;

  if (configuredRepo.includes("/")) {
    const [repoOwner, ...repoNameParts] = configuredRepo.split("/").filter(Boolean);
    if (repoOwner && repoNameParts.length > 0) {
      owner = repoOwner;
      repo = repoNameParts.join("/");
    }
  }

  return { token, owner, repo, branch };
}

function isAllowedPath(path) {
  if (path.includes("..")) {
    return false;
  }

  if (path.startsWith("src/content-live/") && path.endsWith(".json")) {
    return true;
  }

  if (path === "src/content/site/booking-options.json") {
    return true;
  }

  if (path === "src/content/site/profile.json") {
    return true;
  }

  if (path.startsWith("src/content/posts/") && path.endsWith(".md")) {
    return true;
  }

  if (path.startsWith("src/content/work/") && path.endsWith(".md")) {
    return true;
  }

  return false;
}

function encodeContentPath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function readJsonOrText(response) {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function getGitHubDetailMessage(detail) {
  if (typeof detail === "string") {
    return detail.trim();
  }

  if (detail && typeof detail.message === "string") {
    return detail.message.trim();
  }

  return "";
}

function getGitHubHint(status, detailMessage) {
  if (status === 401) {
    return "Check whether GITHUB_TOKEN is valid and active.";
  }

  if (status === 403) {
    if (/personal access token/i.test(detailMessage)) {
      return "Grant the token Contents: write access to this repository.";
    }

    return "Check whether the token can access this repository's contents.";
  }

  if (status === 404) {
    return "Check GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, and confirm the target file exists on that branch.";
  }

  return "";
}

export async function POST(context) {
  const env = getRuntimeEnv(context);
  const { token, owner, repo, branch } = parseRepoConfig(env);

  if (!token || !owner || !repo) {
    return json(
      {
        error:
          "Missing GitHub environment variables. Configure GITHUB_TOKEN plus either GITHUB_OWNER + GITHUB_REPO or a full owner/repo value in GITHUB_REPO.",
      },
      500,
    );
  }

  if (env?.EDITOR_SECRET) {
    const provided = context.request.headers.get("x-editor-secret");
    if (provided !== env.EDITOR_SECRET) {
      return json({ error: "Incorrect editor password." }, 401);
    }
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const path = payload.path?.trim();
  const content = payload.content;
  const message = payload.message?.trim() || `Update ${path}`;

  if (!path || typeof content !== "string") {
    return json({ error: "Both path and content are required" }, 400);
  }

  if (!isAllowedPath(path)) {
    return json({ error: "Path is not allowed" }, 403);
  }

  const encodedPath = encodeContentPath(path);
  const githubHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "i-am-on-editor",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const readUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
  const currentRes = await fetch(readUrl, {
    method: "GET",
    headers: githubHeaders,
  });
  const currentDetail = await readJsonOrText(currentRes);

  if (!currentRes.ok) {
    const detailMessage = getGitHubDetailMessage(currentDetail);
    return json(
      {
        error: "Failed to read current file from GitHub",
        detail: currentDetail,
        detailMessage,
        githubStatus: currentRes.status,
        hint: getGitHubHint(currentRes.status, detailMessage),
        repo: `${owner}/${repo}`,
        branch,
        path,
      },
      502,
    );
  }

  if (!currentDetail || typeof currentDetail !== "object" || !currentDetail.sha) {
    return json({ error: "Missing file SHA from GitHub" }, 502);
  }

  const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const updateRes = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      ...githubHeaders,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      message,
      content: toBase64Utf8(content),
      sha: currentDetail.sha,
      branch,
    }),
  });
  const updateDetail = await readJsonOrText(updateRes);

  if (!updateRes.ok) {
    const detailMessage = getGitHubDetailMessage(updateDetail);
    return json(
      {
        error: "Failed to update file on GitHub",
        detail: updateDetail,
        detailMessage,
        githubStatus: updateRes.status,
        hint: getGitHubHint(updateRes.status, detailMessage),
        repo: `${owner}/${repo}`,
        branch,
        path,
      },
      502,
    );
  }

  return json({
    ok: true,
    commit: updateDetail?.commit || null,
    content: updateDetail?.content || null,
  });
}
