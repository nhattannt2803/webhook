const axios = require('axios');

module.exports = {
    async handleWebhook(source, data) {
        switch (source) {
            case 'pancake':
                await this.handlePancake(data);
                break;

            case 'smax':
                await this.handleSmax(data);
                break;

            default:
                console.log('⚠️ Webhook chưa được định nghĩa nguồn:', source);
                break;
        }
    },

    async handlePancake(data) {
        console.log('🤖 Xử lý webhook Pancake...');

        // Ví dụ logic: nếu đơn hàng có trạng thái mới -> gọi API cập nhật
        if (data.event === 'order_created') {
            console.log('🧾 Gọi API xử lý đơn hàng mới...');
            // const response = await axios.post('http://localhost:1337/webhook/receive', {
            //     event: 'payment_done'
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            // console.log(response.data);
        }
    },

    async handleSmax(data) {
        console.log('🔧 Xử lý webhook Smax...');
        // Ví dụ so sánh giá trị
        if (data.amount > 1000000) {
            console.log('💰 Đơn giá trị cao, xử lý đặc biệt...');
            // ... gọi API khác
        }
    }
};
