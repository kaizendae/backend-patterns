// app.js
const express = require('express');
const httpProxy = require('http-proxy');
const app = express();

// Create a proxy server
const proxy = httpProxy.createProxyServer({ target: 'http://main-service:3000' });

// Middleware to check authentication
app.use((req, res, next) => {
    const authHeader = req.headers['x-auth-token'];

    if (authHeader === 'mysecrettoken') {
        next(); // Authentication passed
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Proxy the request to the main service
app.all('*', (req, res) => {
    proxy.web(req, res);
});

app.listen(4000, () => {
    console.log('Sidecar service (auth proxy) listening on port 4000');
});
