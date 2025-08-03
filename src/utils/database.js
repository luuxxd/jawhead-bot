/**
 * Funções úteis para trabalhar
 * com dados.
 *
 */
const path = require("node:path");
const fs = require("node:fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const AUTO_RESPONDER_FILE = "auto-responder";
const AUTO_RESPONDER_GROUPS_FILE = "auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const EXIT_GROUPS_FILE = "exit-groups";
const GROUP_RESTRICTIONS_FILE = "group-restrictions";
const INACTIVE_GROUPS_FILE = "inactive-groups";
const MUTE_FILE = "muted";
const ONLY_ADMINS_FILE = "only-admins";
const RESTRICTED_MESSAGES_FILE = "restricted-messages";
const WELCOME_GROUPS_FILE = "welcome-groups";

function createIfNotExists(fullPath, formatIfNotExists = []) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify(formatIfNotExists));
  }
}

function readJSON(jsonFile, formatIfNotExists = []) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);

  createIfNotExists(fullPath, formatIfNotExists);

  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function writeJSON(jsonFile, data, formatIfNotExists = []) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);

  createIfNotExists(fullPath, formatIfNotExists);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}

exports.activateExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = readJSON(filename);

  if (!exitGroups.includes(groupId)) {
    exitGroups.push(groupId);
  }

  writeJSON(filename, exitGroups);
};

exports.deactivateExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = readJSON(filename);

  const index = exitGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  exitGroups.splice(index, 1);

  writeJSON(filename, exitGroups);
};

exports.isActiveExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = readJSON(filename);

  return exitGroups.includes(groupId);
};

exports.activateWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = readJSON(filename);

  if (!welcomeGroups.includes(groupId)) {
    welcomeGroups.push(groupId);
  }

  writeJSON(filename, welcomeGroups);
};

exports.deactivateWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = readJSON(filename);

  const index = welcomeGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  welcomeGroups.splice(index, 1);

  writeJSON(filename, welcomeGroups);
};

exports.isActiveWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = readJSON(filename);

  return welcomeGroups.includes(groupId);
};

exports.activateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename);

  const index = inactiveGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  inactiveGroups.splice(index, 1);

  writeJSON(filename, inactiveGroups);
};

exports.deactivateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename);

  if (!inactiveGroups.includes(groupId)) {
    inactiveGroups.push(groupId);
  }

  writeJSON(filename, inactiveGroups);
};

exports.isActiveGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename);

  return !inactiveGroups.includes(groupId);
};

exports.getAutoResponderResponse = (match) => {
  const filename = AUTO_RESPONDER_FILE;

  const responses = readJSON(filename);

  const matchUpperCase = match.toLocaleUpperCase();

  const data = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase
  );

  if (!data) {
    return null;
  }

  return data.answer;
};

exports.activateAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = readJSON(filename);

  if (!autoResponderGroups.includes(groupId)) {
    autoResponderGroups.push(groupId);
  }

  writeJSON(filename, autoResponderGroups);
};

exports.deactivateAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = readJSON(filename);

  const index = autoResponderGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  autoResponderGroups.splice(index, 1);

  writeJSON(filename, autoResponderGroups);
};

exports.isActiveAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = readJSON(filename);

  return autoResponderGroups.includes(groupId);
};

exports.activateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename);

  if (!antiLinkGroups.includes(groupId)) {
    antiLinkGroups.push(groupId);
  }

  writeJSON(filename, antiLinkGroups);
};

exports.deactivateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename);

  const index = antiLinkGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  antiLinkGroups.splice(index, 1);

  writeJSON(filename, antiLinkGroups);
};

exports.isActiveAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename);

  return antiLinkGroups.includes(groupId);
};

exports.muteMember = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = readJSON(filename, JSON.stringify({}));

  if (!mutedMembers[groupId]) {
    mutedMembers[groupId] = [];
  }

  if (!mutedMembers[groupId]?.includes(memberId)) {
    mutedMembers[groupId].push(memberId);
  }

  writeJSON(filename, mutedMembers);
};

exports.unmuteMember = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = readJSON(filename, JSON.stringify({}));

  if (!mutedMembers[groupId]) {
    return;
  }

  const index = mutedMembers[groupId].indexOf(memberId);

  if (index !== -1) {
    mutedMembers[groupId].splice(index, 1);
  }

  writeJSON(filename, mutedMembers);
};

exports.checkIfMemberIsMuted = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = readJSON(filename, JSON.stringify({}));

  if (!mutedMembers[groupId]) {
    return false;
  }

  return mutedMembers[groupId]?.includes(memberId);
};

