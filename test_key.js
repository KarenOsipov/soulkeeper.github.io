const https = require('https');

const key = "AQ.Ab8RN6K3gGZhg41cNBur9lSI2VxJQJzjqTBB51He3ZUPZ6L-g";
const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp'];

function testModel(model) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello' }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          model,
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        model,
        error: e.message
      });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log("Testing Gemini API Key with x-goog-api-key header...");
  for (const model of models) {
    const res = await testModel(model);
    console.log(`\nModel: ${res.model}`);
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response: ${res.data}`);
  }
}

run();
