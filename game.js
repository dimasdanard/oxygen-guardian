const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

const startBtn=document.getElementById("startBtn");
const pauseBtn=document.getElementById("pauseBtn");
const restartBtn=document.getElementById("restartBtn");

const scoreUI=document.getElementById("score");
const oxygenUI=document.getElementById("oxygen");
const aqiUI=document.getElementById("aqi");

let gameState="menu";

let player={
x:150,
y:250,
size:20,
speed:4,
score:0,
oxygen:0
};

let oxygenParticles=[];
let pollution=[];
let trees=[];
let factories=[];

let AQI=50;

let keys={};

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

function movePlayer(){

if(keys["ArrowUp"]) player.y-=player.speed;
if(keys["ArrowDown"]) player.y+=player.speed;
if(keys["ArrowLeft"]) player.x-=player.speed;
if(keys["ArrowRight"]) player.x+=player.speed;

}

function spawnWorld(){

if(Math.random()<0.01){

trees.push({
x:canvas.width,
y:Math.random()*canvas.height
});

}

if(Math.random()<0.008){

factories.push({
x:canvas.width,
y:Math.random()*canvas.height
});

}

}

function spawnParticles(){

trees.forEach(t=>{

if(Math.random()<0.03){

oxygenParticles.push({
x:t.x,
y:t.y,
size:8
});

}

});

factories.forEach(f=>{

if(Math.random()<0.04){

pollution.push({
x:f.x,
y:f.y,
size:12
});

AQI+=1;

}

});

}

function update(){

movePlayer();

spawnWorld();
spawnParticles();

oxygenParticles.forEach((o,i)=>{

o.x-=2;

let dx=player.x-o.x;
let dy=player.y-o.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

player.oxygen++;
player.score+=5;

oxygenParticles.splice(i,1);

}

});

pollution.forEach((p,i)=>{

p.x-=2;

let dx=player.x-p.x;
let dy=player.y-p.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

if(player.oxygen>0){

player.oxygen--;
player.score+=15;

AQI-=5;

pollution.splice(i,1);

}else{

AQI+=5;

}

}

});

trees.forEach(t=>t.x-=1);
factories.forEach(f=>f.x-=1);

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

trees.forEach(t=>{
ctx.fillStyle="green";
ctx.fillRect(t.x,t.y,20,20);
});

factories.forEach(f=>{
ctx.fillStyle="black";
ctx.fillRect(f.x,f.y,25,25);
});

oxygenParticles.forEach(o=>{
drawGlow(o.x,o.y,o.size+6,"rgba(34,197,94,0.7)");
ctx.fillStyle="#22c55e";
ctx.beginPath();
ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
ctx.fill();
});

pollution.forEach(p=>{
drawGlow(p.x,p.y,p.size+8,"rgba(120,120,120,0.6)");
ctx.fillStyle="#6b7280";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();
});

drawGlow(player.x,player.y,player.size+10,"rgba(0,200,255,0.7)");
ctx.fillStyle="#0284c7";
ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="white";
ctx.fillText("O₂",player.x-7,player.y+4);

}

function updateUI(){

scoreUI.innerText="Score: "+player.score;
oxygenUI.innerText="Oxygen: "+player.oxygen;
aqiUI.innerText="AQI: "+AQI;

}

function gameLoop(){

if(gameState==="playing"){

update();
draw();
updateUI();

if(AQI>300){

gameState="gameover";

ctx.fillStyle="red";
ctx.font="40px Arial";
ctx.fillText("AIR CRISIS!",320,250);

}

}

requestAnimationFrame(gameLoop);

}

startBtn.onclick=()=>{

gameState="playing";

};

pauseBtn.onclick=()=>{

if(gameState==="playing"){
gameState="paused";
}else if(gameState==="paused"){
gameState="playing";
}

};

restartBtn.onclick=()=>{

location.reload();

};

draw();
gameLoop();
