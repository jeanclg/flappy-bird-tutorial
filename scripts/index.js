// declarando o canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// instanciando uma variavel de frame para controlar o tempo de jogo
let frame = 0;

// instanciando uma variável global auxiliar
const globalAux = {};

// instanciando os sprites
const sprites = new Image();
sprites.src = "/assets/sprites/sprites.png";

// instanciando os sons
const sndHit = new Audio();
sndHit.src = "/assets/sounds/hit.wav";
sndHit.volume = 0.1;

// declarando a imagem da tela de inicio
const startImg = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  draw() {
    ctx.drawImage(
      sprites,
      startImg.spriteX,
      startImg.spriteY,
      startImg.width,
      startImg.height,
      startImg.x,
      startImg.y,
      startImg.width,
      startImg.height
    );
  },
};

// declarando a imagem do background
const bcg = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      bcg.spriteX,
      bcg.spriteY,
      bcg.width,
      bcg.height,
      bcg.x,
      bcg.y,
      bcg.width,
      bcg.height
    );
    ctx.drawImage(
      sprites,
      bcg.spriteX,
      bcg.spriteY,
      bcg.width,
      bcg.height,
      bcg.x + bcg.width,
      bcg.y,
      bcg.width,
      bcg.height
    );
  },
};

// declarando a imagem de game over
const gameOverSprite = {
  spriteX: 134,
  spriteY: 153,
  width: 226,
  height: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      gameOverSprite.spriteX,
      gameOverSprite.spriteY,
      gameOverSprite.width,
      gameOverSprite.height,
      gameOverSprite.x,
      gameOverSprite.y,
      gameOverSprite.width,
      gameOverSprite.height
    );
  },
};

function createPipes() {
  // declarando os tubos
  const pipes = {
    bottom: {
      spriteX: 0,
      spriteY: 169,
    },
    up: {
      spriteX: 52,
      spriteY: 169,
    },
    width: 52,
    height: 400,
    pipeSpeed: 2,
    gap: 80,
    pairPipes: [],
    draw() {
      pipes.pairPipes.forEach((pair) => {
        const randomY = pair.y;
        // desenhando o tubo de cima
        const pipeUpX = pair.x;
        const pipeUpY = randomY;
        ctx.drawImage(
          sprites,
          pipes.up.spriteX,
          pipes.up.spriteY,
          pipes.width,
          pipes.height,
          pipeUpX,
          pipeUpY,
          pipes.width,
          pipes.height
        );
        // desenhando o tubo de baixo
        const pipeBotX = pair.x;
        const pipeBotY = pipes.height + pipes.gap + randomY;
        ctx.drawImage(
          sprites,
          pipes.bottom.spriteX,
          pipes.bottom.spriteY,
          pipes.width,
          pipes.height,
          pipeBotX,
          pipeBotY,
          pipes.width,
          pipes.height
        );

        pair.pipeUp = {
          x: pipeUpX,
          y: pipes.height + pipeUpY,
        };

        pair.pipeBot = {
          x: pipeBotX,
          y: pipeBotY,
        };
      });
    },
    collisionWithPlayer(pipe) {
      if (globalAux.player.x + globalAux.player.width - 12 >= pipe.x) {
        // verificando se o jogador esta colidindo como tubo pela parte de cima do sprite
        if (globalAux.player.y <= pipe.pipeUp.y) return true;
        // verificando se o jogador esta colidindo como tubo pela parte de baixo do sprite
        if (globalAux.player.y + globalAux.player.height >= pipe.pipeBot.y)
          return true;

        return false;
      }
    },
    update() {
      const intervalFrame = frame % 100 === 0;
      if (intervalFrame) {
        pipes.pairPipes.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      pipes.pairPipes.forEach((i) => {
        // atribuindo velocidade aos tubos que são criados
        i.x -= pipes.pipeSpeed;
        // checando se há colisão do jogador com os tubos
        if (pipes.collisionWithPlayer(i)) {
          changeScreen(screen.GAMEOVER);
          return;
        }
        // caso os tubo cheguem ao fim da tela eles são apagados
        if (i.x + pipes.width <= 0) pipes.pairPipes.shift();
      });
    },
  };
  return pipes;
}

function createFloor() {
  // declarando a imagem do chão
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      // faz com que o chão se movimente de forma infinita
      const floorSpeed = 1;
      const repeatFloor = floor.width / 2;
      const moveFloor = floor.x - floorSpeed;
      floor.x = moveFloor % repeatFloor;
    },
    draw() {
      ctx.drawImage(
        sprites,
        floor.spriteX,
        floor.spriteY,
        floor.width,
        floor.height,
        floor.x,
        floor.y,
        floor.width,
        floor.height
      );
      ctx.drawImage(
        sprites,
        floor.spriteX,
        floor.spriteY,
        floor.width,
        floor.height,
        floor.x + floor.width,
        floor.y,
        floor.width,
        floor.height
      );
    },
  };
  return floor;
}

