import { join } from 'path';

export default {
    session: {
        name: 'session',
        path: join(process.cwd(), 'session'),
        saveInterval: 60_000 // 1 minuto
    },
    bot: {
        prefix: '!', // Prefijo para chats privados
        groupPrefix: '?', // Prefijo para grupos (no se usará para comandos)
        owner: '593978619941@s.whatsapp.net', // Dueño principal
        admins: [
            '593978619941@s.whatsapp.net'
        ],
        blockedUsers: [] // Lista de usuarios bloqueados
    },
    features: {
        silentMode: false,
        autoRead: false,
        limits: {
            stickerSize: 10000000
        }
    },
    paths: {
        commands: join(process.cwd(), 'commands'),
        handlers: join(process.cwd(), 'handlers'),
        database: join(process.cwd(), 'database.json')
    }
};