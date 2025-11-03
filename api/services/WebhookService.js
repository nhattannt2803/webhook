const LogicService = require('./LogicService');

module.exports = {
  async handleWebhook(source, data) {
    switch (source) {
      case 'pancake':
        await LogicService.handlePancake(data);
        break;
      case 'smax':
        await LogicService.handleSmax(data);
        break;
      case 'forwardAPI':
        await LogicService.handleForwardApi(data);
        break;
      default:
        console.log('⚠️ Nguồn webhook chưa được định nghĩa:', source);
    }
  }
};
