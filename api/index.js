const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const productosRoutes = require('./routes/producto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Productos funcionando correctamente' });
});

async function startServer() {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log('Servidor API ejecutándose en http://localhost:${PORT}');
    });
  } else {
    console.error('Problemas de conexión con la base de datos');
  }
}

startServer();

process.on('SIGINT', () => {
  console.log('Cerrando servidor API...');
  process.exit(0);
});