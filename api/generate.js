export const config = { runtime: 'edge' };

export default async function handler(req) {
  const body = await req.json();

  const groqBody = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
      { role: 'system', content: body.system || '' },
      { role: 'user', content: body.messages[0].content }
    ]
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
    },
    body: JSON.stringify(groqBody)
  });

  const data = await response.json();
  const text = data.choices[0].message.content;

  return new Response(JSON.stringify({ content: [{ text: text }] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
