const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.post('/telegram/webhook', (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body));
  res.status(200).send('ok');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});