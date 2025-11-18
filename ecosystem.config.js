module.exports = {
    apps: [
      {
        name: "webhook",
        script: "app.js",
        env: { NODE_ENV: "production" }
      },
      {
        name: "webhook-worker",
        script: "./workers/webhookWorker.js",
        instances: 4,     // chạy 4 tiến trình song song
        exec_mode: "cluster"
      }
    ]
  };
  