const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { isAdmin } = require(`${BASE_DIR}/middlewares`);
const activeGames = new Map();

function renderBoard(board) {
  let boardStr = "```";
  for (let i = 0; i < 9; i += 3) {
    boardStr += ` ${board[i]} | ${board[i + 1]} | ${board[i + 2]} \n`;
    if (i < 6) boardStr += "----|----|----\n";
  }
  boardStr += "```";
  return boardStr;
}

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (!["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(board[a]) && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; 
    }
  }
  return null;
}

module.exports = {
  name: "jogodavelha",
  description: "Inicia ou interage com uma partida de Jogo da Velha.",
  commands: ["jogodavelha", "jdv"],
  usage: `${PREFIX}jogodavelha [iniciar @adversario | cancelar | número]`,

  handle: async ({ args, sendReply, remoteJid, webMessage, socket }) => {
    const commandString = args.join(' ') || '';
    const game = activeGames.get(remoteJid);
    const playerJid = webMessage.key.participant;

    const PLAYER_1_SYMBOL = '❌';
    const PLAYER_2_SYMBOL = '⭕';

    if (commandString.startsWith("iniciar")) {
      if (game) {
        return sendReply("❌ Já existe um jogo em andamento neste grupo!");
      }

      const opponentJid = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!opponentJid) {
        return sendReply(`❌ Você precisa marcar um adversário!\nEx: \`${PREFIX}jogodavelha iniciar @oponente\``);
      }

      const player1Jid = webMessage.key.participant;
      const player1Name = `@${player1Jid.split('@')[0]}`;
      const opponentName = `@${opponentJid.split('@')[0]}`;

      const newGame = {
        players: { [PLAYER_1_SYMBOL]: player1Jid, [PLAYER_2_SYMBOL]: opponentJid },
        playerNames: { [PLAYER_1_SYMBOL]: player1Name, [PLAYER_2_SYMBOL]: opponentName },
        board: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
        turn: PLAYER_1_SYMBOL,
      };
      activeGames.set(remoteJid, newGame);

      // AQUI A MUDANÇA
      const initialMessage = `${PLAYER_2_SYMBOL}${PLAYER_1_SYMBOL} Jogo da Velha iniciado! ${PLAYER_1_SYMBOL}${PLAYER_2_SYMBOL}\n\n${newGame.playerNames[PLAYER_1_SYMBOL]} (${PLAYER_1_SYMBOL}) vs ${newGame.playerNames[PLAYER_2_SYMBOL]} (${PLAYER_2_SYMBOL})\n\nÉ a vez de ${newGame.playerNames[PLAYER_1_SYMBOL]} (${PLAYER_1_SYMBOL}).\n\nPara jogar, digite \`${PREFIX}jogodavelha [número]\` (de 1 a 9).\n\n${renderBoard(newGame.board)}`;

      return socket.sendMessage(remoteJid, { text: initialMessage, mentions: [player1Jid, opponentJid] });
    }

    if (commandString.startsWith("cancelar")) {
        if (!game) {
            return sendReply("❌ Não há nenhum jogo em andamento para cancelar.");
        }

        const isPlayer = Object.values(game.players).includes(playerJid);
        const isUserAdmin = await isAdmin({ remoteJid, userJid: playerJid, socket });

        if (!isPlayer && !isUserAdmin) {
            return sendReply("❌ Apenas os jogadores da partida ou um admin podem cancelar o jogo.");
        }

        activeGames.delete(remoteJid);
        const cancellerName = `@${playerJid.split('@')[0]}`;
        return socket.sendMessage(remoteJid, { text: `✅ O jogo da velha foi encerrado por ${cancellerName}.`, mentions: [playerJid] });
    }

    if (!game) {
      return sendReply(`❌ Nenhum jogo em andamento. Inicie um com \`${PREFIX}jogodavelha iniciar @adversario\``);
    }

    const currentPlayerSymbol = Object.keys(game.players).find(key => game.players[key] === playerJid);

    if (game.turn !== currentPlayerSymbol) {
      const nextPlayerJid = game.players[game.turn];
      // AQUI A MUDANÇA
      const turnMessage = `Calma! Não é a sua vez. É a vez de ${game.playerNames[game.turn]} (${game.turn}).`;
      return socket.sendMessage(remoteJid, { text: turnMessage, mentions: [nextPlayerJid] });
    }

    const move = parseInt(commandString) - 1;
    if (isNaN(move) || move < 0 || move > 8 || !["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(game.board[move])) {
      return sendReply("❌ Jogada inválida! Escolha um número de 1 a 9 que esteja livre no tabuleiro.");
    }

    game.board[move] = game.turn;
    const winnerSymbol = checkWinner(game.board);

    if (winnerSymbol) {
      const winnerJid = game.players[winnerSymbol];
      activeGames.delete(remoteJid);
      // AQUI A MUDANÇA
      const winnerMessage = `🎉 Fim de jogo! O vencedor é ${game.playerNames[winnerSymbol]} (${winnerSymbol})!\n\n${renderBoard(game.board)}`;
      return socket.sendMessage(remoteJid, { text: winnerMessage, mentions: [winnerJid] });
    }

    if (game.board.every(cell => !["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(cell))) {
      activeGames.delete(remoteJid);
      return sendReply(`👵 Deu velha! O jogo empatou!\n\n${renderBoard(game.board)}`);
    }

    game.turn = game.turn === PLAYER_1_SYMBOL ? PLAYER_2_SYMBOL : PLAYER_1_SYMBOL;
    const nextPlayerJid = game.players[game.turn];
    // AQUI A MUDANÇA
    const nextTurnMessage = `É a vez de ${game.playerNames[game.turn]} (${game.turn}).\n\n${renderBoard(game.board)}`;

    return socket.sendMessage(remoteJid, { text: nextTurnMessage, mentions: [nextPlayerJid] });
  },
};
