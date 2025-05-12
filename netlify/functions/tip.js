const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function () {
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: "Give a helpful productivity tip."
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    const tip = data[0]?.generated_text || "No tip generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ tip }),
    };
  } catch (error) {
    console.error("Error fetching tip from Hugging Face:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ tip: `Error: ${error.message}` }),
    };
  }
};

