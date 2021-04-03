// declarando o canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

// declarando a imagem do chão
const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
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

// criando a função de criar player para sempre instanciar um novo jogador quando o jogo é reiniciado.
function createObject() {
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
    update() {
      if (collisionCheck(player, floor)) {
        console.log("deu certo");
        sndHit.play();
        setTimeout(() => {
          changeScreen(screen.START);
        }, 500);
        return;
      }
      // aplica a gravidade no jogador e faz com que ele caia
      player.speed += player.gravity;
      player.y += player.speed;
    },
    draw() {
      ctx.drawImage(
        sprites,
        player.spriteX,
        player.spriteY,
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
      globalAux.player = createObject();
    },
    draw() {
      bcg.draw();
      globalAux.player.draw();
      floor.draw();
    },
    update() {
      globalAux.player.update();
    },
    click() {
      globalAux.player.jump();
    },
  },
};

// função loop que irá rodar várias vezes a cada segundo
function loop() {
  currentScreen.draw();
  currentScreen.update();
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => {
  if (currentScreen.click) currentScreen.click();
});

changeScreen(screen.START);
loop();
