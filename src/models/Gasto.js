// src/models/Gasto.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obteniendo __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data/gastos.json');

class Gasto {
    static async getAll() {
        try {
            const data = await fs.readFile(DATA_PATH, 'utf8');
            return JSON.parse(data).gastos || [];
        } catch (error) {
            console.error('Failed to read gastos:', error);
            return [];
        }
    }

    static async saveAll(gastos) {
        try {
            await fs.writeFile(DATA_PATH, JSON.stringify({ gastos }, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save gastos:', error);
            throw new Error('Error saving gastos to gastos.json');
        }
    }


    static async update(id, updatedGasto) {
        try {
            const data = await this.getAll();
            const index = data.findIndex(g => g.id === id);
            if (index !== -1) {
                data[index] = { ...data[index], ...updatedGasto };
                await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
            } else {
                throw new Error('Gasto not found');
            }
        } catch (error) {
            throw new Error('Error updating gasto in gastos.json');
        }
    }

    static async delete(id) {
        try {
            let data = await this.getAll();
            data = data.filter(g => g.id !== id);
            await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw new Error('Error deleting gasto from gastos.json');
        }
    }
}

export default Gasto;
