const { OWNER_NUMBER, OWNER_LID } = require("../config");
const settings = require("../settings.json");
const { compareUserJidWithOtherNumber, onlyNumbers } = require("../utils");

exports.verifyPrefix = (prefix) => settings.bot.prefix === prefix;
exports.hasTypeAndCommand = ({ type, command }) => !!type && !!command;

exports.isLink = (text) => {
  const cleanText = text.trim();
  if (/^\d+$/.test(cleanText) || /[.]{2,3}/.test(cleanText)) {
    return false;
  }
  try {
    const url = new URL(cleanText);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    try {
      const url = new URL("https://" + cleanText);
      const originalHostname = cleanText.split("/")[0].split("?")[0].split("#")[0];
      return (url.hostname.includes(".") && originalHostname.includes(".") && url.hostname.length > 4 && !/^\d+$/.test(originalHostname));
    } catch (error) {
      return false;
    }
  }
};

exports.isAdmin = async ({ remoteJid, userJid, socket }) => {
  if (!remoteJid.endsWith("@g.us")) return false;
  try {
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const participants = groupMetadata.participants;
    const user = participants.find(p => p.id === userJid);
    return user?.admin === 'admin' || user?.admin === 'superadmin';
  } catch (e) {
    return false;
  }
};

// A nova função isBotOwner
exports.isBotOwner = ({ userJid }) => {
  if (!userJid) return false;
  const ownerNumbers = settings.owner.numbers || [];
  return ownerNumbers.some(ownerNumber => 
    compareUserJidWithOtherNumber({ userJid, otherNumber: ownerNumber })
  );
};

exports.checkPermission = async ({ type, socket, userJid, remoteJid }) => {
  if (type === "member") {
    return true;
  }
  if (exports.isBotOwner({ userJid })) {
    return true; // Dono sempre tem permissão
  }
  if (type === "admin") {
    return await exports.isAdmin({ remoteJid, userJid, socket });
  }
  return false;
};

exports.isWhatsAppGroupLink = (text) => {
  const regex = new RegExp(/(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})/i);
  return regex.test(text);
};
