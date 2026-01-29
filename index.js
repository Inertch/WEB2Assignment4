const express = require('express');
const mongoose = require('mongoose');
const Measurement = require('./models/Measurement');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/analytics')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Fetch Time-Series Data
app.get('/api/measurements', async (req, res) => {
  try {
    const { field, start_date, end_date } = req.query;

    if (!field || !['field1','field2','field3'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field name' });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const data = await Measurement.find({
      timestamp: { $gte: start, $lte: end }
    }).select(`timestamp ${field}`);

    if (!data.length) {
      return res.status(404).json({ error: 'No data found in range' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch Metrics
app.get('/api/measurements/metrics', async (req, res) => {
  try {
    const { field } = req.query;

    if (!field || !['field1','field2','field3'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field name' });
    }

    const data = await Measurement.find().select(field);

    if (!data.length) {
      return res.status(404).json({ error: 'No data available' });
    }

    const values = data.map(d => d[field]);
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const stdDev = Math.sqrt(values.map(v => Math.pow(v-avg,2)).reduce((a,b)=>a+b,0)/values.length);

    res.json({ avg, min, max, stdDev });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
