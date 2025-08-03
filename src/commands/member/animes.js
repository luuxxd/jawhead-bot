const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const axios = require('axios');

module.exports = {
  name: "animes",
  description: "Exibe o TOP 5 animes mais populares do momento.",
  commands: ["animes", "topanimes"],
  usage: `${PREFIX}animes`,

  handle: async ({ 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact,
    sendImageFromURL
  }) => {

    await sendWaitReact();

    try {
      // URL da API Jikan para o TOP de animes
      const apiUrl = `https://api.jikan.moe/v4/top/anime`;
      const response = await axios.get(apiUrl);

      // Pega os 5 primeiros resultados da lista
      const topAnimes = response.data.data.slice(0, 5);

      if (!topAnimes || topAnimes.length === 0) {
        return sendReply("❌ Não consegui encontrar o ranking de animes no momento. Tente novamente mais tarde.");
      }

      let replyMessage = `🏆 *TOP 5 ANIMES MAIS POPULARES*\n\n`;

      topAnimes.forEach((anime, index) => {
        const rank = index + 1;
        const medal = ["🥇", "🥈", "🥉"][index] || `${rank}.`;
        replyMessage += `${medal} *${anime.title}*\n`;
        replyMessage += `   ⭐ Score: ${anime.score}\n`;
        replyMessage += `   📺 Episódios: ${anime.episodes || 'N/A'}\n\n`;
      });

      const topAnimeImage = topAnimes[0].images.jpg.large_image_url;

      await sendSuccessReact();

      // Envia a imagem do 1º colocado com a lista como legenda
      await sendImageFromURL(topAnimeImage, replyMessage);

    } catch (error) {
        console.error("Erro ao buscar animes:", error);
        await sendReply(`❌ Ocorreu um erro ao buscar o ranking de animes. A API pode estar offline.`);
    }
  },
};
