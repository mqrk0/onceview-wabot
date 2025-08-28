import config from '../config.js';

export default async function groupHandler(message, sock, config) {
    const { bot } = config;
    const groupJid = message.key.remoteJid;
    
    const messageText = message.message?.conversation || '';
    const isGroupCommand = messageText.startsWith(bot.groupPrefix);
    
    if (!isGroupCommand) {
        return;
    }
    
    console.log(`[GROUP] ${groupJid} - Comando detectado: ${messageText}`);
}