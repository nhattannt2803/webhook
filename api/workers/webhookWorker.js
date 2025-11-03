const { Worker } = require('bullmq');
const WebhookService = require('../services/WebhookService');
//const { connection } = require('../../config/redis');
const Redis = require('ioredis');

const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null, // ✅ Bắt buộc cho BullMQ
});

const worker = new Worker(
    'webhookQueue',
    async job => {
        const { source, data } = job.data;
        console.log(`👷 Worker xử lý job ${job.id} - source: ${source}`);
        await WebhookService.handleWebhook(source, data);
    },
    { connection }
);

worker.on('completed', job => {
    console.log(`✅ Job hoàn tất: ${job.id}`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job lỗi: ${job.id}`, err);
});