exports.activateOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = readJSON(filename, []);

  if (!onlyAdminsGroups.includes(groupId)) {
    onlyAdminsGroups.push(groupId);
  }

  writeJSON(filename, onlyAdminsGroups);
};

exports.deactivateOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = readJSON(filename, []);

  const index = onlyAdminsGroups.indexOf(groupId);
  if (index === -1) {
    return;
  }

  onlyAdminsGroups.splice(index, 1);

  writeJSON(filename, onlyAdminsGroups);
};

exports.isActiveOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = readJSON(filename, []);

  return onlyAdminsGroups.includes(groupId);
};

exports.readGroupRestrictions = () => {
  return readJSON(GROUP_RESTRICTIONS_FILE, {});
};

exports.saveGroupRestrictions = (restrictions) => {
  writeJSON(GROUP_RESTRICTIONS_FILE, restrictions, {});
};

exports.isActiveGroupRestriction = (groupId, restriction) => {
  const restrictions = exports.readGroupRestrictions();

  if (!restrictions[groupId]) {
    return false;
  }

  return restrictions[groupId][restriction] === true;
};

exports.updateIsActiveGroupRestriction = (groupId, restriction, isActive) => {
  const restrictions = exports.readGroupRestrictions();

  if (!restrictions[groupId]) {
    restrictions[groupId] = {};
  }

  restrictions[groupId][restriction] = isActive;

  exports.saveGroupRestrictions(restrictions);
};

exports.readRestrictedMessageTypes = () => {
  return readJSON(RESTRICTED_MESSAGES_FILE, {
    sticker: "stickerMessage",
    video: "videoMessage",
    image: "imageMessage",
    audio: "audioMessage",
    product: "productMessage",
    document: "documentMessage",
    event: "eventMessage",
  });
};

exports.activateAntiLinkGp = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  if (!db[remoteJid]) db[remoteJid] = {};
  db[remoteJid]["antilinkgp"] = true;
  exports.saveGroupRestrictions(db);
};

exports.deactivateAntiLinkGp = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  if (!db[remoteJid]) return;
  db[remoteJid]["antilinkgp"] = false;
  exports.saveGroupRestrictions(db);
};

exports.isActiveAntiLinkGp = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  return !!db[remoteJid]?.["antilinkgp"];
};

exports.updateBotPrefix = (newPrefix) => {
  const settingsPath = path.resolve(__dirname, "..", "settings.json");
  const settingsRaw = fs.readFileSync(settingsPath, "utf8");
  const settings = JSON.parse(settingsRaw);

  const oldPrefix = settings.bot.prefix;
  settings.bot.prefix = newPrefix;

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");

  return { oldPrefix, newPrefix };
};

const fsPromises = require("fs").promises;

exports.updateBotPrefixAsync = async (newPrefix) => {
  const settingsPath = path.resolve(__dirname, "..", "settings.json");
  const settingsRaw = await fsPromises.readFile(settingsPath, "utf8");
  const settings = JSON.parse(settingsRaw);

  const oldPrefix = settings.bot.prefix;
  if (oldPrefix === newPrefix) {
    return { oldPrefix, newPrefix, changed: false };
  }

  settings.bot.prefix = newPrefix;

  await fsPromises.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf8");

  return { oldPrefix, newPrefix, changed: true };
};

const RANKING_DATABASE_FILE = "ranking";

exports.readRanking = () => {
  return readJSON(RANKING_DATABASE_FILE, {});
};

exports.saveRanking = (data) => {
  writeJSON(RANKING_DATABASE_FILE, data, {});
};

exports.incrementUserMessageCount = (groupId, userId) => {
  const db = exports.readRanking();

  if (!db[groupId]) {
    db[groupId] = {};
  }

  if (!db[groupId][userId]) {
    db[groupId][userId] = 1;
  } else {
    db[groupId][userId]++;
  }

  exports.saveRanking(db);
};
const WARNS_DATABASE_FILE = "warns";

exports.readWarns = () => {
  return readJSON(WARNS_DATABASE_FILE, {});
};

exports.saveWarns = (data) => {
  writeJSON(WARNS_DATABASE_FILE, data, {});
};

exports.getWarns = (userJid) => {
  const db = exports.readWarns();
  return db[userJid] || [];
};

exports.addWarn = (userJid, reason) => {
  const db = exports.readWarns();
  if (!db[userJid]) {
    db[userJid] = [];
  }
  db[userJid].push({ reason, date: new Date().toISOString() });
  exports.saveWarns(db);
  return db[userJid];
};

exports.clearWarns = (userJid) => {
  const db = exports.readWarns();
  if (db[userJid]) {
    delete db[userJid];
    exports.saveWarns(db);
  }
};

