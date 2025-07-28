const { bot: { name: BOT_NAME, prefix: PREFIX } } = require("./settings.json");
const packageInfo = require("../package.json");
const { readMore } = require("./utils");

exports.menuMessage = (user) => {
  const date = new Date();

  return `
Fala *${user.name}*, bem-vindo(a) 🫵🦍

————————————————————————————————————————————————

 〆 *MENU DE COMANDOS DO JAWHEAD* 〆 

————————————————————————————————————————————————

〆 MENU DONO 〆

☛ ${PREFIX}off - Desativa comandos do bot no grupo
☛ ${PREFIX}on - Ativa comandos do bot no grupo
☛ ${PREFIX}reinicie - Reinicia o bot
☛ ${PREFIX}set-menu-image (marque uma imagem) - Altera a imagem de menu do bot
☛ ${PREFIX}setprefix (prefixo) - Altera o prefixo do bot
☛ ${PREFIX}get-id - Mostra ID do grupo

————————————————————————————————————————————————

〆 ADMINS 〆

☛ ${PREFIX}anti-audio (1/0) - Apaga o envio de áudio
☛ ${PREFIX}anti-document (1/0) - Apaga o envio de documento
☛ ${PREFIX}anti-event (1/0) - Apaga o envio de evento
☛ ${PREFIX}anti-image (1/0) - Apaga o envio de imagem
☛ ${PREFIX}anti-linkgp (1/0) - Remove membro ao mandar link de grupo
☛ ${PREFIX}anti-link (1/0) - Remove membro ao mandar qualquer link
☛ ${PREFIX}ban (marque o mencione o @usuário) - Remove membro do grupo
☛ ${PREFIX}anti-product (1/0) - Apaga o envio de produto/venda
☛ ${PREFIX}anti-sticker (1/0) - Apaga o envio de figurinha
☛ ${PREFIX}anti-video (1/0) - Apaga o envio de vídeo
☛ ${PREFIX}auto-responder (1/0) - Ativa a auto-resposta do bot
☛ ${PREFIX}delete (marque) - Apaga mensagem
☛ ${PREFIX}agendar-mensagem (texto/tempo) - Agenda mensagem no tempo estimado [ex.: vou cagar/5m]
☛ ${PREFIX}abrir - Abre o grupo para todos os membros
☛ ${PREFIX}fechar - Fecha o grupo para todos os membros
☛ ${PREFIX}hidetag - Marca todos do grupo
☛ ${PREFIX}linkgp - Solicita o link do grupo
☛ ${PREFIX}mute (@usuário) - Muta membro
☛ ${PREFIX}unmute (@usuário) - Desmuta membro
☛ ${PREFIX}only-admin (1/0) - Apenas admins podem usar comandos
☛ ${PREFIX}promover (@usuário) - Promove membro para admin
☛ ${PREFIX}rebaixar (@usuário) - Rebaixa admin para membro comum
☛ ${PREFIX}adv - Adverte membro (${PREFIX}adv [limpar] remove advs e ${PREFIX}adv [ver] exibe histórico de advs)
☛ ${PREFIX}veradvs - Ver número de advertências do membro
☛ ${PREFIX}revelar - Revela visu única
☛ ${PREFIX}welcome (1/0) - Ativa as boas-vindas
☛ ${PREFIX}exit (1/0) - Ativa mensagem após saída de membro

————————————————————————————————————————————————

〆 PRINCIPAL 〆

☛ ${PREFIX}attp (texto) - Cria uma figurinha animada
☛ ${PREFIX}ttp (texto) - Cria uma figurinha estática
☛ ${PREFIX}cep (00000-000) - Consulta de CEP
☛ ${PREFIX}sticker - Converte imagem ou vídeo em figurinha
☛ ${PREFIX}fake-chat (@usuário/texto citado/mensagem que será enviada) - Cria um chat falso do usuário
☛ ${PREFIX}gerar-link (marque) - Gera link da imagem
☛ ${PREFIX}rename (ex.: oi / luxd) - Renomeia figurinha
☛ ${PREFIX}get-lid (@usuário) - Mostra o JID e LID do usuário
☛ ${PREFIX}google-search (assunto) - Pesquisa no Google
☛ ${PREFIX}perfil - Exibe o seu perfil
☛ ${PREFIX}ping - Mostra o seu ping
☛ ${PREFIX}exemplos-de-mensagens - Comandos especiais
☛ ${PREFIX}raw-message (marque) - Exibe estrutura e dados da mensagem em JSON
☛ ${PREFIX}toimg - Converte figurinha em imagem
☛ ${PREFIX}yt-search (assunto) - Pesquisa no YouTube

————————————————————————————————————————————————

〆 DOWNLOADS 〆

☛ ${PREFIX}play-audio (nome ou link) - Baixa áudio do YouTube
☛ ${PREFIX}play-video (nome ou link) - Baixa vídeo do YouTube
☛ ${PREFIX}tik-tok (link) - Vídeo do TikTok
☛ ${PREFIX}yt-mp3 (link) - Converte vídeos do YouTube para MP3
☛ ${PREFIX}yt-mp4 (link) - Converte vídeos do YouTube para MP4

————————————————————————————————————————————————

〆 BRINCADEIRAS 〆

☛ ${PREFIX}jogodavelha iniciar (@adversário)
☛ ${PREFIX}abracar (@usuário)
☛ ${PREFIX}beijar (@usuário)
☛ ${PREFIX}dado (@usuário)
☛ ${PREFIX}jantar (@usuário)
☛ ${PREFIX}lutar (@usuário)
☛ ${PREFIX}matar (@usuário)
☛ ${PREFIX}socar (@usuário)

————————————————————————————————————————————————

〆 INTELIGÊNCIA ARTIFICIAL 〆

☛ ${PREFIX}gemini (assunto) - Conversa com o Gemini
☛ ${PREFIX}ia-sticker (descrição) - Figurinha gerada por IA
☛ ${PREFIX}pixart (descrição) - Imagem gerada por IA
☛ ${PREFIX}stable-diffusion-turbo (descrição) - Imagem gerada por IA

————————————————————————————————————————————————

〆 CANVAS 〆

☛ ${PREFIX}blur (marque uma imagem) - Adiciona efeito desfoque
☛ ${PREFIX}bolsonaro (marque uma imagem)
☛ ${PREFIX}cadeia (marque uma imagem)
☛ ${PREFIX}contraste (marque uma imagem) - Adiciona efeito contraste
☛ ${PREFIX}espelhar (marque uma imagem) - Adiciona efeito espelhado
☛ ${PREFIX}gray (marque uma imagem) - Adiciona efeito preto e branco
☛ ${PREFIX}inverter (marque uma imagem) - Adiciona efeito negativo
☛ ${PREFIX}pixel (marque uma imagem) - Adiciona efeito pixelado
☛ ${PREFIX}rip

————————————————————————————————————————————————

${BOT_NAME}`;
};
