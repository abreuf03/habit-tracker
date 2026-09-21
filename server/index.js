const express = require('express');
const path = require('path');

//create express app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//define the port
const PORT = 3000;

//test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

//port listener
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} qué fiera!!`);
});