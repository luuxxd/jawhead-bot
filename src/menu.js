const { bot: { prefix: PREFIX } } = require("./settings.json");

// --- CATÁLOGO DE MENUS DO JAWHEAD BOT ---

exports.mainMenu = (user) => {
  return `〆 *MENU DE COMANDOS DO JAWHEAD* 〆\n
Fala @${user.jid.split('@')[0]} 🫵🦍\n
<> Se quiser mais informações sobre algum comando, use ${PREFIX}info [comando] <>\n
————————————————————————————————————————————————\n
➲ *PRINCIPAL*\n
〆 ${PREFIX}menuadm - Menu de Adms
〆 ${PREFIX}menudono - Menu do Dono
〆 ${PREFIX}menugold - *Em breve...*
〆 ${PREFIX}suporte - Informações gerais do bot\n
————————————————————————————————————————————————\n
➲ *FIGURINHAS*\n
〆 ${PREFIX}sticker - Converte imagem em figurinha
〆 ${PREFIX}attp [texto] - Figurinha de texto animada
〆 ${PREFIX}ttp [texto] - Figurinha de texto estática
〆 ${PREFIX}toimg - Converte figurinha em imagem\n
〆 ${PREFIX}roubar - "Furta" figurinha de outro usuário para seu pack
————————————————————————————————————————————————\n
➲ *DOWNLOADS*\n
〆 ${PREFIX}play [música/link] - Baixa áudio do YouTube
〆 ${PREFIX}play-video [nome/link] - Baixa vídeo do YouTube
〆 ${PREFIX}tik-tok [link] - Baixa vídeo do TikTok
〆 ${PREFIX}insta [link] - Baixa mídia do Instagram
〆 ${PREFIX}x [link] - Baixa mídia do X/Twitter
〆 ${PREFIX}yt-mp3 [link] - Converte vídeos do YouTube para MP3
〆 ${PREFIX}yt-mp4 [link] - Converte vídeos do YouTube para MP4\n
————————————————————————————————————————————————\n
➲ *BRINCADEIRAS*\n
〆 ${PREFIX}jogodavelha iniciar (@adversário)
〆 ${PREFIX}chance [texto]
〆 ${PREFIX}abracar [@usuário]
〆 ${PREFIX}beijar
〆 ${PREFIX}dado
〆 ${PREFIX}jantar
〆 ${PREFIX}lutar
〆 ${PREFIX}matar
〆 ${PREFIX}socar\n
————————————————————————————————————————————————\n
➲ *PESQUISAS & CONSULTAS*\n
〆 ${PREFIX}googlesearch [texto] - Pesquisa no Google
〆 ${PREFIX}ytsearch [texto] - Pesquisa no YouTube
〆 ${PREFIX}cep [00000-000] - Consulta de CEP
〆 ${PREFIX}animes - Animes populares do momento
〆 ${PREFIX}wiki [texto] - Pesquisa no Wikipédia
〆 ${PREFIX}img - Pesquisa imagens do Google
〆 ${PREFIX}clima [cidade]
〆 ${PREFIX}letra [artista - música] - Letra da música pesquisada
〆 ${PREFIX}ping - Exibe o ping do bot
〆 ${PREFIX}hentai - Imagens salientes
〆 ${PREFIX}ddd [00] - Exibe informações do DDD
〆 ${PREFIX}encurtar - Encurtador de links\n
————————————————————————————————————————————————\n
➲ *COMANDOS GERAIS*\n
〆 ${PREFIX}fake-chat [@usuário|texto citado|mensagem que será enviada] - Cria um chat falso
〆 ${PREFIX}rank - Os 10 usuários mais ativos do grupo
〆 ${PREFIX}gerar-link [marque] - Gera link da imagem
〆 ${PREFIX}get-lid [@usuário] - Mostra o JID e LID do usuário
〆 ${PREFIX}perfil - Exibe seu perfil de usuário
〆 ${PREFIX}revelar - Revela mídia com visu única
〆 ${PREFIX}adms - Lista os admins do grupo
〆 ${PREFIX}exemplos-de-mensagens - Comandos especiais
〆 ${PREFIX}raw-message [responda] - Exibe estrutura e dados da mensagem em JSON\n
————————————————————————————————————————————————\n
➲ *INTELIGÊNCIA ARTIFICIAL*\n
〆 ${PREFIX}gemini [assunto] - Chat com o Gemini
〆 ${PREFIX}ia-sticker [descrição] - Figurinha gerada por IA
〆 ${PREFIX}pixart [descrição] - Imagem gerada por IA
〆 ${PREFIX}stable-diffusion-turbo [descrição] - Imagem gerada por IA\n
————————————————————————————————————————————————\n
➲ *EFEITOS CANVA*\n
〆 ${PREFIX}blur [marque uma imagem] - Efeito de desfoque
〆 ${PREFIX}bolsonaro - Feature do Bolsonaro gerada por IA
〆 ${PREFIX}lula - Feature do Lula gerada por IA
〆 ${PREFIX}cadeia - Feature de cadeia
〆 ${PREFIX}contraste - Efeito de contraste
〆 ${PREFIX}espelhar - Efeito espelhado
〆 ${PREFIX}gray - Efeito preto e branco
〆 ${PREFIX}inverter - Efeito negativo
〆 ${PREFIX}pixel - Efeito pixelado\n
————————————————————————————————————————————————
Jawhead 🦍`;
};

