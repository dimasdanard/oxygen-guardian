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
size:18,
speed:4,
score:0,
oxygen:0,
stage:1
};

let oxygenParticles=[];
let pollution=[];
let trees=[];
let factories=[];

let trailParticles=[];
let smokeParticles=[];

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

level=Math.floor(player.score/600)+1;

}

function updateEvolution(){

if(player.score>1800) player.stage=4;
else if(player.score>900) player.stage=3;
else if(player.score>400) player.stage=2;

}

function spawnWorld(){

if(Math.random()<0.002){

trees.push({
x:canvas.width,
y:Math.random()*canvas.height
});

}

if(level>1 && Math.random()<0.001+level*0.0005){

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

if(Math.random()<0.01+level*0.005){

pollution.push({
x:f.x,
y:f.y,
size:12
});

smokeParticles.push({
x:f.x,
y:f.y,
life:40,
size:Math.random()*8+4
});

AQI+=0.3;

}

});

}

function spawnTrail(){

trailParticles.push({
x:player.x,
y:player.y,
life:30,
size:Math.random()*6+2,
alpha:1
});

}

function update(){

movePlayer();

spawnWorld();
spawnParticles();

updateLevel();
updateEvolution();

spawnTrail();

oxygenParticles.forEach((o,i)=>{

o.x-=1.5;

let dx=player.x-o.x;
let dy=player.y-o.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

player.oxygen++;
player.score+=10;

oxygenParticles.splice(i,1);

}

});

pollution.forEach((p,i)=>{

p.x-=1.5;

let dx=player.x-p.x;
let dy=player.y-p.y;
let dist=Math.sqrt(dx*dx+dy*dy);

if(dist<player.size){

if(player.oxygen>0){

player.oxygen--;

player.score+=20*player.stage;

AQI-=5*player.stage;

pollution.splice(i,1);

}else{

AQI+=4;

}

}

});

trailParticles.forEach((p,i)=>{

p.life--;
p.alpha-=0.03;
p.y-=0.3;

if(p.life<=0) trailParticles.splice(i,1);

});

smokeParticles.forEach((s,i)=>{

s.y-=0.4;
s.life--;

if(s.life<=0) smokeParticles.splice(i,1);

});

trees.forEach(t=>t.x-=0.8);
factories.forEach(f=>f.x-=0.8);

}

function drawPlayer(){

let colors=[
"#22d3ee",
"#4ade80",
"#a78bfa",
"#facc15"
];

let color=colors[player.stage-1];

ctx.shadowBlur=20;
ctx.shadowColor=color;

ctx.beginPath();
ctx.arc(player.x,player.y,player.size+player.stage*2,0,Math.PI*2);
ctx.fillStyle=color;
ctx.fill();

ctx.shadowBlur=0;

ctx.lineWidth=3;
ctx.strokeStyle="#ffffff";
ctx.stroke();

}

function drawTree(x,y){

ctx.fillStyle="#16a34a";

ctx.beginPath();
ctx.arc(x+10,y+10,10,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="#14532d";
ctx.fillRect(x+8,y+10,4,10);

}

function drawFactory(x,y){

ctx.fillStyle="#374151";
ctx.fillRect(x,y,30,20);

ctx.fillStyle="#6b7280";
ctx.fillRect(x+22,y-10,6,10);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

trees.forEach(t=>drawTree(t.x,t.y));
factories.forEach(f=>drawFactory(f.x,f.y));

oxygenParticles.forEach(o=>{

ctx.shadowBlur=15;
ctx.shadowColor="#22c55e";

ctx.beginPath();
ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
ctx.fillStyle="#4ade80";
ctx.fill();

ctx.shadowBlur=0;

});

pollution.forEach(p=>{

ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fillStyle="#6b7280";
ctx.fill();

});

trailParticles.forEach(p=>{

ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

ctx.fillStyle="rgba(255,255,255,"+p.alpha+")";
ctx.fill();

});

smokeParticles.forEach(s=>{

ctx.beginPath();
ctx.arc(s.x,s.y,s.size,0,Math.PI*2);

ctx.fillStyle="rgba(120,120,120,0.3)";
ctx.fill();

});

drawPlayer();

}

function updateUI(){

scoreUI.innerText="Score: "+player.score;
levelUI.innerText="Level: "+level;
oxygenUI.innerText="Oxygen: "+player.oxygen;

let percent=Math.min(AQI/300*100,100);

aqiBar.style.width=percent+"%";

}

function gameLoop(){

if(gameState==="playing"){

update();
draw();
updateUI();

if(AQI>300){

gameState="gameover";

saveScore(player.score);

}

}

requestAnimationFrame(gameLoop);

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

const board=document.getElementById("leaderboard");

let scores=JSON.parse(localStorage.getItem("scores")||"[]");

board.innerHTML="";

scores.forEach(s=>{

let li=document.createElement("li");
li.innerText=s;

board.appendChild(li);

});

}

startBtn.onclick=()=>{

gameState="playing";

};

pauseBtn.onclick=()=>{

if(gameState==="playing") gameState="paused";
else if(gameState==="paused") gameState="playing";

};

restartBtn.onclick=()=>location.reload();

renderLeaderboard();

gameLoop();
