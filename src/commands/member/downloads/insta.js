const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { RAPIDAPI_KEY } = require(`${BASE_DIR}/config`);
const axios = require('axios');

module.exports = {
  name: "instagram",
  description: "Baixa mídias de um link do Instagram.",
  commands: ["insta", "ig"],
  usage: `${PREFIX}insta [link_do_post]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact, 
    sendVideoFromURL, 
    sendImageFromURL 
  }) => {
    const link = fullArgs;

    if (!link || !link.includes("instagram.com")) {
      throw new InvalidParameterError("Você precisa me enviar um link válido do Instagram!");
    }
    if (!RAPIDAPI_KEY) {
        throw new Error("A chave da RapidAPI não está configurada no arquivo config.js!");
    }

    await sendWaitReact();

    const options = {
      method: 'GET',
      url: 'https://instagram-post-reels-stories-downloader-api.p.rapidapi.com/instagram/',
      params: { url: link },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader-api.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);

      if (!response.data || !response.data.result || response.data.result.length === 0) {
        throw new Error("Erro, mídia não encontrada.");
      }

      const results = response.data.result;

      await sendSuccessReact();
      await sendReply(`Processando ${results.length} arquivo(s)...`);

      for (const media of results) {
        if (media.type.includes('video')) {
          await sendVideoFromURL(media.url, null, { isReply: false });
        } else {
          await sendImageFromURL(media.url, null, { isReply: false });
        }
      }

    } catch (error) {
      console.error("Erro ao baixar do Instagram via RapidAPI:", error);
      await sendReply(`Ocorreu um erro ao tentar baixar esta mídia. O post pode ser privado ou a API pode estar com problemas.`);
    }
  },
};
