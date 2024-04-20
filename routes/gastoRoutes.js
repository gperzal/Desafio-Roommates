import express from 'express';
import { getGastos, addGasto, updateGasto, deleteGasto } from '../src/controllers/gastoController.js';

const router = express.Router();

router.get('/', getGastos);
router.post('/', addGasto);
router.put('/:id', updateGasto);
router.delete('/:id', deleteGasto);

export default router;
