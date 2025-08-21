import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const housing = [
  { id: 1, title: 'Sample House', description: 'Cozy place to stay' }
];

const maids = [
  { id: 1, name: 'Jane Doe', experience: '2 years' }
];

app.get('/api/housing', (req, res) => {
  res.json(housing);
});

app.get('/api/maids', (req, res) => {
  res.json(maids);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
