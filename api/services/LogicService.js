const axios = require('axios');

module.exports = {
  async handlePancake(data) {
    console.log('🤖 Xử lý webhook Pancake...');
    if (data.event === 'order_created') {
      await axios.post('https://example.com/api/process-order', {
        orderId: data.order_id,
        status: data.status
      });
    }
  },

  async handleSmax(data) {
    console.log('🔧 Xử lý webhook Smax...');
    if (data.amount > 1000000) {
      console.log('💰 Đơn lớn, gửi báo cáo...');
    }
  }
};
