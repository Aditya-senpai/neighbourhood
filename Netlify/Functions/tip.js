const fetch = require('node-fetch');  // Ensure node-fetch is installed for making API requests.

exports.handler = async (event, context) => {
  const { query } = JSON.parse(event.body);  // Get the query from the request body

  const openAIKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",  // Choose the correct OpenAI model
      prompt: query,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
