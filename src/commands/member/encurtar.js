const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const TinyURL = require('tinyurl');

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

module.exports = {
  name: "encurtar",
  description: "Encurta um link longo.",
  commands: ["encurtar", "shorten"],
  usage: `${PREFIX}encurtar [link]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact
  }) => {
    const link = fullArgs;

    if (!link || !isValidURL(link)) {
      throw new InvalidParameterError("Você precisa me enviar um link válido para encurtar!");
    }

    await sendWaitReact();

    try {
      // Usando a nova biblioteca para encurtar
      const shortUrl = await TinyURL.shorten(link);

      if (!shortUrl) {
        throw new Error("O serviço de encurtamento retornou uma resposta vazia.");
      }

      await sendSuccessReact();
      await sendReply(`✅ *Link encurtado com sucesso!*\n\n*Original:* ${link}\n*Encurtado:* ${shortUrl}`);

    } catch (error) {
        console.error("Erro ao encurtar link:", error);
        await sendReply(`❌ Ocorreu um erro. O serviço de encurtamento pode estar offline ou o link é inválido.`);
    }
  },
};
