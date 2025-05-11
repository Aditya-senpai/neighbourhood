exports.handler = async (event, context) => {
  const fetch = (await import('node-fetch')).default;

  // Get your OpenAI API key from environment variables
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // Call the OpenAI Chat Completion API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that gives short study tips.' },
        { role: 'user', content: 'Give me one study tip.' },
      ],
      max_tokens: 50,
    }),
  });

  const data = await response.json();

  // Extract the response text from OpenAI
  const tip = data.choices?.[0]?.message?.content || 'No tip available.';

  return {
    statusCode: 200,
    body: JSON.stringify({ tip }),
  };
};
