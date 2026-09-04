/* ============================================================
   GRAND FAKE CASINO — script.js
   Dinheiro 100% fictício — apenas para entretenimento.
   ============================================================ */

(() => {
  'use strict';

  /* ------------------------------------------------------------
     WALLET (fichas fictícias)
  ------------------------------------------------------------ */
  const STORAGE_KEY = 'gfc_balance_v1';
  let balance = loadBalance();

  function loadBalance(){
    const v = localStorage.getItem(STORAGE_KEY);
    const n = v !== null ? Number(v) : 1000;
    return isFinite(n) && n >= 0 ? n : 1000;
  }
  function saveBalance(){
    localStorage.setItem(STORAGE_KEY, String(Math.round(balance * 100) / 100));
  }
  function formatMoney(n){
    return '🪙 ' + (Math.round(n * 100) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }
  function updateBalanceDisplay(){
    const el = document.getElementById('balanceValue');
    el.textContent = formatMoney(balance);
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
  function addBalance(amount){
    balance += amount;
    saveBalance();
    updateBalanceDisplay();
  }
  function subtractBalance(amount){
    balance -= amount;
    saveBalance();
    updateBalanceDisplay();
  }
  function validateBet(inputEl){
    const bet = Math.floor(Number(inputEl.value));
    if (!bet || bet < 1){
      showToast('Digite uma aposta válida.', 'lose');
      return null;
    }
    if (bet > balance){
      showToast('Saldo insuficiente. Deposite mais fichas!', 'lose');
      return null;
    }
    return bet;
  }

  /* ------------------------------------------------------------
     TOASTS
  ------------------------------------------------------------ */
  function showToast(msg, type = ''){
    const container = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' ' + type : '');
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 300);
    }, 2600);
  }

  /* ------------------------------------------------------------
     CONFETTI
  ------------------------------------------------------------ */
  function spawnConfetti(count = 30){
    const container = document.getElementById('confettiContainer');
    const colors = ['#ffd166', '#a855f7', '#22e584', '#ff4d6d', '#ffffff'];
    for (let i = 0; i < count; i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() < 0.5 ? '50%' : '2px';
      const duration = 2 + Math.random() * 1.6;
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = (Math.random() * 0.3) + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(p);
      setTimeout(() => p.remove(), (duration + 0.6) * 1000);
    }
  }

  /* ------------------------------------------------------------
     MODALS (depósito / saque)
  ------------------------------------------------------------ */
  function openModal(id){ document.getElementById(id).classList.add('open'); }
  function closeModal(id){ document.getElementById(id).classList.remove('open'); }

  function initModals(){
    document.getElementById('openDeposit').addEventListener('click', () => openModal('depositModal'));
    document.getElementById('openWithdraw').addEventListener('click', () => openModal('withdrawModal'));

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Depósito
    const depositAmount = document.getElementById('depositAmount');
    document.querySelectorAll('#depositModal .quick-amounts button').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = Number(btn.dataset.amount);
        depositAmount.value = (Number(depositAmount.value) || 0) + amt;
      });
    });
    document.getElementById('confirmDeposit').addEventListener('click', () => {
      const amt = Math.floor(Number(depositAmount.value));
      if (!amt || amt < 1){
        showToast('Digite um valor válido para depositar.', 'lose');
        return;
      }
      addBalance(amt);
      showToast(`Depósito de ${formatMoney(amt)} realizado!`, 'win');
      spawnConfetti(18);
      depositAmount.value = '';
      closeModal('depositModal');
    });

    // Saque
    const withdrawAmount = document.getElementById('withdrawAmount');
    document.querySelectorAll('#withdrawModal .quick-amounts button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.amount === 'max'){
          withdrawAmount.value = Math.floor(balance);
        } else {
          withdrawAmount.value = Number(btn.dataset.amount);
        }
      });
    });
    document.getElementById('confirmWithdraw').addEventListener('click', () => {
      const amt = Math.floor(Number(withdrawAmount.value));
      if (!amt || amt < 1){
        showToast('Digite um valor válido para sacar.', 'lose');
        return;
      }
      if (amt > balance){
        showToast('Você não tem fichas suficientes para esse saque.', 'lose');
        return;
      }
      subtractBalance(amt);
      showToast(`Saque de ${formatMoney(amt)} concluído!`, 'win');
      withdrawAmount.value = '';
      closeModal('withdrawModal');
    });
  }

  /* ------------------------------------------------------------
     NAVEGAÇÃO ENTRE JOGOS
  ------------------------------------------------------------ */
  function initNav(){
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const game = btn.dataset.game;
        document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + game).classList.add('active');
      });
    });
  }

  /* ------------------------------------------------------------
     BOTÕES DE AJUSTE DE APOSTA (½ / 2x) — genérico
  ------------------------------------------------------------ */
  function initBetAdjust(){
    document.querySelectorAll('.bet-adj').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        let val = Math.floor(Number(input.value)) || 1;
        val = btn.dataset.action === 'half' ? Math.max(1, Math.floor(val / 2)) : val * 2;
        input.value = val;
      });
    });
  }

  /* ============================================================
     🎰 CAÇA-NÍQUEL (SLOTS)
  ============================================================ */
  const SLOT_SYMBOLS = [
    { sym: '🍒', weight: 30, pay: 2 },
    { sym: '🍋', weight: 24, pay: 3 },
    { sym: '🍇', weight: 18, pay: 4 },
    { sym: '🔔', weight: 12, pay: 6 },
    { sym: '⭐', weight: 8,  pay: 10 },
    { sym: '7️⃣', weight: 5,  pay: 15 },
    { sym: '💎', weight: 3,  pay: 25 },
  ];
  const SLOT_TOTAL_WEIGHT = SLOT_SYMBOLS.reduce((a, s) => a + s.weight, 0);

  function pickSlotSymbol(){
    let r = Math.random() * SLOT_TOTAL_WEIGHT;
    for (const s of SLOT_SYMBOLS){
      if (r < s.weight) return s.sym;
      r -= s.weight;
    }
    return SLOT_SYMBOLS[0].sym;
  }
  function payForSymbol(sym){
    const found = SLOT_SYMBOLS.find(s => s.sym === sym);
    return found ? found.pay : 0;
  }

  function fillReelIdle(){
    document.querySelectorAll('.symbol-slot').forEach(s => {
      s.textContent = pickSlotSymbol();
    });
  }

  function spinReel(reelIndex, stopDelay, onDone){
    const reel = document.getElementById('reel-' + reelIndex);
    const slots = reel.querySelectorAll('.symbol-slot');
    reel.classList.add('spinning');

    const interval = setInterval(() => {
      slots.forEach(s => { s.textContent = pickSlotSymbol(); });
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      reel.classList.remove('spinning');
      const finalSymbols = [pickSlotSymbol(), pickSlotSymbol(), pickSlotSymbol()];
      slots.forEach((s, i) => {
        s.textContent = finalSymbols[i];
        s.classList.remove('landed', 'win-glow');
        void s.offsetWidth;
        s.classList.add('landed');
      });
      onDone(finalSymbols[1], slots[1]);
    }, stopDelay);
  }

  function evaluateSlot(middles, middleEls, bet){
    const msgEl = document.getElementById('slotMessage');
    const counts = {};
    middles.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
    let bestSym = null, bestCount = 0;
    Object.entries(counts).forEach(([sym, c]) => {
      if (c > bestCount){ bestCount = c; bestSym = sym; }
    });

    let mult = 0;
    if (bestCount === 3) mult = payForSymbol(bestSym);
    else if (bestCount === 2) mult = 1.2;

    if (mult > 0){
      const win = Math.round(bet * mult * 100) / 100;
      addBalance(win);
      msgEl.textContent = `🎉 Você ganhou ${formatMoney(win)}! (x${mult})`;
      msgEl.className = 'game-message win';
      middles.forEach((m, i) => { if (m === bestSym) middleEls[i].classList.add('win-glow'); });
      showToast(`Caça-Níquel: +${formatMoney(win)}`, 'win');
      if (mult >= 6) spawnConfetti(mult >= 15 ? 60 : 30);
    } else {
      msgEl.textContent = 'Não foi dessa vez. Tente novamente!';
      msgEl.className = 'game-message lose';
    }
    document.getElementById('slotSpinBtn').disabled = false;
  }

  function doSlotSpin(){
    const betInput = document.getElementById('slotBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    subtractBalance(bet);
    document.getElementById('slotSpinBtn').disabled = true;
    const msgEl = document.getElementById('slotMessage');
    msgEl.textContent = 'Girando...';
    msgEl.className = 'game-message';

    const middles = [null, null, null];
    const middleEls = [null, null, null];
    let doneCount = 0;
    const delays = [700, 1000, 1300];

    for (let i = 0; i < 3; i++){
      spinReel(i, delays[i], (mid, midEl) => {
        middles[i] = mid;
        middleEls[i] = midEl;
        doneCount++;
        if (doneCount === 3){
          setTimeout(() => evaluateSlot(middles, middleEls, bet), 150);
        }
      });
    }
  }

  function initSlots(){
    fillReelIdle();
    document.getElementById('slotSpinBtn').addEventListener('click', doSlotSpin);
  }

  /* ============================================================
     🎡 ROLETA
  ============================================================ */
  const WHEEL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const SEG = 360 / WHEEL_ORDER.length;

  let rouletteRotation = 0;
  let selectedBetType = null;
  let selectedNumber = null;

  function buildWheelGradient(){
    const stops = WHEEL_ORDER.map((num, i) => {
      const color = num === 0 ? '#0fb968' : (RED_NUMBERS.has(num) ? '#ff4d6d' : '#20202c');
      const start = (i * SEG).toFixed(3) + 'deg';
      const end = ((i + 1) * SEG).toFixed(3) + 'deg';
      return `${color} ${start} ${end}`;
    });
    document.getElementById('rouletteWheel').style.background = `conic-gradient(${stops.join(',')})`;
  }

  function updateSelectedBetDisplay(){
    const el = document.getElementById('rouletteSelectedBet');
    if (!selectedBetType){
      el.textContent = 'Nenhuma aposta selecionada';
      return;
    }
    const labels = {
      red: 'Vermelho (paga x2)', black: 'Preto (paga x2)', green: 'Verde / 0 (paga x14)',
      even: 'Par (paga x2)', odd: 'Ímpar (paga x2)', low: '1–18 (paga x2)', high: '19–36 (paga x2)',
      number: `Número ${selectedNumber} (paga x35)`
    };
    el.textContent = 'Aposta selecionada: ' + (labels[selectedBetType] || '');
  }

  function addRouletteHistory(num){
    const container = document.getElementById('rouletteHistory');
    const span = document.createElement('span');
    span.textContent = num;
    span.className = num === 0 ? 'hist-green' : (RED_NUMBERS.has(num) ? 'hist-red' : 'hist-black');
    container.prepend(span);
    while (container.children.length > 14) container.removeChild(container.lastChild);
  }

  function finishRouletteSpin(resultNumber, bet){
    const hub = document.getElementById('rouletteResultNumber');
    hub.textContent = resultNumber;
    hub.classList.remove('pop');
    void hub.offsetWidth;
    hub.classList.add('pop');
    addRouletteHistory(resultNumber);

    let win = false, mult = 0;
    switch (selectedBetType){
      case 'red':   win = RED_NUMBERS.has(resultNumber); mult = 2; break;
      case 'black': win = resultNumber !== 0 && !RED_NUMBERS.has(resultNumber); mult = 2; break;
      case 'green': win = resultNumber === 0; mult = 14; break;
      case 'even':  win = resultNumber !== 0 && resultNumber % 2 === 0; mult = 2; break;
      case 'odd':   win = resultNumber % 2 === 1; mult = 2; break;
      case 'low':   win = resultNumber >= 1 && resultNumber <= 18; mult = 2; break;
      case 'high':  win = resultNumber >= 19 && resultNumber <= 36; mult = 2; break;
      case 'number':win = resultNumber === selectedNumber; mult = 35; break;
    }

    const msgEl = document.getElementById('rouletteMessage');
    if (win){
      const amount = bet * mult;
      addBalance(amount);
      msgEl.textContent = `🎉 Caiu no ${resultNumber}! Você ganhou ${formatMoney(amount)}!`;
      msgEl.className = 'game-message win';
      showToast(`Roleta: +${formatMoney(amount)}`, 'win');
      spawnConfetti(mult >= 14 ? 60 : 30);
    } else {
      msgEl.textContent = `Caiu no ${resultNumber}. Não foi dessa vez!`;
      msgEl.className = 'game-message lose';
    }

    document.getElementById('rouletteSpinBtn').disabled = false;
    document.querySelectorAll('#rouletteBets .chip, .chip-number').forEach(c => c.disabled = false);
  }

  function doRouletteSpin(){
    if (!selectedBetType){
      showToast('Selecione um tipo de aposta primeiro.', 'lose');
      return;
    }
    const betInput = document.getElementById('rouletteBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    if (selectedBetType === 'number' && (selectedNumber === null || isNaN(selectedNumber))){
      showToast('Escolha um número válido (0–36).', 'lose');
      return;
    }
    subtractBalance(bet);
    document.getElementById('rouletteSpinBtn').disabled = true;
    document.querySelectorAll('#rouletteBets .chip, .chip-number').forEach(c => c.disabled = true);

    const messageEl = document.getElementById('rouletteMessage');
    messageEl.textContent = 'Girando a roleta...';
    messageEl.className = 'game-message';

    const resultNumber = Math.floor(Math.random() * 37);
    const idx = WHEEL_ORDER.indexOf(resultNumber);
    const center = idx * SEG + SEG / 2;
    const targetMod = (360 - center) % 360;
    const currentMod = ((rouletteRotation % 360) + 360) % 360;
    const diff = (targetMod - currentMod + 360) % 360;
    const spins = 6;
    rouletteRotation += spins * 360 + diff;

    document.getElementById('rouletteWheel').style.transform = `rotate(${rouletteRotation}deg)`;

    setTimeout(() => finishRouletteSpin(resultNumber, bet), 4300);
  }

  function initRoulette(){
    buildWheelGradient();

    document.querySelectorAll('#rouletteBets .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#rouletteBets .chip, .chip-number').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedBetType = chip.dataset.bet;
        selectedNumber = null;
        updateSelectedBetDisplay();
      });
    });

    document.querySelector('.chip-number').addEventListener('click', () => {
      const input = document.getElementById('rouletteNumberInput');
      const val = Math.floor(Number(input.value));
      if (isNaN(val) || val < 0 || val > 36){
        showToast('Digite um número entre 0 e 36.', 'lose');
        return;
      }
      document.querySelectorAll('#rouletteBets .chip, .chip-number').forEach(c => c.classList.remove('selected'));
      document.querySelector('.chip-number').classList.add('selected');
      selectedBetType = 'number';
      selectedNumber = val;
      updateSelectedBetDisplay();
    });

    document.getElementById('rouletteSpinBtn').addEventListener('click', doRouletteSpin);
  }

  /* ============================================================
     🃏 BLACKJACK
  ============================================================ */
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const SUITS = ['♠','♥','♦','♣'];
  const RED_SUITS = new Set(['♥','♦']);

  let bjDeck = [];
  let playerCards = [];
  let dealerCards = [];
  let dealerHidden = true;
  let bjBet = 0;
  let bjRoundActive = false;

  function buildShuffledDeck(){
    const deck = [];
    for (const suit of SUITS){
      for (const rank of RANKS){
        deck.push({ rank, suit });
      }
    }
    for (let i = deck.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  function cardValue(rank){
    if (rank === 'A') return 11;
    if (['K','Q','J'].includes(rank)) return 10;
    return parseInt(rank, 10);
  }
  function handScore(cards){
    let total = 0, aces = 0;
    cards.forEach(c => {
      total += cardValue(c.rank);
      if (c.rank === 'A') aces++;
    });
    while (total > 21 && aces > 0){ total -= 10; aces--; }
    return total;
  }

  function createCardEl(card, faceDown){
    const div = document.createElement('div');
    if (faceDown){
      div.className = 'card card-back';
      return div;
    }
    div.className = 'card' + (RED_SUITS.has(card.suit) ? ' red' : '');
    div.innerHTML = `
      <span class="rank-top">${card.rank}${card.suit}</span>
      <span class="suit-mid">${card.suit}</span>
      <span class="rank-bottom">${card.rank}${card.suit}</span>
    `;
    return div;
  }

  function renderBlackjack(){
    const dealerContainer = document.getElementById('dealerCards');
    const playerContainer = document.getElementById('playerCards');
    dealerContainer.innerHTML = '';
    playerContainer.innerHTML = '';

    dealerCards.forEach((c, i) => {
      const faceDown = dealerHidden && i === 1;
      dealerContainer.appendChild(createCardEl(c, faceDown));
    });
    playerCards.forEach(c => playerContainer.appendChild(createCardEl(c, false)));

    document.getElementById('dealerScore').textContent = dealerHidden ? '?' : handScore(dealerCards);
    document.getElementById('playerScore').textContent = handScore(playerCards);
  }

  function setBlackjackMessage(text, cls){
    const el = document.getElementById('blackjackMessage');
    el.textContent = text;
    el.className = 'game-message' + (cls ? ' ' + cls : '');
  }

  function finalizeRound(){
    bjRoundActive = false;
    document.getElementById('dealBtn').disabled = false;
    document.getElementById('hitBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
  }

  function resolveRound(){
    const p = handScore(playerCards);
    const d = handScore(dealerCards);
    const playerBJ = playerCards.length === 2 && p === 21;
    const dealerBJ = dealerCards.length === 2 && d === 21;

    let outcomeMsg = '', win = false, payoutMult = 0;

    if (p > 21){
      outcomeMsg = `Você estourou com ${p}. Perdeu a aposta.`;
    } else if (playerBJ && !dealerBJ){
      payoutMult = 2.5; win = true;
      outcomeMsg = `Blackjack! Você ganhou ${formatMoney(bjBet * payoutMult)}!`;
    } else if (dealerBJ && !playerBJ){
      outcomeMsg = 'O dealer tem Blackjack. Você perdeu.';
    } else if (playerBJ && dealerBJ){
      payoutMult = 1; win = true;
      outcomeMsg = 'Empate — ambos com Blackjack. Aposta devolvida.';
    } else if (d > 21){
      payoutMult = 2; win = true;
      outcomeMsg = `O dealer estourou com ${d}! Você ganhou ${formatMoney(bjBet * payoutMult)}!`;
    } else if (p > d){
      payoutMult = 2; win = true;
      outcomeMsg = `Você venceu ${p} a ${d}! Ganhou ${formatMoney(bjBet * payoutMult)}!`;
    } else if (p < d){
      outcomeMsg = `O dealer venceu ${d} a ${p}.`;
    } else {
      payoutMult = 1; win = true;
      outcomeMsg = `Empate em ${p}. Aposta devolvida.`;
    }

    if (payoutMult > 0) addBalance(bjBet * payoutMult);
    setBlackjackMessage(outcomeMsg, win ? 'win' : 'lose');
    if (win && payoutMult > 1){
      showToast(`Blackjack: +${formatMoney(bjBet * payoutMult)}`, 'win');
      spawnConfetti(payoutMult >= 2.5 ? 50 : 26);
    } else if (!win){
      showToast('Blackjack: você perdeu essa rodada.', 'lose');
    }
    finalizeRound();
  }

  function endRoundByBust(){
    dealerHidden = false;
    renderBlackjack();
    resolveRound();
  }

  function dealerStep(){
    if (handScore(dealerCards) < 17){
      dealerCards.push(bjDeck.pop());
      renderBlackjack();
      setTimeout(dealerStep, 700);
    } else {
      resolveRound();
    }
  }

  function standFlow(){
    dealerHidden = false;
    renderBlackjack();
    setTimeout(dealerStep, 600);
  }

  function doDeal(){
    const betInput = document.getElementById('blackjackBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    subtractBalance(bet);
    bjBet = bet;

    bjDeck = buildShuffledDeck();
    playerCards = [bjDeck.pop(), bjDeck.pop()];
    dealerCards = [bjDeck.pop(), bjDeck.pop()];
    dealerHidden = true;
    bjRoundActive = true;

    renderBlackjack();
    setBlackjackMessage('Boa sorte! Peça carta ou pare.', '');
    document.getElementById('dealBtn').disabled = true;
    document.getElementById('hitBtn').disabled = false;
    document.getElementById('standBtn').disabled = false;

    if (handScore(playerCards) === 21){
      document.getElementById('hitBtn').disabled = true;
      document.getElementById('standBtn').disabled = true;
      setTimeout(standFlow, 700);
    }
  }

  function doHit(){
    if (!bjRoundActive) return;
    playerCards.push(bjDeck.pop());
    renderBlackjack();
    const score = handScore(playerCards);
    if (score > 21){
      document.getElementById('hitBtn').disabled = true;
      document.getElementById('standBtn').disabled = true;
      setTimeout(endRoundByBust, 400);
    } else if (score === 21){
      document.getElementById('hitBtn').disabled = true;
      document.getElementById('standBtn').disabled = true;
      setTimeout(standFlow, 500);
    }
  }

  function doStand(){
    if (!bjRoundActive) return;
    document.getElementById('hitBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
    standFlow();
  }

  function initBlackjack(){
    document.getElementById('dealBtn').addEventListener('click', doDeal);
    document.getElementById('hitBtn').addEventListener('click', doHit);
    document.getElementById('standBtn').addEventListener('click', doStand);
  }

  /* ============================================================
     🎲 DADOS
  ============================================================ */
  let diceMode = 'under';

  function computeDiceStats(){
    const targetInput = document.getElementById('diceTarget');
    const target = Number(targetInput.value);
    document.getElementById('diceTargetValue').textContent = target;

    let chance = diceMode === 'under' ? target / 100 : (99 - target) / 100;
    chance = Math.max(0.01, Math.min(0.98, chance));
    const mult = 0.99 / chance;

    document.getElementById('diceWinChance').textContent = (chance * 100).toFixed(2) + '%';
    document.getElementById('diceMultiplier').textContent = mult.toFixed(4) + 'x';
    return { chance, mult, target };
  }

  function doDiceRoll(){
    const betInput = document.getElementById('diceBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    subtractBalance(bet);

    const rollBtn = document.getElementById('diceRollBtn');
    rollBtn.disabled = true;

    const { mult, target } = computeDiceStats();
    const cube = document.getElementById('diceCube');
    cube.classList.remove('win', 'lose');
    cube.classList.add('rolling');

    const msgEl = document.getElementById('diceMessage');
    msgEl.textContent = 'Rolando...';
    msgEl.className = 'game-message';

    const interval = setInterval(() => {
      cube.textContent = Math.floor(Math.random() * 100);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      cube.classList.remove('rolling');
      const roll = Math.floor(Math.random() * 100);
      cube.textContent = roll;
      const win = diceMode === 'under' ? roll < target : roll > target;

      if (win){
        const amount = bet * mult;
        addBalance(amount);
        cube.classList.add('win');
        msgEl.textContent = `🎉 Deu ${roll}! Você ganhou ${formatMoney(amount)}!`;
        msgEl.className = 'game-message win';
        showToast(`Dados: +${formatMoney(amount)}`, 'win');
        if (mult >= 5) spawnConfetti(30);
      } else {
        cube.classList.add('lose');
        msgEl.textContent = `Deu ${roll}. Não foi dessa vez!`;
        msgEl.className = 'game-message lose';
      }
      rollBtn.disabled = false;
    }, 900);
  }

  function initDice(){
    const targetInput = document.getElementById('diceTarget');
    const underBtn = document.getElementById('diceModeUnder');
    const overBtn = document.getElementById('diceModeOver');

    targetInput.addEventListener('input', computeDiceStats);
    underBtn.addEventListener('click', () => {
      diceMode = 'under';
      underBtn.classList.add('active');
      overBtn.classList.remove('active');
      computeDiceStats();
    });
    overBtn.addEventListener('click', () => {
      diceMode = 'over';
      overBtn.classList.add('active');
      underBtn.classList.remove('active');
      computeDiceStats();
    });
    document.getElementById('diceRollBtn').addEventListener('click', doDiceRoll);
    computeDiceStats();
  }

  /* ============================================================
     🪙 CARA OU COROA
  ============================================================ */
  let coinSide = 'cara';
  let coinRotation = 0;

  function doCoinFlip(){
    const betInput = document.getElementById('coinflipBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    subtractBalance(bet);

    const flipBtn = document.getElementById('coinflipBtn');
    flipBtn.disabled = true;

    const msgEl = document.getElementById('coinflipMessage');
    msgEl.textContent = 'Girando a moeda...';
    msgEl.className = 'game-message';

    const result = Math.random() < 0.5 ? 'cara' : 'coroa';
    const faceOffset = result === 'cara' ? 0 : 180;
    const currentMod = ((coinRotation % 360) + 360) % 360;
    const diff = (faceOffset - currentMod + 360) % 360;
    coinRotation += 5 * 360 + diff;

    document.getElementById('coin').style.transform = `rotateY(${coinRotation}deg)`;

    setTimeout(() => {
      const win = result === coinSide;
      if (win){
        const amount = bet * 2;
        addBalance(amount);
        msgEl.textContent = `🎉 Deu ${result === 'cara' ? 'Cara' : 'Coroa'}! Você ganhou ${formatMoney(amount)}!`;
        msgEl.className = 'game-message win';
        showToast(`Cara ou Coroa: +${formatMoney(amount)}`, 'win');
        spawnConfetti(24);
      } else {
        msgEl.textContent = `Deu ${result === 'cara' ? 'Cara' : 'Coroa'}. Não foi dessa vez!`;
        msgEl.className = 'game-message lose';
      }
      flipBtn.disabled = false;
    }, 1200);
  }

  function initCoinflip(){
    const caraBtn = document.getElementById('coinCara');
    const coroaBtn = document.getElementById('coinCoroa');
    caraBtn.addEventListener('click', () => {
      coinSide = 'cara';
      caraBtn.classList.add('active');
      coroaBtn.classList.remove('active');
    });
    coroaBtn.addEventListener('click', () => {
      coinSide = 'coroa';
      coroaBtn.classList.add('active');
      caraBtn.classList.remove('active');
    });
    document.getElementById('coinflipBtn').addEventListener('click', doCoinFlip);
  }

  /* ============================================================
     🚀 CRASH
  ============================================================ */
  let crashRunning = false;
  let crashCashedOut = false;
  let crashBetAmount = 0;
  let crashStartTime = 0;
  let crashPoint = 0;
  let crashRafId = null;
  let crashPoints = [];

  function generateCrashPoint(){
    const houseEdge = 0.03;
    const r = Math.random();
    if (r < houseEdge) return 1.00;
    let point = 0.97 / (1 - r);
    point = Math.floor(point * 100) / 100;
    return Math.min(point, 100);
  }

  function addCrashHistory(point, cashedOut){
    const container = document.getElementById('crashHistory');
    const span = document.createElement('span');
    span.textContent = point.toFixed(2) + 'x';
    span.className = (cashedOut || point >= 2) ? 'h-win' : 'h-lose';
    container.prepend(span);
    while (container.children.length > 12) container.removeChild(container.lastChild);
  }

  function currentCrashMultiplier(now){
    const elapsedSec = (now - crashStartTime) / 1000;
    return Math.exp(0.5 * elapsedSec);
  }

  function crashTick(now){
    const m = currentCrashMultiplier(now);
    if (m >= crashPoint){
      finishCrash();
      return;
    }
    document.getElementById('crashMultiplier').textContent = m.toFixed(2) + 'x';
    const elapsedSec = (now - crashStartTime) / 1000;
    const x = Math.min(580, elapsedSec * 70);
    const y = Math.max(15, 300 - Math.min(280, Math.pow(m - 1, 0.7) * 90));
    crashPoints.push({ x, y });
    document.getElementById('crashLine').setAttribute(
      'points',
      crashPoints.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')
    );
    crashRafId = requestAnimationFrame(crashTick);
  }

  function finishCrash(){
    cancelAnimationFrame(crashRafId);
    crashRunning = false;
    document.getElementById('crashLine').classList.add('crashed');
    document.getElementById('crashMultiplier').textContent = crashPoint.toFixed(2) + 'x';
    document.getElementById('crashStartBtn').disabled = false;
    document.getElementById('crashCashoutBtn').disabled = true;
    addCrashHistory(crashPoint, crashCashedOut);

    const msgEl = document.getElementById('crashMessage');
    if (!crashCashedOut){
      msgEl.textContent = `💥 Estourou em ${crashPoint.toFixed(2)}x! Você perdeu a aposta.`;
      msgEl.className = 'game-message lose';
      document.getElementById('crashMultiplier').classList.add('lose');
      showToast('Crash: estourou antes de você retirar.', 'lose');
    }

    setTimeout(() => {
      const overlay = document.getElementById('crashOverlay');
      overlay.textContent = 'Aposte e clique em Iniciar';
      overlay.classList.remove('hidden');
    }, 1400);
  }

  function startCrash(){
    if (crashRunning) return;
    const betInput = document.getElementById('crashBet');
    const bet = validateBet(betInput);
    if (bet === null) return;
    subtractBalance(bet);

    crashRunning = true;
    crashCashedOut = false;
    crashBetAmount = bet;
    crashPoint = generateCrashPoint();
    crashPoints = [{ x: 0, y: 300 }];

    document.getElementById('crashStartBtn').disabled = true;
    document.getElementById('crashCashoutBtn').disabled = false;
    document.getElementById('crashOverlay').classList.add('hidden');

    const line = document.getElementById('crashLine');
    line.classList.remove('crashed');
    line.setAttribute('points', '0,300');

    const multEl = document.getElementById('crashMultiplier');
    multEl.classList.remove('win', 'lose');
    multEl.textContent = '1.00x';

    const msgEl = document.getElementById('crashMessage');
    msgEl.textContent = 'Voando... retire antes de estourar!';
    msgEl.className = 'game-message';

    crashStartTime = performance.now();
    crashRafId = requestAnimationFrame(crashTick);
  }

  function doCashout(){
    if (!crashRunning || crashCashedOut) return;
    crashCashedOut = true;
    const m = currentCrashMultiplier(performance.now());
    const winAmount = crashBetAmount * m;
    addBalance(winAmount);

    document.getElementById('crashCashoutBtn').disabled = true;
    const msgEl = document.getElementById('crashMessage');
    msgEl.textContent = `✅ Retirado em ${m.toFixed(2)}x — você ganhou ${formatMoney(winAmount)}!`;
    msgEl.className = 'game-message win';
    document.getElementById('crashMultiplier').classList.add('win');
    showToast(`Crash: +${formatMoney(winAmount)}`, 'win');
    spawnConfetti(34);
  }

  function initCrash(){
    document.getElementById('crashStartBtn').addEventListener('click', startCrash);
    document.getElementById('crashCashoutBtn').addEventListener('click', doCashout);
  }

  /* ------------------------------------------------------------
     INIT GERAL
  ------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
    initModals();
    initNav();
    initBetAdjust();
    initSlots();
    initRoulette();
    initBlackjack();
    initDice();
    initCoinflip();
    initCrash();
  });

})();