const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { GENIUS_API_TOKEN } = require(`${BASE_DIR}/config`);
const Genius = require('genius-lyrics');

module.exports = {
  name: "letra",
  description: "Busca a letra de uma música no Genius.",
  commands: ["letra", "lyrics"],
  usage: `${PREFIX}letra [música] - [artista]`,

  handle: async ({ sendReply, fullArgs, sendWaitReact, sendSuccessReact, sendErrorReact }) => {
    if (!fullArgs) {
      throw new InvalidParameterError("Você precisa me dizer qual música quer buscar. Ex: `.letra In the End - Linkin Park`");
    }
    if (!GENIUS_API_TOKEN) {
        throw new Error("A chave da API do Genius não está configurada no arquivo config.js!");
    }

    await sendWaitReact();

    try {
      const Client = new Genius.Client(GENIUS_API_TOKEN);

      const searches = await Client.songs.search(fullArgs);
      const song = searches[0];

      if (!song) {
        throw new Error("Música não encontrada.");
      }

      const lyrics = await song.lyrics();

      if (!lyrics) {
        throw new Error("Letra não encontrada para esta música.");
      }

      const lyricsWithoutHeader = lyrics.substring(lyrics.indexOf(']') + 1);

      const cleanedLyrics = lyricsWithoutHeader.replace(/\[.*?\]/g, '').trim();


      await sendSuccessReact();

      await sendReply(`🎶 *Letra de ${song.title} - ${song.artist.name}*\n\n${cleanedLyrics}`);

    } catch (error) {
      console.error("Erro ao buscar letra no Genius:", error);
      await sendErrorReact();
      const errorMessage = error.message.replace(GENIUS_API_TOKEN, '***');
      await sendReply(`❌ Desculpe, não consegui encontrar a letra. Detalhes: ${errorMessage}`);
    }
  },
};
