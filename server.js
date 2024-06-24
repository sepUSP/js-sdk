const express = require('express');
const dotenv = require('dotenv');
const { client } = require('@procore/js-sdk');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

// Log the environment variables to verify they are loaded correctly
console.log("PROCORE_CLIENT_ID:", process.env.PROCORE_CLIENT_ID);
console.log("PROCORE_CLIENT_SECRET:", process.env.PROCORE_CLIENT_SECRET);
console.log("PROCORE_REDIRECT_URI:", process.env.PROCORE_REDIRECT_URI);
console.log("PROCORE_COMPANY_ID:", process.env.PROCORE_COMPANY_ID);
console.log("PROCORE_PROJECT_ID:", process.env.PROCORE_PROJECT_ID);

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Manually set the access token
const accessToken = 'eyJhbGciOiJFUzUxMiJ9.eyJhbXIiOlsic3NvIl0sImFpZCI6Ik5Fa1g4OHFOYkJnbWhkMXJrUG9pZjlaakhoUkRqZ21GZEw5SWx4d05WTDAiLCJhb3VpZCI6MTA0NTIxMjksImFvdXVpZCI6ImYzNzMzNjBiLWRhZDYtNDJiZi1hMWYzLWQ2OWIxZmQ0OWE4OSIsImV4cCI6MTcxOTE5NDgxNSwic2lhdCI6MTcxOTA5MTk5MCwidWlkIjoxMDQ1MjEyOSwidXVpZCI6ImYzNzMzNjBiLWRhZDYtNDJiZi1hMWYzLWQ2OWIxZmQ0OWE4OSIsImxhc3RfbWZhX2NoZWNrIjoxNzE5MTc4NjMwfQ.AZcRmvrdaSafC1B1zAxVtjPuxMYoey_seV-Uo_T6eb-5n7umpYtLUM7SQA2QMgtnP_qsmVFaaXvWL8aOjz_7lUAMAe_dyKwebyYxQ5w-UFK73WGnfyVh4RlKOwCGrvFPWhnVhlxMEGmAjT6ervEyo8y-mrgB54svaLI799YA_s-p8EnQ';

// Initialize the Procore client
const procoreClient = client({
  client_id: process.env.PROCORE_CLIENT_ID,
  client_secret: process.env.PROCORE_CLIENT_SECRET,
  redirect_uri: process.env.PROCORE_REDIRECT_URI,
  authorize_url: 'https://login.procore.com/oauth/authorize',
  token_url: 'https://login.procore.com/oauth/token',
});

// Set Authorization header for the Procore client
procoreClient.auth = { token: accessToken };

// Fetch Submittals
app.get('/submittals', async (req, res) => {
  try {
    const response = await procoreClient.get({
      api: `/vapid/projects/${process.env.PROCORE_PROJECT_ID}/submittals`,
      qs: { company_id: process.env.PROCORE_COMPANY_ID }
    });
    res.json(response.body);
  } catch (error) {
    res.status(500).send(`Failed to fetch submittals: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
