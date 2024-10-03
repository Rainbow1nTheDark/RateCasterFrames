module.exports = {
    apps: [{
      name: "daily-app-scheduler",
      script: "./scripts/scheduleDailyApp.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register",
      env: {
        NODE_ENV: "production",
      },
    }]
  };