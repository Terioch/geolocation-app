const express = require('express');
const Datastore = require('nedb');
const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// Initialize and load database
const db = new Datastore('geolocation.db');
db.loadDatabase();

app.get('/api', (req, res) => {
  try {
    db.find({}, (err, data) => {
      res.json(data);
    });
  } catch(err) {
    console.error(`Response failed: ${err.message}`);
    return;
  }
});

// Define a post method for the API route
app.post('/api', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  db.insert(data);
  res.status(200).json(data);
});
