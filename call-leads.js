const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.BLAND_API_KEY;
const ASSISTANT_ID = process.env.BLAND_ASSISTANT_ID;
const CSV_FILE = 'leads.csv';

function callLead(lead) {
  return axios.post(
    'https://api.bland.ai/v1/call',
    {
      phoneNumber: lead.phone,
      assistantId: ASSISTANT_ID,
      metadata: {
        full_name: lead.full_name,
        street: lead.street,
        city: lead.city,
        state: lead.state,
        zip: lead.zip,
      }
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    console.log(`✅ Call started for ${lead.full_name}: ${res.data.callId}`);
  }).catch(err => {
    console.error(`❌ Failed to call ${lead.full_name}:`, err.response?.data || err.message);
  });
}

function processCSV() {
  const leads = [];

  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (data) => leads.push(data))
    .on('end', async () => {
      for (const lead of leads) {
        await callLead(lead);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s between calls
      }
    });
}

processCSV();
