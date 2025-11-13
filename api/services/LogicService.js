const axios = require('axios');

module.exports = {
  async handlePancake(data) {
    if (data.type == "orders") {
      if (data.tags && data?.tags[0]?.id == "30" && data.tags[0].name == "AVD") { // AVD ở nsml là 39

        // await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=3', {
        //   content: "gửi đơn hàng từ webhook pancake AVD"
        // });
        //  await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=4', {
        //   idCodeOrder: `${data.id}`
        // });

      };
      if (data.tags && data.event_type == "update" && data.order_sources_name == "Facebook") { // AVD ở nsml là 39
        var hasId1 = data.tags.some(item => item.id === 1 && item.name == "Undeliverable");
        var hasId41 = data.tags.some(item => item.id === 41);
        if (hasId1 && !hasId41) {
          var idCodeOrder = data.order_link.split("order_code=")[1];
          await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=3', {
            content: `CÓ ĐƠN GIAO KHÔNG THÀNH CÔNG ID ĐƠN LÀ :${idCodeOrder}`
          });
          await axios.post('https://script.google.com/macros/s/AKfycbx8CDQlZcTcJY4xk7IjKlgFtkJ9HhqBOKspBx196cSSU1Iu-O3OXMbvEyq4QtEn4jh2HA/exec?idChucNang=5', {
            method: `sendmesstocusundeliverale`,
            idCodeOrder: `${idCodeOrder}`
          });
        }
      }
    }
  },

  async handleSmax(data) {
    console.log('🔧 Xử lý webhook Smax...');
    if (data.amount > 1000000) {
      console.log('💰 Đơn lớn, gửi báo cáo...');
    }
  },
  async handleForwardApi(data) {

    const { url, headers, body, method = 'POST' } = data;
    console.log('🔧 Xử lý webhook chuyển tiếp...');
    await axios[method.toLowerCase()](url, body, { headers });

  }
};
