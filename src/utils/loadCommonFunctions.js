const { TIMEOUT_IN_MILLISECONDS_BY_EVENT } = require("../config");
const { extractDataFromMessage, baileysIs, download } = require(".");
const fs = require("node:fs");
const { delay } = require("@whiskeysockets/baileys");
const { getRandomWaitMessage } = require("../messages"); // Importamos nosso catálogo

exports.loadCommonFunctions = ({ socket, webMessage }) => {
  const {
    args,
    commandName,
    fullArgs,
    fullMessage,
    isReply,
    prefix,
    remoteJid,
    replyJid,
    userJid,
  } = extractDataFromMessage(webMessage);

  if (!remoteJid) {
    return null;
  }

  const isAudio = baileysIs(webMessage, "audio");
  const isImage = baileysIs(webMessage, "image");
  const isVideo = baileysIs(webMessage, "video");
  const isSticker = baileysIs(webMessage, "sticker");

  const withRetry = async (fn, maxRetries = 3, delayMs = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try { return await fn(); } catch (error) {
        lastError = error;
        console.warn(`Tentativa ${attempt}/${maxRetries} falhou:`, error.message);
        if (attempt < maxRetries) await delay(delayMs * attempt);
      }
    }
    throw new Error(`Falha após ${maxRetries} tentativas. Último erro: ${lastError.message}`);
  };

  const sendTypingState = async (anotherJid = "") => {
    const sendToJid = anotherJid || remoteJid;
    await socket.sendPresenceUpdate("composing", sendToJid);
  };

  const sendRecordState = async (anotherJid = "") => {
    const sendToJid = anotherJid || remoteJid;
    await socket.sendPresenceUpdate("recording", sendToJid);
  };

  const downloadAudio = async (webMessage, fileName) => download(webMessage, fileName, "audio", "mpeg");
  const downloadImage = async (webMessage, fileName) => download(webMessage, fileName, "image", "png");
  const downloadSticker = async (webMessage, fileName) => download(webMessage, fileName, "sticker", "webp");
  const downloadVideo = async (webMessage, fileName) => download(webMessage, fileName, "video", "mp4");

  const sendText = async (text, mentions = []) => {
    await sendTypingState();
    return await socket.sendMessage(remoteJid, { text, mentions });
  };

  const sendReply = async (text, mentions = []) => {
    await sendTypingState();
    return await socket.sendMessage(remoteJid, { text, mentions }, { quoted: webMessage });
  };

  // --- AQUI ESTÁ A NOVA FUNÇÃO ---
  const sendWaitMessage = async (text) => {
    const waitMessage = text || getRandomWaitMessage(); 
    return await socket.sendMessage(remoteJid, { text: waitMessage }, { quoted: webMessage });
  };
  // --- FIM DA NOVA FUNÇÃO ---

  const sendSuccessReact = async () => {};
  const sendWaitReact = async () => {};
  const sendWarningReact = async () => {};
  const sendErrorReact = async () => {};

  const sendSuccessReply = async (text, mentions) => sendReply(`✅ ${text}`, mentions);
  const sendWaitReply = async (text, mentions) => sendReply(`⏳ Aguarde! ${text || "Carregando dados..."}`, mentions);
  const sendWarningReply = async (text, mentions) => sendReply(`⚠️ Atenção! ${text}`, mentions);
  const sendErrorReply = async (text, mentions) => sendReply(`❌ Erro! ${text}`, mentions);

  const sendStickerFromFile = async (file, quoted = true) => socket.sendMessage(remoteJid, { sticker: fs.readFileSync(file) }, quoted ? { quoted: webMessage } : {});
  const sendStickerFromURL = async (url, quoted = true) => socket.sendMessage(remoteJid, { sticker: { url } }, quoted ? { quoted: webMessage } : {});

  const sendImageFromFile = async (file, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await withRetry(() => socket.sendMessage(remoteJid, { image: fs.readFileSync(file), caption: caption || "", mentions }, quotedObject));
  };

  const sendImageFromURL = async (url, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await withRetry(() => socket.sendMessage(remoteJid, { image: { url }, caption: caption || "", mentions }, { ...quotedObject }));
  };

  const sendImageFromBuffer = async (buffer, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await withRetry(() => socket.sendMessage(remoteJid, { image: buffer, caption: caption || "", mentions }, quotedObject));
  };

  const sendVideoFromFile = async (file, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: fs.readFileSync(file), caption: caption || "", mentions }, quotedObject);
  };

  const sendAudioFromFile = async (filePath, asVoice = false, quoted = true) => {
    await sendRecordState();
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { audio: fs.readFileSync(filePath), mimetype: "audio/mpeg", ptt: asVoice }, quotedObject);
  };

  const sendAudioFromBuffer = async (buffer, asVoice = false, quoted = true) => {
    await sendRecordState();
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { audio: buffer, mimetype: "audio/mpeg", ptt: asVoice }, quotedObject);
  };

  const sendAudioFromURL = async (url, asVoice = false, quoted = true) => {
    await sendRecordState();
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { audio: { url }, mimetype: "audio/mpeg", ptt: asVoice }, { ...quotedObject });
  };

  const sendVideoFromURL = async (url, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: { url }, caption: caption || "", mentions }, { ...quotedObject });
  };

  const sendGifFromFile = async (file, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: fs.readFileSync(file), caption: caption || "", gifPlayback: true, mentions }, quotedObject);
  };

  const sendGifFromURL = async (url, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: { url }, caption: caption || "", gifPlayback: true, mentions }, { ...quotedObject });
  };

  const sendGifFromBuffer = async (buffer, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: buffer, caption: caption || "", gifPlayback: true, mentions }, quotedObject);
  };

  const sendDocumentFromFile = async (file, mimetype, fileName, quoted = true) => socket.sendMessage(remoteJid, { document: fs.readFileSync(file), mimetype: mimetype || "application/octet-stream", fileName: fileName || "documento.pdf" }, quoted ? { quoted: webMessage } : {});
  const sendDocumentFromURL = async (url, mimetype, fileName, quoted = true) => socket.sendMessage(remoteJid, { document: { url }, mimetype: mimetype || "application/octet-stream", fileName: fileName || "documento.pdf" }, quoted ? { quoted: webMessage } : {});
  const sendDocumentFromBuffer = async (buffer, mimetype, fileName, quoted = true) => socket.sendMessage(remoteJid, { document: buffer, mimetype: mimetype || "application/octet-stream", fileName: fileName || "documento.pdf" }, quoted ? { quoted: webMessage } : {});

  const sendVideoFromBuffer = async (buffer, caption = "", mentions = [], quoted = true) => {
    const quotedObject = quoted ? { quoted: webMessage } : {};
    return await socket.sendMessage(remoteJid, { video: buffer, caption: caption || "", mentions }, quotedObject);
  };

  const sendStickerFromBuffer = async (buffer, quoted = true) => socket.sendMessage(remoteJid, { sticker: buffer }, quoted ? { quoted: webMessage } : {});
  const sendPoll = async (title, options, singleChoice = false) => socket.sendMessage(remoteJid, { poll: { name: title, selectableCount: singleChoice ? 1 : 0, toAnnouncementGroup: true, values: options.map((option) => option.optionName) }});

  const isGroup = !!remoteJid?.endsWith("@g.us");
  const deleteMessage = async (key) => {
    const { id, remoteJid, participant } = key;
    const deleteKey = { remoteJid, fromMe: false, id, participant };
    await socket.sendMessage(remoteJid, { delete: deleteKey });
  };
  const getGroupMetadata = async (groupJid = remoteJid) => groupJid.endsWith("@g.us") ? await socket.groupMetadata(groupJid) : null;
  const getGroupName = async (groupJid = remoteJid) => (await getGroupMetadata(groupJid))?.subject || "";
  const getGroupOwner = async (groupJid = remoteJid) => (await getGroupMetadata(groupJid))?.owner || "";
  const getGroupParticipants = async (groupJid = remoteJid) => (await getGroupMetadata(groupJid))?.participants || [];
  const getGroupAdmins = async (groupJid = remoteJid) => (await getGroupParticipants(groupJid)).filter(p => p.admin === "admin" || p.admin === "superadmin").map(p => p.id);

  return {
    args, commandName, fullArgs, fullMessage, isGroup, isAudio, isImage, isReply, isSticker, isVideo, prefix, remoteJid, replyJid, socket, userJid, webMessage,
    deleteMessage, downloadAudio, downloadImage, downloadSticker, downloadVideo, getGroupAdmins, getGroupMetadata, getGroupName, getGroupOwner, getGroupParticipants,
    sendAudioFromBuffer, sendAudioFromFile, sendAudioFromURL, sendDocumentFromBuffer, sendDocumentFromFile, sendDocumentFromURL, sendErrorReact, sendErrorReply,
    sendGifFromBuffer, sendGifFromFile, sendGifFromURL, sendImageFromBuffer, sendImageFromFile, sendImageFromURL, sendPoll, sendReply, sendStickerFromBuffer,
    sendStickerFromFile, sendStickerFromURL, sendSuccessReact, sendSuccessReply, sendText, sendTypingState, sendVideoFromBuffer, sendVideoFromFile, sendVideoFromURL,
    sendWaitReact, sendWaitReply, sendWarningReact, sendWarningReply, sendWaitMessage,
  };
};
