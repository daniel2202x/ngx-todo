export default {
    '/version': {
        target: 'https://example.com', // unused because we hard code the response using bypass, but the Angular CLI needs a dummy value to function
        changeOrigin: true,
        bypass: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ build: '1.0.0-dev' }));
        }
    },
    '/api/auth/login': {
        target: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=dummy',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/login': ''
        }
    },
    '/api/auth/signup': {
        target: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=dummy',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/signup': ''
        }
    },
    '/api/auth/update-profile': {
        target: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=dummy',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/update-profile': ''
        }
    },
    '/api/auth/lookup-profile': {
        target: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=dummy',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/lookup-profile': ''
        }
    },
    '/api/auth/refresh': {
        target: 'http://127.0.0.1:9099/securetoken.googleapis.com/v1/token?key=dummy',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/refresh': ''
        }
    },
    '/api/data': {
        target: 'http://127.0.0.1:8080/v1/projects/todo-app-6fd34/databases/(default)/documents',
        changeOrigin: true,
        pathRewrite: {
            '^/api/data': ''
        }
    }
}