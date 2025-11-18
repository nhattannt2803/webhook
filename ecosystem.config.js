module.exports = {
  apps: [
    {
      name: "webhook",
      script: "app.js",
      env: {
        NODE_ENV: "production",
        GOOGLE_CLOUD_VISION_API_KEY: "AIzaSyC0CS4VABHNuWE_LNqKz8SOPl7HaB9glMY",
        REDIS_HOST: "127.0.0.1",
        REDIS_PORT: 6379,
        BULL_ADMIN_USER: "admin",
        BULL_ADMIN_PASSWORD: "tan123"
      }
    },
    {
      name: "webhook-worker",
      script: "./api/workers/webhookWorker.js",
      instances: 4,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        GOOGLE_CLOUD_VISION_API_KEY: "AIzaSyC0CS4VABHNuWE_LNqKz8SOPl7HaB9glMY",
        REDIS_HOST: "127.0.0.1",
        REDIS_PORT: 6379,
        BULL_ADMIN_USER: "admin",
        BULL_ADMIN_PASSWORD: "tan123"
      }
    }
  ]
};
  
