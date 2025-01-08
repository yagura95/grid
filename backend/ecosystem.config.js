module.exports = {
  apps: [
    {
      name: "backend",
      script: "./dist/app.js",
      node_args: "--trace-warnings",
      watch: false,
      env: {
        NODE_ENV: "production",
        GRID_COLUMNS: "10",
        GRID_ROWS: "10",
        BIAS_PERCENT: "0.2",
        TOKEN: "MySecret"
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
    },
  ],
};
