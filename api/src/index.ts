import express from 'express';

const app = express();
const PORT = 8000;

const user: UserT = {
  name: 'Jhon Doe',
  age: 40
}

app.get('/', (req, res) => {
  return res.json(user)
})

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at http://localhost:${PORT}`);
});
