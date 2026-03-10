window.onload = function(){

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const startBtn=document.getElementById("startBtn")
const pauseBtn=document.getElementById("pauseBtn")
const restartBtn=document.getElementById("restartBtn")

const scoreUI=document.getElementById("score")
const healthUI=document.getElementById("health")
const levelUI=document.getElementById("level")

let running=false
let paused=false

let player={
x:150,
y:250,
size:22,
speed:4,
score:0,
health:100,
level:1
}

let oxygen=[]
let pollution=[]

let keys={}

document.addEventListener("keydown",e=>keys[e.key]=true)
document.addEventListener("keyup",e=>keys[e.key]=false)

function movePlayer(){

if(keys["ArrowUp"]) player.y-=player.speed
if(keys["ArrowDown"]) player.y+=player.speed
if(keys["ArrowLeft"]) player.x-=player.speed
if(keys["ArrowRight"]) player.x+=player.speed

}

function spawn(){

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
size:14
})

}

}

function update(){

oxygen.forEach((o,i)=>{

o.x-=2

let dx=player.x-o.x
let dy=player.y-o.y
let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<player.size){

player.score+=10
player.size+=0.3

oxygen.splice(i,1)

}

})

pollution.forEach((p,i)=>{

p.x-=3

let dx=player.x-p.x
let dy=player.y-p.y
let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<player.size){

player.health-=10

pollution.splice(i,1)

}

})

}

function drawCircle(x,y,size,color){

ctx.fillStyle=color
ctx.beginPath()
ctx.arc(x,y,size,0,Math.PI*2)
ctx.fill()

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawCircle(player.x,player.y,player.size,"blue")

oxygen.forEach(o=>{
drawCircle(o.x,o.y,o.size,"green")
})

pollution.forEach(p=>{
drawCircle(p.x,p.y,p.size,"gray")
})

}

function updateUI(){

scoreUI.innerText="Score: "+player.score
healthUI.innerText="Air Quality: "+player.health+"%"
levelUI.innerText="Level: "+player.level

}

function gameLoop(){

if(!running || paused) return

movePlayer()
spawn()
update()
draw()
updateUI()

if(player.health<=0){

running=false
alert("Game Over")

return

}

requestAnimationFrame(gameLoop)

}

startBtn.onclick=()=>{

running=true
paused=false
gameLoop()

}

pauseBtn.onclick=()=>{

paused=!paused

if(!paused) gameLoop()

}

restartBtn.onclick=()=>{

location.reload()

}

// gambar awal agar canvas tidak putih
draw()

}
