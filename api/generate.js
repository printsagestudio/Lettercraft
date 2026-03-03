export const config = { runtime: 'edge' };

export default async function handler(req) {
  const body = await req.json();

  const geminiBody = {
    contents: [
      {
        parts: [
          {
            text: (body.system ? body.system + '\n\n' : '') + body.messages[0].content
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 1000
    }
  };

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    }
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
