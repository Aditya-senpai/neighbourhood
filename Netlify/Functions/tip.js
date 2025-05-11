const fetch = require('node-fetch');  // Make sure to import fetch for API calls

exports.handler = async (event, context) => {
  // Retrieve the query sent from the frontend (POST body)
  const { query } = JSON.parse(event.body); 

  // Your OpenAI API key (stored in Netlify environment variables)
  const apiKey = process.env.OPENAI_API_KEY; 
  
  // OpenAI endpoint
  const endpoint = "https://api.openai.com/v1/completions"; 

  try {
    // Make a POST request to the OpenAI API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,  // Add API key in headers
      },
      body: JSON.stringify({
        model: 'text-davinci-003',  // AI model to use
        prompt: query,              // The user input from frontend
        max_tokens: 100,            // Limit the length of the AI response
      }),
    });

    // Parse the response from the AI
    const data = await response.json();
    
    // Return the AI response back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // If something goes wrong, return a 500 error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching from AI API' }),
    };
  }
};
