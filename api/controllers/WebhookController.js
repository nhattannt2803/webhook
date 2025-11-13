const fs = require('fs');
const path = require('path');

module.exports = {
  receive: async function (req, res) {
    try {
      const source = req.query.source || req.headers['x-webhook-source'] || 'unknown';
      const data = req.body;

      // Ghi log thô ra file theo ngày
      // const logDir = path.join(__dirname, '../../logs');
      // if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
      // const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
      // fs.appendFileSync(logFile, `[${new Date().toISOString()}] (${source}) ${JSON.stringify(data)}\n`);

      //  console.log(`📩 Webhook từ [${source}] nhận được:`, data);

      // // Ghi ra console
      // console.log("📩 Webhook nhận được:", data);
      // Gọi hàm xử lý logic
      // await WebhookService.handleWebhook(source, data);

      // Đưa vào hàng đợi
      await QueueService.addJob(source, data);

      return res.json({ status: 'ok', received: true });
    } catch (error) {
      console.error("❌ Lỗi khi xử lý webhook:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
