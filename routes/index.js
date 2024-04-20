import express from 'express';
import roommateRoutes from './roommateRoutes.js';
import gastoRoutes from './gastoRoutes.js';

const router = express.Router();

// Ruta principal del servidor
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Usar rutas específicas para roommates y gastos
router.use('/roommate', roommateRoutes);
router.use('/gasto', gastoRoutes);

export default router;
