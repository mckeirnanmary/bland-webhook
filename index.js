const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const event = req.body;

  // Log full event to console
  console.log('🔔 Webhook Event:', JSON.stringify(event, null, 2));

  // Save all events to a file
  fs.appendFileSync('logs/webhook-events.log', JSON.stringify(event) + '\n');

  // Handle known event types
  switch (event.type) {
    case 'call.started':
      console.log(`📞 Call started with ${event.phoneNumber}`);
      break;

    case 'transcript.updated':
      if (event.humanMessage) {
        console.log(`👤 Human: ${event.humanMessage}`);
      }
      if (event.assistantMessage) {
        console.log(`🤖 Assistant: ${event.assistantMessage}`);
      }
      break;

    case 'call.ended':
      console.log('📴 Call ended.');
      break;

    default:
      console.log(`❓ Unknown event type: ${event.type}`);
      break;
  }

  res.status(200).send('Event received');
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server running on port ${PORT}`);
});