exports.ownerMenu = (user) => {
  return `*MENU DO DONO*\n
Fala @${user.jid.split('@')[0]} 🫵🦍\n
<> Se quiser mais informações sobre algum comando, use ${PREFIX}info [comando] <>\n
————————————————————————————————————————————————\n
〆 ${PREFIX}off - Desativa comandos do bot no grupo
〆 ${PREFIX}on - Ativa comandos do bot no grupo
〆 ${PREFIX}reinicie - Reinicia o bot
〆 ${PREFIX}setmenuimage [marque uma imagem] - Altera a imagem do menu do bot
〆 ${PREFIX}nickdono [seu nome] - Adiciona/Altera o nome do dono no bot
〆 ${PREFIX}setnamebot [nome] - Altera o nome do bot
〆 ${PREFIX}setprefix [novo prefixo]
〆 ${PREFIX}espiar (1/0) - Ativa a visualização automática de mensagens
〆 ${PREFIX}getid - Exibe o ID do grupo
〆 ${PREFIX}antipv - Impede comandos no pv e envia apenas um aviso
〆 ${PREFIX}antipvhard - Bloqueia automaticamente comandos no pv
〆 ${PREFIX}anticall - Bloqueia ligações para o bot\n
————————————————————————————————————————————————`;
};

exports.adminMenu = (user) => {
  return `*MENU DE ADMS*\n
Fala @${user.jid.split('@')[0]} 🫵🦍\n
<> Se quiser mais informações sobre algum comando, use ${PREFIX}info [comando] <>\n
————————————————————————————————————————————————\n
*Ativações para o Grupo*\n
〆 ${PREFIX}antiaudio [1/0] - Apaga o envio de áudio
〆 ${PREFIX}antidocument [1/0] - Apaga o envio de documento
〆 ${PREFIX}antievent [1/0] - Apaga o envio de evento
〆 ${PREFIX}antiimage [1/0] - Apaga o envio de imagem
〆 ${PREFIX}antilinkgp [1/0] - Remove membro ao mandar link de grupo
〆 ${PREFIX}antilink [1/0] - Remove membro ao mandar qualquer link
〆 ${PREFIX}antiproduct [1/0] - Apaga o envio de produto
〆 ${PREFIX}antisticker [1/0] - Apaga o envio de figurinha
〆 ${PREFIX}antivideo [1/0] - Apaga o envio de vídeo
〆 ${PREFIX}autoresponder [1/0] - Ativa auto-resposta no bot
〆 ${PREFIX}antifake [1/0] - Remove a entrada de números estrangeiros
〆 ${PREFIX}only-admin [1/0] - Apenas adms podem usar comandos
〆 ${PREFIX}welcome [1/0] - Mensagem de boas-vindas
〆 ${PREFIX}exit [1/0] - Mensagem pós-saída de membro\n
————————————————————————————————————————————————\n
*Gerenciamento do Grupo*\n
〆 ${PREFIX}ban [responda/@usuário] - Remove membro do grupo
〆 ${PREFIX}delete [reponda] - Apaga a mensagem
〆 ${PREFIX}mute [responda/@usuário] - Muta membro
〆 ${PREFIX}unmute [responda/@usuário] - Desmuta membro
〆 ${PREFIX}promover [responda/@usuário] - Promove membro para admin
〆 ${PREFIX}rebaixar [responda/@usuário] - Rebaixa admin para membro comum
〆 ${PREFIX}adv [responda/@usuário] - Adverte membro
〆 ${PREFIX}adv limpar - Remove todas as advertências
〆 ${PREFIX}listanegra [+55719386xxxx] - Adiciona número à lista de autoban [não coloque o 9 extra da operadora]
〆 ${PREFIX}remlista - Remove número da lista de autoban\n
————————————————————————————————————————————————\n
*Configurações Gerais*\n
〆 ${PREFIX}limpar - Útil após o grupo sofrer ataque de travas
〆 ${PREFIX}linkgp - Solicita o link do grupo
〆 ${PREFIX}abrir - Abre o grupo para todos os membros
〆 ${PREFIX}fechar - Fecha o grupo para todos os membros\n
————————————————————————————————————————————————\n
*Marcações/Avisos*\n
〆 ${PREFIX}marcar (texto) - Marca todos do grupo com mensagem personalizada
〆 ${PREFIX}hidetag - Marca todos do grupo
〆 ${PREFIX}inativos - Lista membros com menos de 5 mensagens no grupo
〆 ${PREFIX}agendar-mensagem [texto|tempo] - Agenda mensagem no tempo estimado
〆 ${PREFIX}cita - Marcação de texto ou mídia\n
————————————————————————————————————————————————`;
};

exports.suporteMenu = (user) => {
    return `*MENU DE SUPORTE*\n
Fala @${user.jid.split('@')[0]} 🫵🦍\n
————————————————————————————————————————————————\n
〆 ${PREFIX}bot - Exibe informações sobre mim
〆 ${PREFIX}info [comando] - Mostra detalhes sobre um comando
〆 ${PREFIX}reportar [problema] - Envia um relatório para o meu dono\n
————————————————————————————————————————————————`;
};
