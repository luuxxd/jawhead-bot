const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const gis = require('g-i-s');

module.exports = {
  name: "imagem",
  description: "Pesquisa e envia até 3 imagens do Google.",
  commands: ["img", "image", "imagem"],
  usage: `${PREFIX}img [termo da pesquisa]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    sendWaitMessage, 
    socket,
    remoteJid,
    sendImageFromURL 
  }) => {
    const searchTerm = fullArgs;

    if (!searchTerm) {
      throw new InvalidParameterError("Você precisa me dizer o que quer que eu pesquise! Ex: `.img gatinhos fofos`");
    }

    const waitMessage = await sendWaitMessage(`🔎 Pesquisando por "${searchTerm}"...`);

    try {
      gis({ searchTerm: searchTerm, safe: 'on' }, async (error, results) => {
        if (error) {
          console.error("Erro na busca do GIS:", error);
          await socket.sendMessage(remoteJid, { delete: waitMessage.key });
          await sendReply("❌ Ocorreu um erro ao se conectar com o Google Imagens.");
          return;
        }

        const imageResults = results.filter(r => r.url.endsWith('.jpg') || r.url.endsWith('.png') || r.url.endsWith('.jpeg'));

        if (!imageResults || imageResults.length === 0) {
          await socket.sendMessage(remoteJid, { delete: waitMessage.key });
          return sendReply(`❌ Não encontrei nenhuma imagem para "${searchTerm}".`);
        }

        await socket.sendMessage(remoteJid, { delete: waitMessage.key });
        await sendReply(`✅ Encontrei ${imageResults.length} imagens. Enviando até 3 delas...`);

        // --- AQUI ESTÁ A NOVA LÓGICA ---
        // Embaralha a lista de resultados para pegar imagens aleatórias
        const shuffledResults = imageResults.sort(() => 0.5 - Math.random());

        // Define o número máximo de imagens a serem enviadas (3 ou menos, se não houver resultados suficientes)
        const numberOfImagesToSend = Math.min(3, shuffledResults.length);

        // Envia as imagens uma por uma
        for (let i = 0; i < numberOfImagesToSend; i++) {
          try {
            await sendImageFromURL(shuffledResults[i].url, `${i + 1} de ${numberOfImagesToSend} - "${searchTerm}"`);
          } catch (e) {
            console.error(`Erro ao enviar a imagem ${i + 1}:`, e);
            // Continua para a próxima imagem se uma falhar
          }
        }
        // --- FIM DA NOVA LÓGICA ---
      });

    } catch (error) {
        await socket.sendMessage(remoteJid, { delete: waitMessage.key });
        console.error("Erro no comando .img:", error);
        await sendReply(`❌ Ocorreu um erro inesperado ao processar sua busca.`);
    }
  },
};