// criando a função de criar player para sempre instanciar um novo jogador quando o jogo é reiniciado.
function createPlayer() {
  // declarando o player
  const player = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    jumpForce: -4.6,
    animationMove: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
    ],
    currentFrame: 0,
    updateCurrentFrame() {
      const intervalFrame = 10; // delimitador de frame para alterar a animação do jogador
      const checkInterval = frame % intervalFrame === 0; // retorna true a cada intervalFrame declarado acima
      // troca o sprite do jogador a cada checkInterval
      if (checkInterval) {
        const incrementValue = 1;
        const increment = incrementValue + player.currentFrame;
        const repeatBase = player.animationMove.length;
        player.currentFrame = increment % repeatBase;
      }
    },
    update() {
      if (collisionCheck(player, globalAux.floor)) {
        sndHit.play();
        setTimeout(() => {
          changeScreen(screen.GAMEOVER);
        }, 500);
        return;
      }
      // aplica a gravidade no jogador e faz com que ele caia
      player.speed += player.gravity;
      player.y += player.speed;
    },
    draw() {
      player.updateCurrentFrame();
      const { spriteX, spriteY } = player.animationMove[player.currentFrame];
      ctx.drawImage(
        sprites,
        spriteX,
        spriteY,
        player.width,
        player.height,
        player.x,
        player.y,
        player.width,
        player.height
      );
    },
    jump() {
      player.speed = player.jumpForce;
    },
  };
  return player;
}

// declarando o score
function createScore() {
  const scoreGame = {
    score: 0,
    draw() {
      ctx.font = "35px VT323";
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.fillText(scoreGame.score, canvas.width - 10, 35);
    },
    update() {
      const intervalFrame = 30; // delimitador de frame para alterar a animação do jogador
      const checkInterval = frame % intervalFrame === 0; // retorna true a cada intervalFrame declarado acima
      if (checkInterval) scoreGame.score++;
    },
  };
  return scoreGame;
}

// declarando função que checa colisão do player com o chão
function collisionCheck(player, floor) {
  return player.y + player.height >= floor.y;
}

// declarando a tela corrente que irá estar na tela do jogador
let currentScreen = {};

// função que altera a tela do jogador Ex: tela inicial para tela do jogo.
function changeScreen(newScreen) {
  currentScreen = newScreen;
  if (currentScreen.begin) currentScreen.begin();
}

// declarando as telas do jogo
const screen = {
  START: {
    begin() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpando a tela assim que o jogo é reiniciado
    },
    draw() {
      startImg.draw();
    },
    update() {},
    click() {
      changeScreen(screen.GAME);
    },
  },
  GAME: {
    begin() {
      globalAux.player = createPlayer();
      globalAux.floor = createFloor();
      globalAux.pipes = createPipes();
      globalAux.score = createScore();
    },
    draw() {
      bcg.draw();
      globalAux.player.draw();
      globalAux.pipes.draw();
      globalAux.floor.draw();
      globalAux.score.draw();
    },
    update() {
      globalAux.player.update();
      globalAux.floor.update();
      globalAux.pipes.update();
      globalAux.score.update();
    },
    click() {
      globalAux.player.jump();
    },
  },
  GAMEOVER: {
    begin() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpando a tela assim que o jogo é reiniciado
    },
    draw() {
      gameOverSprite.draw();
      globalAux.score.draw();
    },
    update() {},
    click() {
      changeScreen(screen.START);
    },
  },
};

// função loop que irá rodar várias vezes a cada segundo
function loop() {
  currentScreen.draw();
  currentScreen.update();
  frame++;
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => {
  if (currentScreen.click) currentScreen.click();
});

// iniciando o jogo na tela START
changeScreen(screen.START);
// declaração do loop do jogo
loop();
