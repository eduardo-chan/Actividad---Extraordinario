const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});


app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
