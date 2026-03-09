const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.post('/telegram/webhook', async (req, res) => {
  try {
    const update = req.body;
    console.log('Webhook received:', JSON.stringify(update));

    // Сразу отвечаем Telegram, чтобы он не ретраил
    res.status(200).send('ok');

    if (!update.callback_query) {
      return;
    }

    const callback = update.callback_query;
    const callbackId = callback.id;
    const chatId = callback.message.chat.id;
    const actionData = callback.data || '';

    // Подтверждаем нажатие кнопки
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackId
      })
    });

    const parts = actionData.split('|');
    const action = parts[0];
    const requestKey = parts.slice(1).join('|');

    let text = 'Неизвестное действие';

    if (action === 'generate') {
      text = `ТЕСТ\nrequestKey: ${requestKey}`;
    } else if (action === 'sent') {
      text = `ТЕСТ SENT\nrequestKey: ${requestKey}`;
    }

    // Отправляем сообщение тебе в Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

  } catch (err) {
    console.error('Webhook error:', err);
    if (!res.headersSent) {
      res.status(500).send('error');
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
