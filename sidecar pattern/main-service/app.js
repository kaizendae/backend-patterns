// app.js
const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.listen(3000, () => {
    console.log('Main service listening on port 3000');
});
