// Variavel para armazenar o personagem do jogador
let player = {
    name: '',
    level: 1,
    experience: 0,
    health: 100,
    attack: 10,
    defense: 5,
};

let inArena = false;

// Variavel para armazenar o monstro
let monster = {};
const regions = {
    Pantano: ['slime', 'cobra', 'goblin'],
    Selva: ['hobgoblin', 'Ork', 'troll'],
    Montanha: ['Basilisco', 'serpente gigante', 'Dragão']
};

// Variaveis para a arena
const arenaOpponentsData = {
    Médio: ['Ladrão', 'Assassino', 'Arqueiro'],
    Pesado: ['Guerreiro', 'Paladino', 'Heroi']
};

// Dicionário de monstros
const monsters = {
    slime: { health: 20, attack: 5, defense: 2, experience: 10, drops: ['slime gel', 'small potion'] },
    cobra: { health: 30, attack: 7, defense: 3, experience: 15, drops: ['snake skin', 'medium potion'] },
    goblin: { health: 40, attack: 10, defense: 4, experience: 20, drops: ['goblin ear', 'large potion'] },
    hobgoblin: { health: 50, attack: 12, defense: 5, experience: 25, drops: ['hobgoblin tooth', 'large potion'] },
    Ork: { health: 60, attack: 15, defense: 6, experience: 30, drops: ['ork tusk', 'large potion'] },
    troll: { health: 70, attack: 18, defense: 7, experience: 35, drops: ['troll hair', 'large potion'] },
    Basilisco: { health: 80, attack: 20, defense: 8, experience: 40, drops: ['basilisk scale', 'large potion'] },
    'serpente gigante': { health: 90, attack: 22, defense: 9, experience: 45, drops: ['giant snake fang', 'large potion'] },
    Dragão: { health: 100, attack: 25, defense: 10, experience: 50, drops: ['dragon scale', 'large potion'] }
};

// Dicionário de desafiantes da arena
const arenaChallengers = {
    Médio: {
        Ladrão: { health: 8.0, attack: 18, defense: 8, experience: 40, drops: ['dagger', 'medium potion'] },
        Assassino: { health: 9.0, attack: 20, defense: 9, experience: 45, drops: ['assassin blade', 'medium potion'] },
        Arqueiro: { health: 8.5, attack: 19, defense: 7, experience: 42, drops: ['bow', 'medium potion'] }
    },
    Pesado: {
        Guerreiro: { health: 100, attack: 22, defense: 12, experience: 50, drops: ['sword', 'large potion'] },
        Paladino: { health: 110, attack: 24, defense: 14, experience: 55, drops: ['paladin shield', 'large potion'] },
        Heroi: { health: 120, attack: 26, defense: 16, experience: 60, drops: ['hero sword', 'large potion'] }
    }
};

// Função para criar um personagem
function createCharacter() {
    const name = document.getElementById('characterName').value;
    if (name) {
        let characters = JSON.parse(localStorage.getItem('characters')) || [];
        characters.push({ name, level: 1, experience: 0, health: 100, attack: 10, defense: 5 });
        localStorage.setItem('characters', JSON.stringify(characters));
        alert('Personagem criado: ' + name);
        loadCharacters();
    } else {
        alert('Por favor, digite um nome para o personagem.');
    }
}

// Função para carregar os personagens
function loadCharacters() {
    const characterList = document.getElementById('characterList');
    characterList.innerHTML = '<option value="">Selecione um personagem</option>';
    let characters = JSON.parse(localStorage.getItem('characters')) || [];
    characters.forEach(character => {
        let option = document.createElement('option');
        option.value = character.name;
        option.textContent = character.name;
        characterList.appendChild(option);
    });
}

// Função para selecionar um personagem
function selectCharacter() {
    const selectedCharacter = document.getElementById('characterList').value;
    if (selectedCharacter) {
        document.getElementById('enterGame').classList.remove('hidden');
    } else {
        document.getElementById('enterGame').classList.add('hidden');
    }
}

