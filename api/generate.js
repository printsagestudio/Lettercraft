export const config = { runtime: 'edge' };

export default async function handler(req) {
  const body = await req.json();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

5. Commit the file

**Step 2 — Add your API key to Vercel**

1. Go to Vercel → your project → Settings → Environment Variables
2. Add: Name = **ANTHROPIC_API_KEY**, Value = your actual key
3. Click Save
4. Go to Deployments → click the 3 dots on the latest deployment → Redeploy

**Step 3 — Update your index.html**

In your index.html, find this line:
```
const response = await fetch('https://api.anthropic.com/v1/messages', {
```
Change it to:
```
const response = await fetch('/api/generate', {