// --- FUNÇÕES DA LISTA NEGRA ---
const BLACKLIST_FILE = "blacklist";

exports.readBlacklist = () => {
  // Força a leitura a sempre esperar um objeto (fichário)
  const data = readJSON(BLACKLIST_FILE, {});
  // Se por algum motivo o arquivo antigo for uma lista, trata como um objeto vazio
  if (Array.isArray(data)) {
    return {};
  }
  return data;
};

exports.saveBlacklist = (data) => {
  writeJSON(BLACKLIST_FILE, data, {});
};

exports.addToBlacklist = (groupId, userJid) => {
  const db = exports.readBlacklist();
  if (!db[groupId]) {
    db[groupId] = [];
  }
  if (!exports.isBlacklisted(groupId, userJid)) {
    db[groupId].push(userJid);
    exports.saveBlacklist(db);
  }
};

exports.removeFromBlacklist = (groupId, userJid) => {
  const db = exports.readBlacklist();
  if (!db[groupId]) return;
  const userToCompare = userJid.split('@')[0].replace(/\D/g, '');
  db[groupId] = db[groupId].filter(jid => {
    if (!jid) return false;
    return jid.split('@')[0].replace(/\D/g, '') !== userToCompare;
  });
  exports.saveBlacklist(db);
};

exports.isBlacklisted = (groupId, userJid) => {
  if (!userJid || !groupId) return false;
  const db = exports.readBlacklist();
  const groupBlacklist = db[groupId] || [];
  const userToCompare = userJid.split('@')[0].replace(/\D/g, '');
  return groupBlacklist.some(blacklistedJid => {
    if (!blacklistedJid) return false;
    const blacklistedUser = blacklistedJid.split('@')[0].replace(/\D/g, '');
    return blacklistedUser === userToCompare;
  });
};

// --- FUNÇÕES PARA ALTERAR NOMES ---

// Altera o nome do Bot
exports.updateBotName = (newName) => {
  const settingsPath = path.resolve(__dirname, "..", "settings.json");
  const settingsRaw = fs.readFileSync(settingsPath, "utf8");
  const settings = JSON.parse(settingsRaw);

  const oldName = settings.bot.name;
  settings.bot.name = newName;

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
  return { oldName, newName };
};

// Altera o nome do Dono
exports.updateOwnerName = (newName) => {
  const settingsPath = path.resolve(__dirname, "..", "settings.json");
  const settingsRaw = fs.readFileSync(settingsPath, "utf8");
  const settings = JSON.parse(settingsRaw);

  const oldName = settings.owner.name;
  settings.owner.name = newName;

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
  return { oldName, newName };
};

// --- FUNÇÕES DO SISTEMA ANTI-FAKE ---
exports.activateAntiFake = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  if (!db[remoteJid]) db[remoteJid] = {};
  db[remoteJid]["antifake"] = true;
  exports.saveGroupRestrictions(db);
};

exports.deactivateAntiFake = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  if (!db[remoteJid]) return;
  db[remoteJid]["antifake"] = false;
  exports.saveGroupRestrictions(db);
};

exports.isActiveAntiFake = (remoteJid) => {
  const db = exports.readGroupRestrictions();
  return !!db[remoteJid]?.["antifake"];
};

// --- FUNÇÕES DE VISUALIZAÇÃO AUTOMÁTICA DE MSGNS ---
const SPY_SETTINGS_FILE = "spy-settings";

// Lê as configurações do modo espião
exports.readSpySettings = () => {
  // O padrão é um objeto com a função desativada
  return readJSON(SPY_SETTINGS_FILE, { enabled: false });
};

// Salva as configurações
exports.saveSpySettings = (data) => {
  writeJSON(SPY_SETTINGS_FILE, data, { enabled: false });
};

// Ativa o modo espião
exports.activateSpyMode = () => {
  exports.saveSpySettings({ enabled: true });
};

// Desativa o modo espião
exports.deactivateSpyMode = () => {
  exports.saveSpySettings({ enabled: false });
};

// Verifica se o modo espião está ativo
exports.isSpyModeActive = () => {
  const settings = exports.readSpySettings();
  return settings.enabled;
};

// --- FUNÇÕES DE SEGURANÇA (ANTIPV, ANTICALL) ---
const SECURITY_SETTINGS_FILE = "security-settings";

// Lê as configurações de segurança
exports.readSecuritySettings = () => {
  // O padrão é um objeto com tudo desativado
  return readJSON(SECURITY_SETTINGS_FILE, { antiPv: false, antiPvHard: false, antiCall: false });
};

// Salva as configurações de segurança
exports.saveSecuritySettings = (data) => {
  writeJSON(SECURITY_SETTINGS_FILE, data);
};
