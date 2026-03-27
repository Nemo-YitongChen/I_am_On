function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { path, content, message } = body;

    if (!path || !content) {
      return Response.json({ error: 'Missing path or content.' }, { status: 400 });
    }

    if (!path.startsWith('src/content-live/')) {
      return Response.json({ error: 'Path is not allowed.' }, { status: 400 });
    }

    if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
      return Response.json({ error: 'Missing GITHUB_TOKEN or GITHUB_REPO binding.' }, { status: 500 });
    }

    const branch = env.GITHUB_BRANCH || 'main';
    const apiUrl = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;
    const headers = {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'cloudflare-pages-editor'
    };

    const current = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    let sha = undefined;
    if (current.ok) {
      const currentJson = await current.json();
      sha = currentJson.sha;
    }

    const update = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: message || `Update ${path}`,
        content: toBase64(content),
        branch,
        sha
      })
    });

    const result = await update.json();

    if (!update.ok) {
      return Response.json({ error: result.message || 'GitHub update failed.', details: result }, { status: update.status });
    }

    return Response.json({ ok: true, commit: result.commit, content: result.content });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown server error.' }, { status: 500 });
  }
}
