const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
x:150,
y:250,
size:20,
speed:4,
score:0,
health:100,
level:1
};

let oxygen = [];
let pollution = [];
let trees = [];
let factories = [];

let keys = {};

document.addEventListener("keydown", e=>{
keys[e.key]=true;
});

document.addEventListener("keyup", e=>{
keys[e.key]=false;
});

function movePlayer(){

if(keys["ArrowUp"]) player.y -= player.speed;
if(keys["ArrowDown"]) player.y += player.speed;
if(keys["ArrowLeft"]) player.x -= player.speed;
if(keys["ArrowRight"]) player.x += player.speed;

}

function spawnObjects(){

if(Math.random()<0.04){

oxygen.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:10
})

}

if(Math.random()<0.025){

pollution.push({
x:canvas.width,
y:Math.random()*canvas.height,
size:15
})

}

if(Math.random()<0.005){

trees.push({
x:canvas.width,
y:Math.random()*canvas.height
})

}

if(Math.random()<0.004){

factories.push({
x:canvas.width,
y:Math.random()*canvas.height
})

}

}

function updateObjects(){

oxygen.forEach((o,i)=>{

o.x -= 2;

let dx = player.x-o.x;
let dy = player.y-o.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < player.size){

player.score += 5;
player.size += 0.3;

oxygen.splice(i,1);

}

});

pollution.forEach((p,i)=>{

p.x -= 3;

let dx = player.x-p.x;
let dy = player.y-p.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < player.size){

player.health -= 8;

pollution.splice(i,1);

}

});

trees.forEach((t)=>{

t.x -= 1.5;

if(Math.random()<0.02){

oxygen.push({
x:t.x,
y:t.y,
size:10
})

}

});

factories.forEach((f)=>{

f.x -= 1.5;

if(Math.random()<0.03){

pollution.push({
x:f.x,
y:f.y,
size:15
})

}

});

}

function drawPlayer(){

ctx.fillStyle="blue";

ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="white";
ctx.fillText("O₂",player.x-7,player.y+4);

}

function drawObjects(){

oxygen.forEach(o=>{

ctx.fillStyle="green";
ctx.beginPath();
ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
ctx.fill();

})

pollution.forEach(p=>{

ctx.fillStyle="gray";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();

})

trees.forEach(t=>{

ctx.fillStyle="darkgreen";
ctx.fillRect(t.x,t.y,20,20);

})

factories.forEach(f=>{

ctx.fillStyle="black";
ctx.fillRect(f.x,f.y,25,25);

})

}

function drawUI(){

ctx.fillStyle="black";

ctx.fillText("Score: "+player.score,10,20);
ctx.fillText("Health: "+player.health,10,40);
ctx.fillText("Level: "+player.level,10,60);

let air = Math.max(0,player.health);

ctx.fillText("Air Quality: "+air+"%",10,80);

}

function levelSystem(){

if(player.score > 100) player.level=2;
if(player.score > 250) player.level=3;
if(player.score > 500) player.level=4;

}

function gameLoop(){

ctx.clearRect(0,0,canvas.width,canvas.height);

movePlayer();

spawnObjects();

updateObjects();

levelSystem();

drawObjects();

drawPlayer();

drawUI();

if(player.health > 0){

requestAnimationFrame(gameLoop);

}else{

ctx.fillStyle="red";
ctx.font="40px Arial";
ctx.fillText("GAME OVER - Bumi Tercemar!",200,250);

}

}

gameLoop();
