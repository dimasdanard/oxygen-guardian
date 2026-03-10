const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreUI = document.getElementById("score");
const healthUI = document.getElementById("health");
const levelUI = document.getElementById("level");

let running=false;
let paused=false;

let player={
x:150,
y:250,
size:22,
speed:4,
score:0,
health:100,
level:1
};

let oxygen=[];
let pollution=[];
let keys={};

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

function movePlayer(){

if(keys["ArrowUp"]) player.y-=player.speed;
if(keys["ArrowDown"]) player.y+=player.speed;
if(keys["ArrowLeft"]) player.x-=player.speed;
if(keys["ArrowRight"]) player.x+=player.speed;

}

function spawn(){

if(Math.random()<0.05){

oxygen.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:8
});

}

if(Math.random()<0.03){

pollution.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:12
});

}

}

function update(){

oxygen.forEach((o,i)=>{

o.x-=2;

let dx=player.x-o.x;
let dy=player.y-o.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

player.score+=10;
player.size+=0.15;
oxygen.splice(i,1);

}

});

pollution.forEach((p,i)=>{

p.x-=3;

let dx=player.x-p.x;
let dy=player.y-p.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

player.health-=10;
pollution.splice(i,1);

}

});

}

function drawGlow(x,y,size,color){

let g=ctx.createRadialGradient(x,y,0,x,y,size);
g.addColorStop(0,color);
g.addColorStop(1,"transparent");

ctx.fillStyle=g;
ctx.beginPath();
ctx.arc(x,y,size,0,Math.PI*2);
ctx.fill();

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

oxygen.forEach(o=>{

drawGlow(o.x,o.y,o.size+6,"rgba(34,197,94,0.6)");

ctx.fillStyle="#22c55e";
ctx.beginPath();
ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
ctx.fill();

});

pollution.forEach(p=>{

drawGlow(p.x,p.y,p.size+6,"rgba(120,120,120,0.6)");

ctx.fillStyle="#6b7280";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();

});

drawGlow(player.x,player.y,player.size+8,"rgba(0,200,255,0.6)");

ctx.fillStyle="#0284c7";
ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="white";
ctx.fillText("O₂",player.x-7,player.y+4);

}

function updateUI(){

scoreUI.innerText="Score: "+player.score;
healthUI.innerText="Air Quality: "+player.health+"%";
levelUI.innerText="Level: "+player.level;

}

function gameLoop(){

if(running && !paused){

movePlayer();
spawn();
update();
draw();
updateUI();

if(player.health<=0){

running=false;

ctx.fillStyle="red";
ctx.font="40px Arial";
ctx.fillText("GAME OVER",330,260);

}

}

requestAnimationFrame(gameLoop);

}

startBtn.onclick=()=>{

running=true;
paused=false;

};

pauseBtn.onclick=()=>{

paused=!paused;

};

restartBtn.onclick=()=>{

location.reload();

};

draw();
gameLoop();
