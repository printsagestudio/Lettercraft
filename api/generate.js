export const config = { runtime: 'edge' };

export default async function handler(req) {
  const body = await req.json();

  const strictSystem = 'You are a cover letter writer. Your ONLY job is to write a cover letter using EXCLUSIVELY the information provided by the user. STRICT RULES: 1) Never invent, assume, or add any experience, skills, achievements, or details that are not explicitly stated in the user input. 2) If information is not provided, do not fill it in. 3) Only use what the user gives you — nothing more. 4) Do not use filler phrases like "I am writing to express my interest" or "I believe I would be a great fit." 5) Output only the cover letter text, no commentary. 6) Do not mention portfolios, videos, attachments, or any links unless the user explicitly provided them. 7) Do not suggest or imply the applicant will follow up. Write only what is true based on the input.';

  const groqBody = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: strictSystem },
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
