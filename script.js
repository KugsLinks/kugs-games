const gameData = [
  { title: "Galactic Rush", category: "arcade", emoji: "🚀", rating: 4.9 },
  { title: "Sky Hop", category: "arcade", emoji: "🛩️", rating: 4.8 },
  { title: "Neon Snake", category: "arcade", emoji: "🐍", rating: 4.7 },
  { title: "Tile Twist", category: "puzzle", emoji: "🧩", rating: 4.6 },
  { title: "Color Match", category: "puzzle", emoji: "🎨", rating: 4.7 },
  { title: "Memory Grid", category: "puzzle", emoji: "🧠", rating: 4.5 },
  { title: "Turbo Drift", category: "racing", emoji: "🏎️", rating: 4.9 },
  { title: "Track Blitz", category: "racing", emoji: "🏁", rating: 4.8 },
  { title: "Street Sprint", category: "racing", emoji: "⚡", rating: 4.7 },
  { title: "Goal Rush", category: "sports", emoji: "⚽", rating: 4.8 },
  { title: "Hoop Dash", category: "sports", emoji: "🏀", rating: 4.6 },
  { title: "Volley Storm", category: "sports", emoji: "🏐", rating: 4.5 },
  { title: "Pixel Panic", category: "arcade", emoji: "👾", rating: 4.7 },
  { title: "Star Catcher", category: "arcade", emoji: "⭐", rating: 4.8 },
  { title: "Crystal Breaker", category: "puzzle", emoji: "💎", rating: 4.6 },
  { title: "Flash Circuit", category: "racing", emoji: "🔋", rating: 4.5 },
  { title: "Field Flicks", category: "sports", emoji: "🎯", rating: 4.4 }
];

const genreList = ["arcade", "puzzle", "racing", "sports", "adventure"];
const names = [
  "Apex", "Blaze", "Bolt", "Cobalt", "Drift", "Echo", "Flash", "Glide",
  "Horizon", "Impact", "Jolt", "Knight", "Legion", "Meteor", "Nova", "Orbit",
  "Pixel", "Quest", "Racer", "Storm", "Titan", "Ultra", "Vector", "Wave", "Zen",
  "Circuit", "Comet", "Dash", "Edge", "Forge", "Grid", "Hyper", "Jet", "Luna",
  "Matrix", "Nexus", "Portal", "Sprint", "Summit", "Turbo", "Vortex", "Wild", "Yonder",
  "Archer", "Bouncer", "Champion", "Dynamo", "Eclipse", "Fury", "Guardian", "Hunter",
  "Invader", "Jumper", "Kinetic", "Lancer", "Maverick", "Night", "Outlaw", "Phantom",
  "Quasar", "Ranger", "Shadow", "Tracker", "Vanguard", "Warden", "Xeno", "Zephyr",
  "Aero", "Bingo", "Castle", "Dragon", "Empire", "Frost", "Giga", "Harbor", "Island",
  "Jungle", "King", "Laser", "Magma", "Neon", "Onyx", "Phaser", "Quiver", "River",
  "Signal", "Trident", "Undertow", "Velocity", "Wheels", "Yoyo", "Zodiac"
];

const descriptors = [
  "Challenge run", "Quick match", "Arena battle", "Rush mode", "Classic remix",
  "Speed run", "Puzzle set", "Action lane", "Task mode", "Star chase",
  "Combo sprint", "Rally event", "Rapid rounds", "Power play", "Skill test",
  "Time attack", "Arcade fever", "Mission jump", "Lucky streak", "Fire round",
  "Sky run", "Retro blast", "Weekend showdown", "Peak mode", "Night fury",
  "Turbo zone", "Grid battle", "Stage rush", "Bright attack", "Final lap"
];

const emojiPool = ["🎮", "🚀", "🕹️", "🎯", "⚽", "🏎️", "🧩", "🎲", "⭐", "👾", "🎨", "⚡", "🏀", "🎰", "💥", "🎱"];

