const axios = require('axios');

module.exports = {
  async handlePancake(data) {
    //console.log('🤖 Xử lý webhook Pancake...')

    if (data.tags && data?.tags[0]?.id == "30" && data.tags[0].name == "AVD") { // AVD ở nsml là 39
      {

        await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=3', {
          content: "gửi đơn hàng từ webhook pancake AVD"
        });
        //  await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=4', {
        //   idCodeOrder: `${data.id}`
        // });
      }
    }
  },

  async handleSmax(data) {
    console.log('🔧 Xử lý webhook Smax...');
    if (data.amount > 1000000) {
      console.log('💰 Đơn lớn, gửi báo cáo...');
    }
  }
};
