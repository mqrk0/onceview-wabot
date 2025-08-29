import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import qrcode from 'qrcode-terminal';
import config from './config.js';
import commandHandler from './handlers/commandHandler.js';
import groupHandler from './handlers/groupHandler.js';
import messageHandler from './handlers/messageHandler.js';

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WhatsAppBot {
    constructor() {
        this.sock = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000;
        this.config = config;
    }

    async start() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(
                join(this.config.session.path, this.config.session.name)
            );

            this.sock = makeWASocket({
                logger: pino({ level: 'silent' }),
                printQRInTerminal: true,
                auth: state,
                browser: ['Ubuntu', 'Chrome', '20.0.04'],
                markOnlineOnConnect: false,
                syncFullHistory: false
            });

            this.setupEventHandlers(saveCreds);
        } catch (error) {
            console.error('Error al iniciar conexión:', error);
            await this.handleConnectionError(error);
        }
    }

    setupEventHandlers(saveCreds) {
        const { sock } = this;

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('Escanea el código QR con tu teléfono');
                qrcode.generate(qr, { small: true }); // Use imported qrcode
            }

            if (connection === 'open') {
                this.reconnectAttempts = 0;
                const user = sock.user?.id.replace(/:.*@/, '@') || 'Usuario desconocido';
                console.log(`Conectado como ${user}`);
                try {
                    sock.sendMessage(user, {
                        text: `🤖 ¡Bot Conectado Exitosamente!\n\n⏰ Hora: ${new Date().toLocaleString()}\n✅ Estado: En línea y listo!`
                    });
                } catch (error) {
                    console.error('Error al enviar mensaje de conexión:', error);
                }
            }

            if (connection === 'close') {
                this.handleDisconnect(lastDisconnect);
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;

            const message = messages[0];
            if (!message?.message) return;

            try {
                const isGroup = message.key.remoteJid.endsWith('@g.us');

                if (isGroup) {
                    await groupHandler(message, sock, this.config);
                } else {
                    await messageHandler(message, sock, this.config);
                }

                if (message.message.conversation || message.message.extendedTextMessage) {
                    await commandHandler(message, sock, this.config, isGroup);
                }
            } catch (error) {
                console.error('Error procesando mensaje:', error);
            }
        });
    }

    async handleDisconnect(lastDisconnect) {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
            console.log('Se cerró la sesión desde otro dispositivo!');
            process.exit(1);
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconectando... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.start(), this.reconnectDelay);
        } else {
            console.log('Máximo de intentos de reconexión alcanzado');
            process.exit(1);
        }
    }

    async handleConnectionError(error) {
        console.error('Error de conexión:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.start(), this.reconnectDelay);
        } else {
            console.log('Máximo de intentos de conexión alcanzado');
            process.exit(1);
        }
    }
}

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
        console.log(`Apagando por ${signal}...`);
        process.exit(0);
    });
});

const bot = new WhatsAppBot();

bot.start();
