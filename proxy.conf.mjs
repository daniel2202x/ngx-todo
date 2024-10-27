export default {
    '/version': {
        target: 'https://ngx-todo.com',
        changeOrigin: true,
        bypass: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ build: '1.0' }));
        }
    },
    '/auth/login': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/auth/login': ''
        }
    },
    '/auth/signup': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/auth/signup': ''
        }
    },
    '/auth/update-profile': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/auth/update-profile': ''
        }
    },
    '/auth/lookup-profile': {
        target: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/auth/lookup-profile': ''
        }
    },
    '/auth/refresh': {
        target: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyAkr2Xc58P5cXlwUxbDTvpsm-119Kj68Tk',
        changeOrigin: true,
        pathRewrite: {
            '^/auth/refresh': ''
        }
    },
    '/api': {
        target: 'https://firestore.googleapis.com/v1/projects/todo-app-6fd34/databases/(default)/documents',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}