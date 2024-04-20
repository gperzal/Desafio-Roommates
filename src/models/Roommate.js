// src/models/Roommate.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir import.meta.url a una ruta de archivo adecuada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_PATH = path.join(__dirname, '../data/roommates.json');


class Roommate {


    static async getAll() {
        try {
            const data = await fs.readFile(DATA_PATH, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData.roommates; // Asumiendo que estamos en el modelo Roommate
        } catch (error) {
            console.error('Failed to read data:', error);
            throw new Error('Error reading data from the file');
        }
    }

    static async saveAll(roommates) {
        try {
            await fs.writeFile(DATA_PATH, JSON.stringify({ roommates }, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save data:', error);
            throw new Error('Error saving data to the file');
        }
    }

}

export default Roommate;
