module.exports = {
  apps: [
    {
      name: 'backend-local',
      script: 'app/server.js',
      autorestart: true,
      watch: true,
      env: { NODE_ENV: 'local', PORT: '30020' }
    },
    {
      name: 'backend-dev',
      script: 'app/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'development', PORT: '30021' }
    },
    {
      name: 'backend-stg',
      script: 'app/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'staging', PORT: '30022' }
    },
    {
      name: 'backend-prod',
      script: 'app/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: '30023' }
    }
  ]
}
