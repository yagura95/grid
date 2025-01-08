module.exports = {
    apps: [
        {
            name: 'frontend',
            script : "serve -p 5173 -s ./dist",
            watch: false,
            error_file: './logs/err.log',
            out_file: './logs/out.log',
        },
    ],
}