const buildGameList = () => {
  const list = [];
  for (let i = 1; i <= 500; i += 1) {
    const title = `${names[i % names.length]} ${names[(i * 3) % names.length]}`;
    const category = genreList[i % genreList.length];
    const descriptor = descriptors[i % descriptors.length];
    const emoji = emojiPool[i % emojiPool.length];
    const rating = Number((3.8 + ((i * 7) % 15) / 10).toFixed(1));

    list.push({
      id: i,
      title: `${title}`.trim(),
      category,
      descriptor,
      emoji,
      rating
    });
  }
  return list;
};

const ALL_GAMES = buildGameList();

const state = {
  selectedFilter: "all",
  selectedSort: "popular",
  query: ""
};

const gameGrid = document.getElementById("gameGrid");
const resultsText = document.getElementById("resultsText");
const searchInput = document.getElementById("searchInput");
const totalGames = document.getElementById("totalGames");
const modaltitle = document.getElementById("modalTitle");
const modalBadge = document.getElementById("modalBadge");
const gameModal = document.getElementById("gameModal");

const getVisibleGames = () => {
  let filtered = ALL_GAMES.filter((game) => {
    const matchesFilter = state.selectedFilter === "all" || game.category === state.selectedFilter;
    const matchesQuery = game.title.toLowerCase().includes(state.query.toLowerCase()) || game.descriptor.toLowerCase().includes(state.query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  if (state.selectedSort === "az") {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.selectedSort === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else {
    filtered = [...filtered].sort((a, b) => b.rating * 10 + b.id - (a.rating * 10 + a.id));
  }

  return filtered;
};

const renderGames = () => {
  const visible = getVisibleGames();
  totalGames.textContent = String(ALL_GAMES.length);
  resultsText.textContent = `Showing ${visible.length} games`;

  if (!visible.length) {
    gameGrid.innerHTML = `
      <div class="game-card" style="grid-column: 1 / -1; min-height: 160px; display: flex; align-items: center; justify-content: center; text-align: center;">
        <div>
          <div class="game-thumb" style="margin: 0 auto 18px;">🔎</div>
          <h3 style="margin: 0 0 8px;">No games match your search</h3>
          <p>Try a different title or category.</p>
        </div>
      </div>
    `;
    return;
  }

  gameGrid.innerHTML = visible
    .map(
      (game) => `
        <article class="game-card" data-category="${game.category}">
          <div class="game-card-header">
            <div class="game-thumb">${game.emoji}</div>
            <span class="game-tag">${game.category}</span>
          </div>

          <div>
            <h3>${game.title}</h3>
            <p>${game.descriptor}</p>
          </div>

          <div class="game-meta">
            <span class="game-score">★ ${game.rating}</span>
            <button class="play-btn" data-name="${game.title}" data-category="${game.category}">Play</button>
          </div>
        </article>
      `
    )
    .join("");
};

const setFilter = (filter) => {
  state.selectedFilter = filter;
  document.querySelectorAll(".nav-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  });
  renderGames();
};

const setSort = (sort) => {
  state.selectedSort = sort;
  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.sort === sort);
  });
  renderGames();
};

const openModal = (title, category) => {
  modaltitle.textContent = title;
  modalBadge.textContent = category;
  gameModal.classList.remove("hidden");
  gameModal.setAttribute("aria-hidden", "false");
  resetGame();
};

const closeModal = () => {
  gameModal.classList.add("hidden");
  gameModal.setAttribute("aria-hidden", "true");
};

const createGameCanvas = () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameState = {
    started: false,
    player: { x: 70, y: 210, width: 22, height: 22, speed: 6 },
    stars: [],
    score: 0,
    lives: 3,
    keys: { left: false, right: false, up: false, down: false }
  };

  for (let i = 0; i < 18; i += 1) {
    gameState.stars.push({
      x: Math.random() * (canvas.width - 80) + 30,
      y: Math.random() * (canvas.height - 50) + 20,
      radius: 8 + Math.random() * 10,
      speed: 1.8 + Math.random() * 2.5
    });
  }

  const drawStar = (star) => {
    ctx.beginPath();
    ctx.fillStyle = "#ffd233";
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const drawPlayer = () => {
    ctx.fillStyle = "#2a7fff";
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(gameState.player.x + 4, gameState.player.y + 6, 5, 5);
  };

  const drawInfo = () => {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 20px Inter";
    ctx.fillText(`Score: ${gameState.score}`, 18, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 18, 56);
  };

  const resetGame = () => {
    gameState.started = false;
    gameState.player.x = 70;
    gameState.player.y = 210;
    gameState.score = 0;
    gameState.lives = 3;
    for (let i = 0; i < gameState.stars.length; i += 1) {
      const star = gameState.stars[i];
      star.x = Math.random() * (canvas.width - 80) + 30;
      star.y = Math.random() * (canvas.height - 60) + 20;
      star.speed = 1.8 + Math.random() * 2.5;
    }
    drawFrame();
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < canvas.width; i += 44) {
      ctx.fillRect(i, 0, 1, canvas.height);
    }

    gameState.stars.forEach((star) => {
      if (gameState.started) {
        star.x -= star.speed;
        if (star.x < -20) {
          star.x = canvas.width + 20;
          star.y = Math.random() * (canvas.height - 50) + 20;
        }
      }
      drawStar(star);

      if (Math.abs(star.x - (gameState.player.x + gameState.player.width / 2)) < 16 && Math.abs(star.y - (gameState.player.y + gameState.player.height / 2)) < 16) {
        star.x = canvas.width + 20;
        star.y = Math.random() * (canvas.height - 50) + 20;
        gameState.score += 10;
      }
    });

    if (gameState.started) {
      if (gameState.keys.left) gameState.player.x -= gameState.player.speed;
      if (gameState.keys.right) gameState.player.x += gameState.player.speed;
      if (gameState.keys.up) gameState.player.y -= gameState.player.speed;
      if (gameState.keys.down) gameState.player.y += gameState.player.speed;

      gameState.player.x = Math.max(10, Math.min(canvas.width - 40, gameState.player.x));
      gameState.player.y = Math.max(10, Math.min(canvas.height - 40, gameState.player.y));
    }

    drawPlayer();
    drawInfo();

    if (gameState.started && gameState.score >= 200) {
      ctx.fillStyle = "rgba(255, 210, 51, 0.9)";
      ctx.font = "800 28px Orbitron";
      ctx.fillText("LEVEL CLEAR!", 280, 220);
    }
  };

  const tick = () => {
    drawFrame();
    requestAnimationFrame(tick);
  };

  tick();

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") gameState.keys.left = true;
    if (event.key === "ArrowRight") gameState.keys.right = true;
    if (event.key === "ArrowUp") gameState.keys.up = true;
    if (event.key === "ArrowDown") gameState.keys.down = true;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") gameState.keys.left = false;
    if (event.key === "ArrowRight") gameState.keys.right = false;
    if (event.key === "ArrowUp") gameState.keys.up = false;
    if (event.key === "ArrowDown") gameState.keys.down = false;
  });

  return { gameState, resetGame };
};

const gameCanvas = createGameCanvas();

const startGame = () => {
  gameCanvas.gameState.started = true;
  document.getElementById("startBtn").textContent = "Playing";
};

const resetGame = () => {
  gameCanvas.resetGame();
  document.getElementById("startBtn").textContent = "Start Game";
};

document.querySelectorAll(".nav-chip").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll(".sort-btn").forEach((button) => {
  button.addEventListener("click", () => setSort(button.dataset.sort));
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderGames();
});

document.addEventListener("click", (event) => {
  const playButton = event.target.closest(".play-btn");
  if (playButton) {
    openModal(playButton.dataset.name, playButton.dataset.category);
  }

  if (event.target.matches("[data-close='true']")) {
    closeModal();
  }

  if (event.target.classList.contains("modal-close")) {
    closeModal();
  }
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderGames();
