const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

// Nosso mini banco de dados de DDDs
const dddDatabase = {
    '11': 'São Paulo (SP)', '12': 'São Paulo (SP)', '13': 'São Paulo (SP)', '14': 'São Paulo (SP)', '15': 'São Paulo (SP)', '16': 'São Paulo (SP)', '17': 'São Paulo (SP)', '18': 'São Paulo (SP)', '19': 'São Paulo (SP)',
    '21': 'Rio de Janeiro (RJ)', '22': 'Rio de Janeiro (RJ)', '24': 'Rio de Janeiro (RJ)',
    '27': 'Espírito Santo (ES)', '28': 'Espírito Santo (ES)',
    '31': 'Minas Gerais (MG)', '32': 'Minas Gerais (MG)', '33': 'Minas Gerais (MG)', '34': 'Minas Gerais (MG)', '35': 'Minas Gerais (MG)', '37': 'Minas Gerais (MG)', '38': 'Minas Gerais (MG)',
    '41': 'Paraná (PR)', '42': 'Paraná (PR)', '43': 'Paraná (PR)', '44': 'Paraná (PR)', '45': 'Paraná (PR)', '46': 'Paraná (PR)',
    '47': 'Santa Catarina (SC)', '48': 'Santa Catarina (SC)', '49': 'Santa Catarina (SC)',
    '51': 'Rio Grande do Sul (RS)', '53': 'Rio Grande do Sul (RS)', '54': 'Rio Grande do Sul (RS)', '55': 'Rio Grande do Sul (RS)',
    '61': 'Distrito Federal (DF) e Goiás (GO)',
    '62': 'Goiás (GO)', '64': 'Goiás (GO)',
    '63': 'Tocantins (TO)',
    '65': 'Mato Grosso (MT)', '66': 'Mato Grosso (MT)',
    '67': 'Mato Grosso do Sul (MS)',
    '68': 'Acre (AC)',
    '69': 'Rondônia (RO)',
    '71': 'Bahia (BA)', '73': 'Bahia (BA)', '74': 'Bahia (BA)', '75': 'Bahia (BA)', '77': 'Bahia (BA)',
    '79': 'Sergipe (SE)',
    '81': 'Pernambuco (PE)', '87': 'Pernambuco (PE)',
    '82': 'Alagoas (AL)',
    '83': 'Paraíba (PB)',
    '84': 'Rio Grande do Norte (RN)',
    '85': 'Ceará (CE)', '88': 'Ceará (CE)',
    '86': 'Piauí (PI)', '89': 'Piauí (PI)',
    '91': 'Pará (PA)', '93': 'Pará (PA)', '94': 'Pará (PA)',
    '92': 'Amazonas (AM)', '97': 'Amazonas (AM)',
    '95': 'Roraima (RR)',
    '96': 'Amapá (AP)',
    '98': 'Maranhão (MA)', '99': 'Maranhão (MA)'
};

module.exports = {
  name: "ddd",
  description: "Mostra a qual estado pertence um DDD.",
  commands: ["ddd"],
  usage: `${PREFIX}ddd [código_ddd]`,

  handle: async ({ 
    args, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact
  }) => {
    const ddd = args[0];

    if (!ddd || !/^\d{2}$/.test(ddd)) {
      throw new InvalidParameterError("Você precisa me informar um DDD com 2 dígitos. Ex: `.ddd 11`");
    }

    await sendWaitReact();

    const location = dddDatabase[ddd];

    if (location) {
      await sendSuccessReact();
      await sendReply(`📞 O DDD *${ddd}* pertence a: *${location}*`);
    } else {
      await sendReply(`❌ O DDD *${ddd}* não foi encontrado ou não existe.`);
    }
  },
};
