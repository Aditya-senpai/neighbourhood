const https = require('https');

exports.handler = async function (event, context) {
  const data = {
    inputs: "Give me a motivational tip for the day"
  };

  const options = {
    hostname: 'api-inference.huggingface.co',
    path: '/models/google/flan-t5-small',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          const tip = result[0]?.generated_text || "No tip available.";
          resolve({
            statusCode: 200,
            body: JSON.stringify({ tip })
          });
        } catch (e) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ tip: "Error: " + body })
          });
        }
      });
    });

    req.on('error', error => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ tip: "Request failed: " + error.message })
      });
    });

    req.write(JSON.stringify(data));
    req.end();
  });
};
