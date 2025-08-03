const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const axios = require('axios');

module.exports = {
  name: "wikipedia",
  description: "Faz uma pesquisa rápida na Wikipédia.",
  commands: ["wiki", "wikipedia"],
  usage: `${PREFIX}wiki [termo_da_pesquisa]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact
  }) => {
    const searchTerm = fullArgs;

    if (!searchTerm) {
      throw new InvalidParameterError("Você precisa me dizer o que quer pesquisar! Ex: `.wiki Metallica`");
    }

    await sendWaitReact();

    try {
      // URL da API da Wikipédia em português
      const apiUrl = `https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(searchTerm)}`;

      const response = await axios.get(apiUrl);
      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0]; // Pega a primeira (e única) página do resultado

      // Verifica se a página foi encontrada (se o ID for -1, não encontrou)
      if (pageId === '-1') {
        return sendReply(`❌ Não encontrei nenhum artigo na Wikipédia para "${searchTerm}". Tente um termo diferente.`);
      }

      const pageData = pages[pageId];
      const title = pageData.title;
      let extract = pageData.extract;

      // Limita o resumo a um tamanho razoável para não floodar o chat
      if (extract.length > 500) {
        extract = extract.substring(0, 500) + '...';
      }

      const pageUrl = `https://pt.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

      let replyMessage = `📖 *Resultado da Wikipédia para "${title}"*\n\n`;
      replyMessage += `${extract}\n\n`;
      replyMessage += `*Leia mais em:* ${pageUrl}`;

      await sendSuccessReact();
      await sendReply(replyMessage);

    } catch (error) {
        console.error("Erro ao pesquisar na Wikipédia:", error);
        await sendReply(`❌ Ocorreu um erro ao tentar conectar com a Wikipédia. Tente novamente mais tarde.`);
    }
  },
};
