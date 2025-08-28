import { promises as fs } from 'fs';
import { join } from 'path';
import config from '../config.js';

export class Database {
    static async get(key) {
        try {
            const data = JSON.parse(await fs.readFile(config.paths.database, 'utf8'));
            return data[key];
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(config.paths.database, '{}');
                return null;
            }
            console.error('Error reading from database:', error);
            return null;
        }
    }

    static async set(key, value) {
        try {
            const data = JSON.parse(await fs.readFile(config.paths.database, 'utf8') || '{}');
            data[key] = value;
            await fs.writeFile(config.paths.database, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing to database:', error);
        }
    }
}