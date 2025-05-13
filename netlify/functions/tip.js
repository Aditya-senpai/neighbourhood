const https = require('https');

exports.handler = async function(event, context, callback) {
  const data = JSON.stringify({
    inputs: "Give me a productivity tip"
  });

  const options = {
    hostname: 'api-inference.huggingface.co',
    path: '/models/tiiuae/falcon-7b-instruct', // ✅ Valid model
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(body);

        if (result.error) {
          console.error("API error:", result);
          return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ tip: `Error: ${result.error}` })
          });
        }

        const tip = result[0]?.generated_text || "No tip available.";
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ tip })
        });
      } catch (e) {
        console.error("Parsing error:", e.message, body);
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ tip: `Error: ${e.message}` })
        });
      }
    });
  });

  req.on('error', (e) => {
    console.error("Request failed:", e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ tip: `Request error: ${e.message}` })
    });
  });

  req.write(data);
  req.end();
};
