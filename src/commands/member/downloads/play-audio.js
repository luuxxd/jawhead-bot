const { PREFIX } = require(`${BASE_DIR}/config`);
const { play } = require(`${BASE_DIR}/services/spider-x-api`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
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
    sendWaitMessage,
    sendReply,
    socket,
    remoteJid
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError("Você precisa me dizer o que deseja buscar!");
    }
    if (fullArgs.includes("http://") || fullArgs.includes("https://")) {
      throw new InvalidParameterError(`Você não pode usar links para baixar músicas. Use ${PREFIX}yt-mp3 link.`);
    }

    const waitMessage = await sendWaitMessage();

    try {
        const data = await play("audio", fullArgs);

        if (!data) {
            await socket.sendMessage(remoteJid, { delete: waitMessage.key });
            return sendReply("Nenhum resultado encontrado.");
        }

        const duration = formatDuration(data.total_duration_in_seconds);

        await socket.sendMessage(remoteJid, { delete: waitMessage.key });

        await sendImageFromURL(
            data.thumbnail,
            `*Título*: ${data.channel.name} - ${data.title}\n*Duração*: ${duration}`
        );

        await sendAudioFromURL(data.url);
    } catch (error) {
        await socket.sendMessage(remoteJid, { delete: waitMessage.key });
        console.log(error);
        await sendReply(`❌ Ocorreu um erro ao baixar o áudio: ${error.message}`);
    }
  },
};
