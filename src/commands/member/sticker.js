const { getRandomName } = require(`${BASE_DIR}/utils`);
const fs = require("node:fs");
const { addStickerMetadata } = require(`${BASE_DIR}/services/sticker`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX, BOT_NAME, BOT_EMOJI } = require(`${BASE_DIR}/config`);
const settings = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "sticker",
  description: "Cria figurinhas de imagem, gif ou vídeo (máximo 10 segundos).",
  commands: ["f", "s", "sticker", "fig"],
  usage: `${PREFIX}sticker (marque ou responda uma imagem/gif/vídeo)`,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendStickerFromFile,
    userJid,
    // --- Nossas Novas Ferramentas ---
    sendWaitMessage,
    socket,
    remoteJid
    // --- Fim das Novas Ferramentas ---
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        `Você precisa marcar ou responder a uma imagem/gif/vídeo!`
      );
    }

    const waitMessage = await sendWaitMessage('stickers');

    const username =
      webMessage.pushName ||
      webMessage.notifyName ||
      userJid.replace(/@s.whatsapp.net/, "");

    const packTemplate = settings.bot.stickerPack || "Feito por {namebot}";
    const authorTemplate = settings.bot.stickerAuthor || "Criador: {user}";
    const packName = packTemplate.replace('{namebot}', settings.bot.name);
    const authorName = authorTemplate.replace('{user}', username);
    const metadata = {
      botName: packName,
      username: authorName,
    };

    const outputPath = getRandomName("webp");
    let inputPath = null;

    try {
      if (isImage) {
        inputPath = await downloadImage(webMessage, getRandomName());
        await new Promise((resolve, reject) => {
          const { exec } = require("child_process");
          const cmd = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -f webp -quality 90 "${outputPath}"`;
          exec(cmd, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      } else {
        inputPath = await downloadVideo(webMessage, getRandomName());
        const seconds = webMessage.message?.videoMessage?.seconds || webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.seconds;
        if (!seconds || seconds > 10) {
          if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

          return sendErrorReply(`O vídeo enviado tem mais de 10 segundos!`);
        }
        await new Promise((resolve, reject) => {
          const { exec } = require("child_process");
          const cmd = `ffmpeg -y -i "${inputPath}" -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512, fps=30, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" -f webp "${outputPath}"`;
          exec(cmd, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }

      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (!fs.existsSync(outputPath)) {
        throw new Error("Arquivo de saída não foi criado pelo FFmpeg");
      }

      const stickerPath = await addStickerMetadata(
        await fs.promises.readFile(outputPath),
        metadata
      );

      await sendStickerFromFile(stickerPath);

      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      if (fs.existsSync(stickerPath)) fs.unlinkSync(stickerPath);

    } catch (error) {

        console.error("Erro detalhado no comando sticker:", error);
        throw new Error(`Erro ao processar a figurinha: ${error.message}`);
    }
  },
};
