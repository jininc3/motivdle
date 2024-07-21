const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = 'mongodb+srv://<jininc3>:<Superdog123>@cluster0.mongodb.net/<motivdle>?retryWrites=true&w=majority';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const ClickSchema = new mongoose.Schema({
    date: { type: String, required: true },
    count: { type: Number, required: true }
});

const Click = mongoose.model('Click', ClickSchema);

app.post('/click', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    let clickRecord = await Click.findOne({ date: today });

    if (clickRecord) {
        clickRecord.count += 1;
    } else {
        clickRecord = new Click({ date: today, count: 1 });
    }

    await clickRecord.save();
    res.status(200).json({ count: clickRecord.count });
});

app.get('/click', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const clickRecord = await Click.findOne({ date: today });
    res.status(200).json({ count: clickRecord ? clickRecord.count : 0 });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
