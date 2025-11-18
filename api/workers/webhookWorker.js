require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const WebhookService = require('../services/WebhookService');

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // bắt buộc
  family: 4 // ép dùng IPv4
});

// Worker — xử lý song song (PM2 sẽ scale nhiều process)
const worker = new Worker(
  'webhookQueue',
  async job => {
    const { source, data } = job.data;
    console.log(`👷 Worker ${process.pid} xử lý job ${job.id} - ${source}`);
    await WebhookService.handleWebhook(source, data);
  },
  {
    connection,
    concurrency: 10 // mỗi worker process chạy 10 job cùng lúc
  }
);

worker.on('completed', job => {
  console.log(`✅ Worker ${process.pid} hoàn tất job ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Worker ${process.pid} lỗi job ${job.id}:`, err);
});