// Função para entrar no jogo
function enterGame() {
    const selectedCharacter = document.getElementById('characterList').value;
    let characters = JSON.parse(localStorage.getItem('characters')) || [];
    player = characters.find(character => character.name === selectedCharacter);
    document.getElementById('creation').classList.add('hidden');
    document.getElementById('selection').classList.add('hidden');
    document.getElementById('actions').classList.remove('hidden');
    updatePlayerHud();
}

// Função para atualizar o HUD do jogador
function updatePlayerHud() {
    document.getElementById('hudName').textContent = player.name;
    document.getElementById('hudLevel').textContent = player.level;
    document.getElementById('hudHealth').textContent = player.health;
    document.getElementById('hudExperience').textContent = player.experience;
    document.getElementById('hudAttack').textContent = player.attack;
    document.getElementById('hudDefense').textContent = player.defense;
    document.getElementById('hudGold').textContent = player.gold || 0;
    document.getElementById('hudConsecutiveWins').textContent = player.consecutiveWins || 0;
    document.getElementById('hudRecordWins').textContent = player.recordWins || 0;
}

// Função para atualizar o HUD do inimigo
function updateEnemyHud() {
    document.getElementById('hudEnemyName').textContent = monster.name;
    document.getElementById('hudEnemyHealth').textContent = monster.health;
    document.getElementById('hudEnemyAttack').textContent = monster.attack;
    document.getElementById('hudEnemyDefense').textContent = monster.defense;
}

// Função para ir caçar
function goToHunt() {
    document.getElementById('actions').classList.add('hidden');
    document.getElementById('hunting').classList.remove('hidden');
}

// Função para iniciar a caçada
function startHunt(region) {
    const availableMonsters = regions[region];
    const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
    monster = { ...monsters[randomMonster], name: randomMonster };
    document.getElementById('hunting').classList.add('hidden');
    document.getElementById('battle').classList.remove('hidden');
    document.getElementById('enemyHud').classList.remove('hidden');
    document.getElementById('battleLog').innerHTML = `<span class="log-enemy">Você encontrou um ${randomMonster}! Prepare-se para a batalha!</span>`;
    updateEnemyHud();
}

// Função para atacar
function attack() {
    const baseDamage = Math.max(0, player.attack - monster.defense);
    const variation = baseDamage * 0.2; // 20% de variação
    const playerDamage = Math.round(baseDamage + (Math.random() * variation * 2 - variation)); // Aleatoriza e arredonda o dano
    monster.health -= playerDamage;
    document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você atacou e causou ${playerDamage} de dano.</span>`;
    updateEnemyHud();

    if (monster.health <= 0) {
        if (inArena) {
            winArenaBattle();
        } else {
            winBattle();
        }
        return;
    }

    const baseMonsterDamage = Math.max(0, monster.attack - player.defense);
    const monsterVariation = baseMonsterDamage * 0.2; // 20% de variação
    const monsterDamage = Math.round(baseMonsterDamage + (Math.random() * monsterVariation * 2 - monsterVariation)); // Aleatoriza e arredonda o dano
    player.health -= monsterDamage;

    if (inArena) {
        document.getElementById('battleLog').innerHTML += `<br><span class="log-enemy">O inimigo da arena atacou e causou ${monsterDamage} de dano.</span>`;
    } else {
        document.getElementById('battleLog').innerHTML += `<br><span class="log-enemy">O monstro atacou e causou ${monsterDamage} de dano.</span>`;
    }
    updatePlayerHud();

    if (player.health <= 0) {
        if (inArena) {
            loseArenaBattle();
        } else {
            loseBattle();
        }
    }
}

// Função para defender
function defend() {
    const baseMonsterDamage = Math.max(0, monster.attack - (player.defense * 2));
    const monsterVariation = baseMonsterDamage * 0.2; // 20% de variação
    const monsterDamage = Math.round(baseMonsterDamage + (Math.random() * monsterVariation * 2 - monsterVariation)); // Aleatoriza e arredonda o dano
    player.health -= monsterDamage;
    document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você defendeu e reduziu o dano para ${monsterDamage}.</span>`;
    updatePlayerHud();

    if (player.health <= 0) {
        if (inArena) {
            loseArenaBattle();
        } else {
            loseBattle();
        }
    }
}

