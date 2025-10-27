const { Queue } = require('bullmq');
const { connection } = require('../../config/redis');

const webhookQueue = new Queue('webhookQueue', { connection });

module.exports = {
    async addJob(source, data) {
        await webhookQueue.add('processWebhook', { source, data }, { attempts: 3 });
        console.log(`📦 Đã đẩy job vào queue: ${source}`);
    }
}