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
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/login': ''
        }
    },
    '/api/auth/signup': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/signup': ''
        }
    },
    '/api/auth/update-profile': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/update-profile': ''
        }
    },
    '/api/auth/lookup-profile': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/lookup-profile': ''
        }
    },
    '/api/auth/refresh': {
        target: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth/refresh': ''
        }
    },
    '/api/data': {
        target: 'https://firestore.googleapis.com/v1/projects/todo-app-6fd34/databases/(default)/documents',
        changeOrigin: true,
        pathRewrite: {
            '^/api/data': ''
        }
    }
}