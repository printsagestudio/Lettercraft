export const config = { runtime: 'edge' };

export default async function handler(req) {
  const body = await req.json();

  const strictSystem = 'You are an expert cover letter writer. Your job is to write a compelling cover letter by intelligently connecting the applicant\'s actual experience to the job requirements. STRICT RULES: 1) Only use experience and skills explicitly stated in the user input — never invent or assume anything. 2) Analyze the job description carefully and identify what the employer is looking for. 3) Take the applicant\'s real experience and frame it in a way that shows it directly addresses the job requirements. 4) Use natural, professional language — not robotic repetition of the input. 5) Do not mention portfolios, videos, links, or attachments unless explicitly provided. 6) Do not use filler phrases like "I am writing to express my interest" or "I believe I would be a great fit." 7) Do not suggest the applicant will follow up. 8) Output only the cover letter text, no commentary.';

  const groqBody = {
    model: 'mixtral-8x7b-32768',
    max_tokens: 1000,
    temperature: 0.7,
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

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
