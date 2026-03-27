interface Env {
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  EDITOR_SECRET?: string;
}

interface SavePayload {
  path?: string;
  content?: string;
  message?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function toBase64Utf8(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function isAllowedPath(path: string): boolean {
  return path.startsWith("src/content-live/") && path.endsWith(".json");
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return json(
      {
        error:
          "Missing GitHub environment variables. Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, and optionally GITHUB_BRANCH / EDITOR_SECRET.",
      },
      500,
    );
  }

  if (env.EDITOR_SECRET) {
    const provided = request.headers.get("x-editor-secret");
    if (provided !== env.EDITOR_SECRET) {
      return json({ error: "Unauthorized" }, 401);
    }
  }

  let payload: SavePayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const path = payload.path?.trim();
  const content = payload.content;
  const message = payload.message?.trim() || `Update ${path}`;

  if (!path || !content) {
    return json({ error: "Both path and content are required" }, 400);
  }

  if (!isAllowedPath(path)) {
    return json({ error: "Path is not allowed" }, 403);
  }

  const branch = env.GITHUB_BRANCH || "main";
  const githubHeaders = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "i-am-on-editor",
  };

  const fileUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  const currentRes = await fetch(fileUrl, {
    method: "GET",
    headers: githubHeaders,
  });

  if (!currentRes.ok) {
    const detail = await currentRes.text();
    return json(
      {
        error: "Failed to read current file from GitHub",
        detail,
      },
      502,
    );
  }

  const currentFile = (await currentRes.json()) as { sha?: string };
  if (!currentFile.sha) {
    return json({ error: "Missing file SHA from GitHub" }, 502);
  }

  const updateUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
  const updateRes = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      ...githubHeaders,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      message,
      content: toBase64Utf8(content),
      sha: currentFile.sha,
      branch,
    }),
  });

  const updateJson = await updateRes.json();
  if (!updateRes.ok) {
    return json(
      {
        error: "Failed to update file on GitHub",
        detail: updateJson,
      },
      502,
    );
  }

  return json({
    ok: true,
    commit: updateJson.commit || null,
    content: updateJson.content || null,
  });
};