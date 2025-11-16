module.exports = {
    apps: [
      {
        name: "sails-app",
        script: "app.js",
        env: { NODE_ENV: "production" }
      },
      {
        name: "webhook-worker",
        script: "./workers/webhook-worker.js",
        instances: 4,     // chạy 4 tiến trình song song
        exec_mode: "cluster"
      }
    ]
  };
  