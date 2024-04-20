// src/controllers/roommateController.js

import Roommate from '../models/Roommate.js';
import Gasto from '../models/Gasto.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const getRoommates = async (req, res) => {
    try {
        const roommates = await Roommate.getAll();
        res.status(200).json(roommates);
    } catch (error) {
        console.error(error); // Log del error para diagnóstico
        res.status(500).send("Error retrieving roommates");
    }
};


export const getRoommateNames = async (req, res) => {
    try {
        const roommates = await Roommate.getAll();
        const roommateNames = roommates.map(rm => ({ id: rm.id, nombre: rm.nombre }));
        res.json(roommateNames);
    } catch (error) {
        res.status(500).send('Error al obtener los nombres de los roommates');
    }
};


export const addRoommate = async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api');
        const userData = response.data.results[0];
        const newRoommate = {
            id: uuidv4().slice(0, 4),
            nombre: `${userData.name.first} ${userData.name.last}`,
            email: userData.email,
            debe: 0,
            recibe: 0

        };
        const roommates = await Roommate.getAll();
        roommates.push(newRoommate);
        await Roommate.saveAll(roommates);
        res.status(201).json(newRoommate);
    } catch (error) {
        res.status(500).send("Failed to add new roommate");
    }
};


export const deleteRoommate = async (req, res) => {
    const { id } = req.params;
    try {
        const roommates = await Roommate.getAll();
        const filteredRoommates = roommates.filter(rm => rm.id !== id);
        await Roommate.saveAll(filteredRoommates);
        res.status(200).send('Roommate deleted');
    } catch (error) {
        res.status(500).send("Failed to delete roommate");
    }
};


export const updateRoommate = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, debe, recibe } = req.body;
    try {
        const roommates = await Roommate.getAll();
        const index = roommates.findIndex(rm => rm.id === id);
        if (index !== -1) {
            const updatedRoommate = { ...roommates[index], nombre, email, debe, recibe };
            roommates[index] = updatedRoommate;
            await Roommate.saveAll(roommates);
            res.status(200).json(updatedRoommate);
        } else {
            res.status(404).send('Roommate not found');
        }
    } catch (error) {
        res.status(500).send("Failed to update roommate");
    }
};


// En tu controlador de roommates (e.g., roommatesController.js)
export const recalcularGastosHandler = async (req, res) => {
    try {
        await recalcularGastos();
        res.status(200).json({ mensaje: "Gastos recalculados correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al recalcular gastos", error: error.message });
    }
}

async function recalcularGastos() {
    // Obtén la lista actual de roommates
    const roommates = await Roommate.getAll();

    // Obtén todos los gastos
    const gastos = await Gasto.getAll(); // Asegúrate de que Gasto tenga una función getAll similar a Roommate

    // Reinicia los montos de 'debe' y 'recibe' de todos los roommates
    roommates.forEach(roommate => {
        roommate.debe = 0;
        roommate.recibe = 0;
    });

    // Recorre todos los gastos y recalcula los montos de 'debe' y 'recibe'
    for (const gasto of gastos) {
        const montoPorPersona = Math.round(gasto.monto / roommates.length);

        // Actualiza los montos de 'debe' y 'recibe' para cada roommate
        for (const roommate of roommates) {
            if (gasto.roommateId === roommate.id) {
                roommate.recibe += Math.round(gasto.monto - montoPorPersona);
            } else {
                roommate.debe += montoPorPersona; // 
            }
        }
    }

    // Guarda los nuevos montos de 'debe' y 'recibe' en la base de datos
    await Roommate.saveAll(roommates);
}