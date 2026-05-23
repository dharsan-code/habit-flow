require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/registerRoute')

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'habit-flow server is running' });
});

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});