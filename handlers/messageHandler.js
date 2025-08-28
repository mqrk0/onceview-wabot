export default async function messageHandler(message, sock, config) {
    const { bot } = config;
    const userJid = message.key.remoteJid;
    const messageText = message.message?.conversation || '';

    if (bot.blockedUsers.includes(userJid.split('@')[0])) {
        console.log(`Mensaje de usuario bloqueado: ${userJid}`);
        return;
    }

    console.log(`[PRIVATE] ${userJid}: ${messageText}`);
}