require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/registerRoute')

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => { res.send('Backend Running'); });

app.get('/api', (req, res) => { res.send('API Running'); });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});