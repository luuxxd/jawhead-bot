const { PREFIX } = require(`${BASE_DIR}/config`);
const { play } = require(`${BASE_DIR}/services/spider-x-api`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

// --- NOSSA NOVA FUNÇÃO AJUDADORA ---
/**
 * Converte segundos para o formato MM:SS
 * @param {number} seconds - O total de segundos
 * @returns {string} - A duração formatada
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // Adiciona um zero à esquerda se os segundos forem menores que 10 (ex: 3:05)
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${minutes}:${formattedSeconds}`;
}

module.exports = {
  name: "play-audio",
  description: "Faço o download de músicas",
  commands: ["play-audio", "play", "pa"],
  usage: `${PREFIX}play-audio MC Hariel`,

  handle: async ({
    sendAudioFromURL,
    sendImageFromURL,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa me dizer o que deseja buscar!"
      );
    }

    if (fullArgs.includes("http://") || fullArgs.includes("https://")) {
      throw new InvalidParameterError(
        `Você não pode usar links para baixar músicas. Use ${PREFIX}yt-mp3 link.`
      );
    }

    await sendWaitReact();

    try {
      const data = await play("audio", fullArgs);

      if (!data) {
        await sendErrorReply("Nenhum resultado encontrado.");
        return;
      }

      const duration = formatDuration(data.total_duration_in_seconds);

      await sendSuccessReact();

      await sendImageFromURL(
        data.thumbnail,
        `
*Título*: ${data.channel.name} - ${data.title}\n*Duração*: ${duration}`
      );

      await sendAudioFromURL(data.url);
    } catch (error) {
      console.log(error);
      await sendErrorReply(error.message);
    }
  },
};
