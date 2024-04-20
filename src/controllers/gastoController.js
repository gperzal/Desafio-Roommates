// src/controllers/gastoController.js

import Gasto from '../models/Gasto.js';
import Roommate from '../models/Roommate.js';
import { v4 as uuidv4 } from 'uuid';

export const getGastos = async (req, res) => {
    try {
        const gastos = await Gasto.getAll();
        res.status(200).json(gastos);
    } catch (error) {
        res.status(500).send("Error retrieving gastos");
    }
};



// Cuando se crea un nuevo gasto
export const addGasto = async (req, res) => {
    // Extraer los datos enviados en la solicitud
    const { roommateId, descripcion, monto } = req.body;

    try {
        // Obtener la lista de roommates y gastos actuales
        const roommates = await Roommate.getAll();
        console.log("conto roommates", roommates);
        const gastos = await Gasto.getAll();


        // Dividir el monto entre todos los roommates
        const share = monto / roommates.length;

        // Actualizar los balances de 'debe' y 'recibe'
        roommates.forEach(roommate => {
            if (roommate.id === roommateId) {
                // El roommate que pagó el gasto recibe la suma de lo que los demás deben
                roommate.recibe += share * (roommates.length - 1);
            } else {
                // Los otros roommates deben su parte del gasto
                roommate.debe += share;
            }
        });

        // Crear y añadir el nuevo gasto
        const newGasto = { id: uuidv4(), roommateId, descripcion, monto };
        gastos.push(newGasto);

        // Guardar los cambios en ambos archivos
        await Roommate.saveAll(roommates);
        await Gasto.saveAll(gastos);

        // Enviar una respuesta de éxito
        res.status(201).json(newGasto);
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        console.error('Error adding gasto:', error);
        res.status(500).send("Failed to add gasto");
    }
};





// Actualizar un gasto
export const updateGasto = async (req, res) => {
    const { id } = req.params;
    const { roommateId, descripcion, monto } = req.body;
    try {
        const gastos = await Gasto.getAll();
        const index = gastos.findIndex(g => g.id === id);
        if (index !== -1) {
            gastos[index] = { ...gastos[index], roommateId, descripcion, monto };
            await Gasto.saveAll(gastos);
            res.status(200).json(gastos[index]);
        } else {
            res.status(404).send('Gasto not found');
        }
    } catch (error) {
        res.status(500).send("Failed to update gasto");
    }
};

// Eliminar un gasto
export const deleteGasto = async (req, res) => {
    const { id } = req.params;
    try {
        const gastos = await Gasto.getAll();
        const updatedGastos = gastos.filter(g => g.id !== id);
        await Gasto.saveAll(updatedGastos);
        res.status(200).send('Gasto deleted');
    } catch (error) {
        res.status(500).send("Failed to delete gasto");
    }
};