// função de vitória caçada
function winBattle() {
    console.log('entrando na função winBattle');
    document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você derrotou o monstro!</span>`;
    player.experience += monster.experience;
    const randomDrop = monster.drops[Math.floor(Math.random() * monster.drops.length)];
    document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você ganhou ${monster.experience} de experiência e encontrou um ${randomDrop}.</span>`;
    if (player.experience >= (player.level * 20)+100) {
        player.level++;
        player.experience = 0;
        document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você subiu para o nível ${player.level}!</span>`;
    }
    savePlayer();
    resetBattle();
}

// Função de derrota caçada
function loseBattle() {
    console.log('entrando na função loseBattle');
    document.getElementById('battleLog').innerHTML += `<br><span class="log-enemy">Você foi derrotado pelo monstro...</span>`;
    resetBattle();
}

// Função para resetar a batalha
function resetBattle() {
    document.getElementById('battle').classList.add('hidden');
    document.getElementById('actions').classList.remove('hidden');
    document.getElementById('enemyHud').classList.add('hidden');
    //player.health = 100;
    updatePlayerHud();
}

// Função para salvar o jogador
function savePlayer() {
    let characters = JSON.parse(localStorage.getItem('characters')) || [];
    const index = characters.findIndex(character => character.name === player.name);
    if (index !== -1) {
        characters[index] = player;
        localStorage.setItem('characters', JSON.stringify(characters));
    }
}

let consecutiveWins = 0;
let recordWins = 0;

// Função para ir para a arena
function goToArena() {
    document.getElementById('actions').classList.add('hidden');
    document.getElementById('arena').classList.remove('hidden');
    inArena = true; // Indica que estamos na arena
}

// Função para iniciar a batalha na arena
function startArena() {
    const opponent = generateArenaOpponent();
    document.getElementById('arenaLog').innerHTML = `Você está enfrentando ${opponent.name}! Prepare-se para a batalha!`;
    startBattle(opponent);
}

// Função para gerar um oponente da arena
function generateArenaOpponent() {
    const difficulties = ['Médio', 'Pesado'];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const opponentTypes = arenaChallengers[difficulty];
    const opponentNames = Object.keys(opponentTypes);
    const opponentName = opponentNames[Math.floor(Math.random() * opponentNames.length)];
    const opponent = opponentTypes[opponentName];
    return {
        name: opponentName,
        health: opponent.health,
        attack: opponent.attack,
        defense: opponent.defense,
        experience: opponent.experience,
        drops: opponent.drops
    };
}

// Função para iniciar a batalha
function startBattle(opponent) {
    monster = opponent;
    document.getElementById('arena').classList.add('hidden');
    document.getElementById('battle').classList.remove('hidden');
    document.getElementById('enemyHud').classList.remove('hidden');
    document.getElementById('battleLog').innerHTML = `<span class="log-enemy">Você está enfrentando ${opponent.name}! Prepare-se para a batalha!</span>`;
    updateEnemyHud();
}

// Função para lidar com a vitória na arena
function winArenaBattle() {
    document.getElementById('battleLog').innerHTML += `<br><span class="log-player">Você derrotou ${monster.name}!</span>`;
    
    // Verifica se as propriedades consecutiveWins e recordWins existem, se não, adiciona-as
    if (typeof player.consecutiveWins === 'undefined') {
        player.consecutiveWins = 0;
    }
    if (typeof player.recordWins === 'undefined') {
        player.recordWins = 0;
    }

    player.consecutiveWins++;
    if (player.consecutiveWins > player.recordWins) {
        player.recordWins = player.consecutiveWins;
    }
    savePlayer();
    endArena();
}

// Função para finalizar a batalha na arena
function endArena() {
    document.getElementById('battle').classList.add('hidden');
    document.getElementById('actions').classList.remove('hidden');
    document.getElementById('enemyHud').classList.add('hidden');
    inArena = false; // Indica que saímos da arena
    updatePlayerHud();
}

function loseBattle() {
    alert('Você se fudeu! tu morreu e perdeu xp 50% do XP necessário para o próximo nível e voltou para o nível anterior se tava fraquinho.');
    player.health = 100;
    
    const xpLoss = ((player.level * 20) + 100) / 2;
    player.experience -= xpLoss;
    
    if (player.experience < 0) {
        player.level--;
        if (player.level < 1) {
            player.level = 1;
        }
        player.experience = 0;
    }
    
    savePlayer();
    updatePlayerHud();
    resetBattle();
}

function loseArenaBattle() {
    alert('Você se fudeu! tu morreu e perdeu xp 50% do XP necessário para o próximo nível e voltou para o nível anterior se tava fraquinho.');
    player.health = 100;
    
    const xpLoss = ((player.level * 20) + 100) / 2;
    player.experience -= xpLoss;
    
    if (player.experience < 0) {
        player.level--;
        if (player.level < 1) {
            player.level = 1;
        }
        player.experience = 0;
    }
    
    // Redefine as vitórias consecutivas para 0
    player.consecutiveWins = 0;
    
    savePlayer();
    updatePlayerHud();
    resetBattle();
    endArena();
}

// Carregar personagens ao carregar a página

// ----------------------------
// Go to city
// ----------------------------
// Função para ir para a cidade
function goToCity() {
    const cityMenu = `
        <h1>Cidade</h1>
        <button onclick="goToHospital()">Hospital de Idiotas</button>
        <button onclick="goToItems()">Itens para Noobs</button>
        <button onclick="goToClan()">Clã de Arrombados</button>
        <button onclick="goToTavern()">Taverna</button>
        <button onclick="goBack()">Voltar</button>
    `;
    document.getElementById('city').innerHTML = cityMenu;
    document.getElementById('actions').classList.add('hidden');
    document.getElementById('city').classList.remove('hidden');
}

// Função para voltar ao menu de ações
function goBack() {
    document.getElementById('city').classList.add('hidden');
    document.getElementById('actions').classList.remove('hidden');
}

// Função para ir ao Hospital de Idiotas
function goToHospital() {
    const hospitalMenu = `
        <h2>Hospital de Idiotas</h2>
        <p>Você precisa de tratamento? Custa 20 de ouro.</p>
        <button onclick="acceptTreatment()">Aceitar</button>
        <button onclick="declineTreatment()">Recusar</button>
    `;
    document.getElementById('city').innerHTML = hospitalMenu;
}

// Função para aceitar o tratamento
function acceptTreatment() {
    if (player.gold >= 20) {
        player.gold -= 20;
        player.health = 100;
        alert('Você foi curado!');
    } else {
        alert('Você é pobre! Saia daqui!');
    }
    updatePlayerHud();
    goToCity();
}

// Função para recusar o tratamento
function declineTreatment() {
    alert('A va te toma no cú rapa, que tu veio gasta meu tempo seu arrombado do krl, saia daqui se não eu te espanco seu merda...');
    goToCity();
}

let lastVisitTime = 0;
let availableItems = [];

function generateItems() {
    const stats = ['attack', 'defense', 'health'];
    availableItems = stats.map(stat => {
        const increase = Math.floor(Math.random() * (2 * player.level - player.level + 1)) + player.level;
        return { stat, increase };
    });
}

function goToItems() {
    const currentTime = Date.now();
    if (currentTime - lastVisitTime > 3 * 60 * 1000) {
        generateItems();
        lastVisitTime = currentTime;
    }

    const itemsMenu = `
        <h2>Itens para Noobs</h2>
        <p>Escolha um item para comprar (50 de ouro cada):</p>
        ${availableItems.map((item, index) => `
            <button onclick="buyItem(${index})">Item ${index + 1} (Aumenta ${item.stat} em ${item.increase})</button>
        `).join('')}
        <button onclick="goToCity()">Voltar</button>
    `;
    document.getElementById('city').innerHTML = itemsMenu;
}

// Função para comprar um item
function buyItem(index) {
    const item = availableItems[index];
    if (player.gold >= 50) {
        player.gold -= 50;
        player[item.stat] += item.increase;
        if (item.stat === 'health' && player.health > 100) {
            player.health = 100; // Limita a saúde a 100
        }
        alert(`Você comprou um item que aumenta ${item.stat} em ${item.increase}!`);
        availableItems = []; // Limpa os itens disponíveis após a compra
    } else {
        alert('Você não tem ouro suficiente!');
    }
    updatePlayerHud();
    goToCity();
}
let lastMissionTime = 0;
let currentMission = null;

function generateMission() {
    const missionTypes = [
        { type: 'killMonsters', description: 'Matar X monstros', reward: 'gold' },
        { type: 'arenaWins', description: 'Vitórias na arena', reward: 'experience' },
        { type: 'specificHunts', description: 'Caçadas em regiões específicas', reward: 'gold' }
    ];
    const mission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    mission.target = Math.floor(Math.random() * 10) + 1; // Alvo entre 1 e 10
    mission.progress = 0;

    if (mission.type === 'specificHunts') {
        const regions = ['Pantano', 'Selva', 'Montanha'];
        mission.region = regions[Math.floor(Math.random() * regions.length)];
        mission.description += ` na região ${mission.region}`;
    }

    return mission;
}

function goToClan() {
    const currentTime = Date.now();
    if (currentTime - lastMissionTime > 5 * 60 * 1000 || !currentMission) {
        currentMission = generateMission();
        lastMissionTime = currentTime;
    }

    const clanMenu = `
        <h2>Clã de Arrombados</h2>
        <p>Missão atual: ${currentMission.description} (${currentMission.progress}/${currentMission.target})</p>
        <button onclick="acceptMission()">Aceitar Missão</button>
        <button onclick="goToCity()">Voltar</button>
    `;
    document.getElementById('city').innerHTML = clanMenu;
}

function acceptMission() {
    if (currentMission) {
        alert(`Você aceitou a missão: ${currentMission.description}`);
        // Lógica para iniciar a missão
        startMissionTimer();
    }
}

function startMissionTimer() {
    setTimeout(() => {
        if (currentMission && currentMission.progress < currentMission.target) {
            alert('Você falhou na missão!');
            currentMission = null;
            goToClan();
        }
    }, 5 * 60 * 1000);
}

function completeMission() {
    if (currentMission && currentMission.progress >= currentMission.target) {
        if (currentMission.reward === 'gold') {
            player.gold += 50; // Recompensa em ouro
        } else if (currentMission.reward === 'experience') {
            player.experience += 100; // Recompensa em experiência
        }
        alert('Você completou a missão!');
        currentMission = null;
        updatePlayerHud();
        goToClan();
    }
}

// Função para atualizar o progresso da missão
function updateMissionProgress() {
    if (currentMission) {
        currentMission.progress++;
        if (currentMission.progress >= currentMission.target) {
            completeMission();
        }
    }
}

// Função para ir à Taverna
function goToTavern() {
    const events = [
        { description: 'Você bebeu e recuperou 20 de vida!', effect: () => { player.health = Math.min(player.health + 20, 100); } },
        { description: 'Você bebeu demais e perdeu 5 de ataque por uma rodada!', effect: () => { player.attack -= 5; setTimeout(() => { player.attack += 5; }, 60000); } },
        { description: 'Você saiu sem dinheiro!', effect: () => { player.gold = 0; } },
        { description: 'Você ganhou 20 de dinheiro!', effect: () => { player.gold += 20; } },
        { description: 'Você se casou com um dragão! O jogo acabou.', effect: () => { alert('Você se casou com um dragão! Se fudeu!'); endGame(); } }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    alert(event.description);
    event.effect();
    updatePlayerHud();
    if (event.description !== 'Você se casou com um dragão! O jogo acabou.') {
        goBack();
    }
}

// Função para encerrar o jogo
function endGame() {
    alert('O jogo acabou. Você se casou com um dragão e se fudeu!');
    // Lógica para encerrar o jogo, como redirecionar para uma tela de fim de jogo ou recarregar a página
    location.reload();
}

window.onload = loadCharacters;