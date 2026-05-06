export default {
    apps: [
        {
            name: 'modelai-studio-api',
            script: './server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            error_file: 'logs/err.log',
            out_file: 'logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            watch: false,
            ignore_watch: ['node_modules', 'logs'],
            max_memory_restart: '500M',
            max_restarts: 10,
            min_uptime: '10s',
            autorestart: true,
            merge_logs: true,
        },
    ],
};
