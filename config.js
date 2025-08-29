import { join } from 'path';

export default {
    session: {
        name: 'session',
        path: join(process.cwd(), 'session'),
        saveInterval: 60_000
    },
    bot: {
        prefix: '!',
        groupPrefix: '?',
        owner: 'xxxxxxxxxxxx@s.whatsapp.net',
        admins: [
            'xxxxxxxxxxxx@s.whatsapp.net'
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
