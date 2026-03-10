const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

const startBtn=document.getElementById("startBtn");
const pauseBtn=document.getElementById("pauseBtn");
const restartBtn=document.getElementById("restartBtn");

const scoreUI=document.getElementById("score");
const levelUI=document.getElementById("level");
const oxygenUI=document.getElementById("oxygen");
const aqiBar=document.getElementById("aqiBar");

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

let level=1;

let keys={};

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

function movePlayer(){

if(keys["ArrowUp"]) player.y-=player.speed;
if(keys["ArrowDown"]) player.y+=player.speed;
if(keys["ArrowLeft"]) player.x-=player.speed;
if(keys["ArrowRight"]) player.x+=player.speed;

}

function updateLevel(){

level = Math.floor(player.score/200)+1;

}

function spawnWorld(){

if(Math.random()<0.01){

trees.push({
x:canvas.width,
y:Math.random()*canvas.height
});

}

if(Math.random()<0.008 + level*0.002){

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
size:8,
pulse:Math.random()*2
});

}

});

factories.forEach(f=>{

if(Math.random()<0.04 + level*0.01){

pollution.push({
x:f.x,
y:f.y,
size:12,
drift:Math.random()*2-1
});

AQI+=1;

}

});

}

function update(){

movePlayer();

spawnWorld();
spawnParticles();
updateLevel();

oxygenParticles.forEach((o,i)=>{

o.x-=2;
o.pulse+=0.1;

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
p.y+=p.drift;

let dx=player.x-p.x;
let dy=player.y-p.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

if(player.oxygen>0){

player.oxygen--;
player.score+=20;
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

function draw(){

canvas.style.background=getBackground();

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

let pulseSize=o.size+Math.sin(o.pulse)*2;

ctx.fillStyle="#22c55e";
ctx.beginPath();
ctx.arc(o.x,o.y,pulseSize,0,Math.PI*2);
ctx.fill();

});

pollution.forEach(p=>{

ctx.fillStyle="#6b7280";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();

});

ctx.fillStyle="#0284c7";
ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

}

function getBackground(){

if(AQI<80) return "#38bdf8";
if(AQI<150) return "#facc15";
if(AQI<220) return "#fb923c";

return "#ef4444";

}

function updateUI(){

scoreUI.innerText="Score: "+player.score;
levelUI.innerText="Level: "+level;
oxygenUI.innerText="Oxygen: "+player.oxygen;

let percent=Math.min(AQI/300*100,100);
aqiBar.style.width=percent+"%";

}

function saveScore(score){

let scores=JSON.parse(localStorage.getItem("scores")||"[]");

scores.push(score);

scores.sort((a,b)=>b-a);

scores=scores.slice(0,5);

localStorage.setItem("scores",JSON.stringify(scores));

renderLeaderboard();

}

function renderLeaderboard(){

let scores=JSON.parse(localStorage.getItem("scores")||"[]");

const board=document.getElementById("leaderboard");

board.innerHTML="";

scores.forEach(s=>{

let li=document.createElement("li");
li.innerText=s;
board.appendChild(li);

});

}

function gameLoop(){

if(gameState==="playing"){

update();
draw();
updateUI();

if(AQI>300){

gameState="gameover";
saveScore(player.score);

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

if(gameState==="playing") gameState="paused";
else if(gameState==="paused") gameState="playing";

};

restartBtn.onclick=()=>{

location.reload();

};

renderLeaderboard();

gameLoop();
