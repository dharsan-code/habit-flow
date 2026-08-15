require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/registerRoute')

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});