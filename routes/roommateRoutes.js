import express from 'express';
import { addRoommate, getRoommates, updateRoommate, deleteRoommate, getRoommateNames, recalcularGastosHandler } from '../src/controllers/roommateController.js';

const router = express.Router();

router.post('/', addRoommate);
router.get('/', getRoommates);
//extra
router.get('/nombres', getRoommateNames);
router.put('/recalcular-gastos', recalcularGastosHandler);


router.put('/:id', updateRoommate);  // Ruta PUT con parámetro ID
router.delete('/:id', deleteRoommate);  // Ruta DELETE con parámetro ID

export default router;
