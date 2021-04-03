const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//instanciando os sprites
const sprites = new Image();
sprites.src = "/assets/sprites/sprites.png";

//criando a tela de inicio
const startImg = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  posX: canvas.width / 2 - 174 / 2,
  posY: 50,
  draw() {
    ctx.drawImage(
      sprites,
      startImg.spriteX,
      startImg.spriteY,
      startImg.width,
      startImg.height,
      startImg.posX,
      startImg.posY,
      startImg.width,
      startImg.height
    );
  },
};

//criando o background
const bcg = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  posX: 0,
  posY: canvas.height - 204,
  draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      bcg.spriteX,
      bcg.spriteY,
      bcg.width,
      bcg.height,
      bcg.posX,
      bcg.posY,
      bcg.width,
      bcg.height
    );
    ctx.drawImage(
      sprites,
      bcg.spriteX,
      bcg.spriteY,
      bcg.width,
      bcg.height,
      bcg.posX + bcg.width,
      bcg.posY,
      bcg.width,
      bcg.height
    );
  },
};

// //criando o chão
const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  posX: 0,
  posY: canvas.height - 112,
  draw() {
    ctx.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.posX,
      floor.posY,
      floor.width,
      floor.height
    );
    ctx.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.posX + floor.width,
      floor.posY,
      floor.width,
      floor.height
    );
  },
};

//criando o player
const player = {
  spriteX: 0,
  spriteY: 0,
  width: 33,
  height: 24,
  posX: 10,
  posY: 50,
  gravity: 0.25,
  speed: 0,
  update() {
    player.speed += player.gravity;
    player.posY += player.speed;
  },
  draw() {
    ctx.drawImage(
      sprites,
      player.spriteX,
      player.spriteY,
      player.width,
      player.height,
      player.posX,
      player.posY,
      player.width,
      player.height
    );
  },
};

let currentScreen = {};

function changeScreen(newScreen) {
  currentScreen = newScreen;
}

//criando as telas do jogo
const screen = {
  START: {
    draw() {
      bcg.draw();
      floor.draw();
      startImg.draw();
    },
    update() {},
    click() {
      changeScreen(screen.GAME);
    },
  },
  GAME: {
    draw() {
      bcg.draw();
      player.draw();
      floor.draw();
    },
    update() {
      player.update();
    },
  },
};

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
