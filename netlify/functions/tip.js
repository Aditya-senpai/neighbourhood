exports.handler = async function (event, context) {
  const fetch = (await import('node-fetch')).default;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: "Give me one helpful productivity tip." })
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText); // log the error response
      return {
        statusCode: response.status,
        body: JSON.stringify({ tip: `Error: ${errorText}` })
      };
    }

    const data = await response.json();
    if (data && Array.isArray(data) && data[0]?.generated_text) {
      return {
        statusCode: 200,
        body: JSON.stringify({ tip: data[0].generated_text })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ tip: "No tip available." })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ tip: "Error: " + err.message })
    };
  }
};

