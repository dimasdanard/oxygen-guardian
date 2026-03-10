const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreUI = document.getElementById("score");
const healthUI = document.getElementById("health");
const levelUI = document.getElementById("level");

let running = false;
let paused = false;

let player = {
x:150,
y:250,
size:22,
speed:4,
score:0,
health:100,
level:1
};

let oxygen = [];
let pollution = [];

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer(){

if(keys["ArrowUp"]) player.y -= player.speed;
if(keys["ArrowDown"]) player.y += player.speed;
if(keys["ArrowLeft"]) player.x -= player.speed;
if(keys["ArrowRight"]) player.x += player.speed;

}

function spawnObjects(){

if(Math.random() < 0.04){

oxygen.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:10
});

}

if(Math.random() < 0.025){

pollution.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:14
});

}

}

function updateObjects(){

oxygen.forEach((o,i)=>{

o.x -= 2;

let dx = player.x-o.x;
let dy = player.y-o.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < player.size){

player.score += 10;
player.size += 0.2;

oxygen.splice(i,1);

}

});

pollution.forEach((p,i)=>{

p.x -= 3;

let dx = player.x-p.x;
let dy = player.y-p.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < player.size){

player.health -= 10;

pollution.splice(i,1);

}

});

}

function drawGlowCircle(x,y,size,color){

let g = ctx.createRadialGradient(x,y,0,x,y,size);

g.addColorStop(0,color);
g.addColorStop(1,"transparent");

ctx.fillStyle = g;

ctx.beginPath();
ctx.arc(x,y,size,0,Math.PI*2);
ctx.fill();

}

function drawPlayer(){

drawGlowCircle(player.x,player.y,player.size+8,"rgba(0,200,255,0.6)");

ctx.fillStyle="#0284c7";

ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="white";
ctx.fillText("O₂",player.x-7,player.y+4);

}

function drawObjects(){

oxygen.forEach(o=>{

drawGlowCircle(o.x,o.y,o.size+6,"rgba(34,197,94,0.6)");

ctx.fillStyle="#22c55e";
ctx.beginPath();
ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
ctx.fill();

});

pollution.forEach(p=>{

drawGlowCircle(p.x,p.y,p.size+6,"rgba(100,100,100,0.6)");

ctx.fillStyle="#374151";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();

});

}

function updateUI(){

scoreUI.innerText = "Score: "+player.score;
healthUI.innerText = "Air Quality: "+player.health+"%";
levelUI.innerText = "Level: "+player.level;

}

function levelSystem(){

if(player.score > 150) player.level = 2;
if(player.score > 350) player.level = 3;
if(player.score > 700) player.level = 4;

}

function gameLoop(){

if(!running || paused) return;

ctx.clearRect(0,0,canvas.width,canvas.height);

movePlayer();
spawnObjects();
updateObjects();
levelSystem();

drawObjects();
drawPlayer();

updateUI();

if(player.health <= 0){

running = false;

ctx.fillStyle = "red";
ctx.font = "40px Arial";
ctx.fillText("GAME OVER",330,260);

return;

}

requestAnimationFrame(gameLoop);

}

startBtn.onclick = () => {

running = true;
paused = false;

gameLoop();

};

pauseBtn.onclick = () => {

paused = !paused;

if(!paused) gameLoop();

};

restartBtn.onclick = () => {

location.reload();

};

// gambar awal supaya canvas tidak kosong
ctx.fillStyle="white";
ctx.fillText("Press Start Game",380,250);
