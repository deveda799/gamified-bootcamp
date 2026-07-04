module.exports = {
  apps: [
    {
      name: "gamified-bootcamp",
      cwd: "/opt/gamified-bootcamp/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "750M",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 3000,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
        SQLITE_PATH: "/opt/gamified-bootcamp/data/app.sqlite"
      },
      out_file: "/var/log/gamified-bootcamp/out.log",
      error_file: "/var/log/gamified-bootcamp/error.log",
      merge_logs: true
    }
  ]
};
