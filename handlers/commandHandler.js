import config from '../config.js';
import { promises as fs } from 'fs';

export default async function commandHandler(message, sock, config, isGroup) {
    const { bot } = config;
    const userJid = message.key.remoteJid;
    const messageText =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        message.message?.imageMessage?.caption ||
        message.message?.videoMessage?.caption ||
        '';

    const prefix = isGroup ? bot.groupPrefix : bot.prefix;
    console.log(`[DEBUG] Mensaje recibido: ${messageText}, Prefijo: ${prefix}, userJid: ${userJid}, isGroup: ${isGroup}`);
    if (!messageText.startsWith(prefix)) return;

    const [cmd, ...args] = messageText.slice(prefix.length).trim().split(/ +/);
    const commandName = cmd.toLowerCase();
    console.log(`[DEBUG] Comando detectado: ${commandName}`);

    try {
        const commands = await loadCommands();
        const command = commands.find(c =>
            c.name === commandName ||
            (c.aliases && c.aliases.includes(commandName))
        );

        if (!command) {
            console.log(`[DEBUG] Comando no encontrado: ${commandName}`);
            return;
        }

        await command.execute({
            sock,
            message,
            args,
            isGroup,
            config
        });

        console.log(`[CMD] ${commandName} ejecutado por ${userJid}`);
    } catch (error) {
        console.error(`[CMD ERROR] ${commandName}:`, error);
    }
}

async function loadCommands() {
    const commands = [];
    try {
        const commandFiles = ['onceview.js'];
        console.log(`[DEBUG] Archivos de comandos encontrados: ${commandFiles}`);

        for (const file of commandFiles) {
            try {
                const { default: command } = await import(`../commands/${file}`);
                if (command && command.name) {
                    console.log(`[DEBUG] Comando cargado: ${command.name}`);
                    commands.push(command);
                } else {
                    console.warn(`[DEBUG] Archivo ${file} no exporta un comando válido`);
                }
            } catch (error) {
                console.error(`[DEBUG] Error cargando ${file}:`, error);
            }
        }
    } catch (error) {
        console.error('Error cargando comandos:', error);
    }
    return commands;

}
