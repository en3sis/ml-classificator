import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './helpers/constants'
import readDataStream, { createImag } from './dataHandler'

const app = express();

/* Middleware
  ========================================================================== */
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({
    title: 'Local datasets',
    count: 1,
    labels: [
      'clock'
    ]
  })
})

app.post('/', (req, res) => {
  const { label, data, count } = req.body
  createImag({ label, count: count, data })
  res.send('done!')
})

// Dataset handler
app.get('/dataset', async (req, res) => {
  const { label, quantity } = req.query
  return readDataStream({ label, quantity })
    .then(data => res.json(data))
})


app.listen(PORT, () => {
  console.log(`⚡️ Server is running at http://localhost:${PORT}`);
});
