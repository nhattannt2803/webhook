const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const basicAuth = require('express-basic-auth');

// Redis connection chung
const redisConnection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

// === Tạo nhiều queue ===
const webhookQueue = new Queue('webhookQueue', { connection: redisConnection });
const emailQueue = new Queue('emailQueue', { connection: redisConnection });
const smsQueue = new Queue('smsQueue', { connection: redisConnection });

// Express Adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Basic Auth Middleware
const authMiddleware = basicAuth({
    users: { [process.env.BULL_ADMIN_USER || 'admin']: process.env.BULL_ADMIN_PASSWORD || '123456' },
    challenge: true
});

// Mount Bull Dashboard với auth
serverAdapter.getRouter().use(authMiddleware);

// Tạo BullBoard với nhiều queue
createBullBoard({
    queues: [
        new BullMQAdapter(webhookQueue),
        new BullMQAdapter(emailQueue),
        new BullMQAdapter(smsQueue)
    ],
    serverAdapter,
});

module.exports = { serverAdapter };
