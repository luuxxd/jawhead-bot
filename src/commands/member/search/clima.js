const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { OPENWEATHER_API_KEY } = require(`${BASE_DIR}/config`);
const axios = require('axios');

function traduzirClima(condition) {
    const traducoes = {
        'clear sky': 'Céu limpo',
        'few clouds': 'Poucas nuvens',
        'scattered clouds': 'Nuvens dispersas',
        'broken clouds': 'Nuvens quebradas',
        'overcast clouds': 'Céu nublado',
        'shower rain': 'Chuva de banho',
        'rain': 'Chuva',
        'light rain': 'Chuva fraca',
        'moderate rain': 'Chuva moderada',
        'thunderstorm': 'Trovoada',
        'snow': 'Neve',
        'mist': 'Névoa',
    };
    return traducoes[condition.toLowerCase()] || condition;
}

module.exports = {
  name: "clima",
  description: "Mostra o clima atual de uma cidade.",
  commands: ["clima", "tempo"],
  usage: `${PREFIX}clima [cidade]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact
  }) => {
    const cidade = fullArgs;

    if (!cidade) {
      throw new InvalidParameterError("Você precisa me dizer uma cidade! Ex: `.clima Manaus`");
    }
    if (!OPENWEATHER_API_KEY) {
        throw new Error("A chave da API do OpenWeatherMap não está configurada no arquivo config.js!");
    }

    await sendWaitReact();

    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
      const response = await axios.get(apiUrl);

      const data = response.data;
      const nomeCidade = data.name;
      const pais = data.sys.country;
      const temperatura = data.main.temp.toFixed(1);
      const sensacao = data.main.feels_like.toFixed(1);
      const condicao = traduzirClima(data.weather[0].description);
      const umidade = data.main.humidity;
      const vento = data.wind.speed;

      let replyMessage = `🌤️ *Clima em ${nomeCidade}, ${pais}*\n\n`;
      replyMessage += `*Condição:* ${condicao}\n`;
      replyMessage += `*Temperatura:* ${temperatura}°C\n`;
      replyMessage += `*Sensação Térmica:* ${sensacao}°C\n`;
      replyMessage += `*Umidade:* ${umidade}%\n`;
      replyMessage += `*Vento:* ${vento} km/h`;

      await sendSuccessReact();
      await sendReply(replyMessage);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return sendReply(`Não consegui encontrar a cidade "${cidade}". Verifique se o nome está correto.`);
        }
        if (error.response && error.response.status === 401) {
            return sendReply(`Erro de autenticação. A sua chave de API do OpenWeatherMap parece ser inválida. Verifique o arquivo config.js ou aguarde alguns minutos para a chave ser ativada.`);
        }
        console.error("Erro ao buscar clima:", error);
        await sendReply(`Ocorreu um erro ao buscar as informações do clima.`);
    }
  },
};
