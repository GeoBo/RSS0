let screen = document.querySelector (".screen");
let menu = document.querySelector (".menu");
let menuContent = document.querySelector (".menu__content");
let startButton = document.querySelector (".start__button");
let canvas = document.querySelector ("canvas"); 
let ctx = canvas.getContext ("2d");
let btnPause = document.querySelector (".button-pause");
let btnMute = document.querySelector (".button-mute");
let footer = document.querySelector (".footer");
let scale;
let roads = [];  
let objects = [];
let player = 0;
let timerScreenUpdate;
let timerKeyboard;
let currentKey;
let speed;
let imagePath = "./assets/image/road/";
let timeStart = new Date().getTime();
let timePauseStart = timeStart;
let timePause = 0;
let outCars = 0;
let carWidth = 402;
let isPlayed = false;
let cars = ['blue', 'green', 'red', 'yellow', 'police'];
let audio = new Audio ();
let isGameOver;
let level = 1;
let isLevelUp = false;
let chance = 9950;

class Car {
    constructor (image, x, y, speed) {
        this.x = x;
        this.y = y;
        this.image = new Image ();
        this.image.src = image;
        this.speed = speed;
        this.stopped = false;
    } 
    offset () {
        this.y += this.speed;
        if (this.y > canvas.height + 50) {
            this.outScreen = true;         
        }    
    }
    stop (car) {
        this.speed = speed;
        car.speed = speed;
        this.stopped = true;
        car.stopped = true;
    }
    move (v, d) {
        if(v == "x") {
            this.x += d; 
            if (this.x + this.image.width * scale > canvas.width) {
                this.x -= d; 
            }
            if (this.x < 0) {
                this.x = 0;
            }
        }
        else {
            this.y += d;
            if (this.y + this.image.height * scale > canvas.height) {
                this.y -= d;
            }
            if(this.y < 0) {
                this.y = 0;
            }
        }       
    }
    collide (car) {
        if (this.stopped && car.stopped) return false;
        if (this.y < car.y + (car.image.height-100) * scale && this.y + (car.image.height-100) * scale > car.y) {
            if (this.x + (this.image.width-70) * scale > car.x && this.x < car.x + (this.image.width-70) * scale) {
                playBoom ();     
                if (!this.speed) speed = 0;    
                this.stop (car);              
                objects.push (new Fire(`${imagePath}fire.png`, this.x + this.image.width*scale/2 -99*scale, this.y, this.speed));
                objects.push (new Fire(`${imagePath}fire.png`, car.x + car.image.width*scale/2 -99*scale, car.y, this.speed));    
                return true;     
            }
        }
        return false;
    }   
}

class Fire {
    constructor (imagePath, x, y, speed) {
        this.x = x;
        this.y = y;
        this.image = new Image();     
        this.image.src = imagePath;
        this.speed = speed;
    }
    offset () {
        this.y += this.speed;
        if (this.y > canvas.height + 50) {
            this.outScreen = true;         
        }    
    }
}

class Road {
    constructor (imagePath, y, speed) {
        this.x = 0;
        this.y = y;
        this.image = new Image();     
        this.image.src = imagePath;
    }
 
    offset (road) {
        this.y += speed;
        if (this.y > screen.offsetHeight) {
            this.y = road.y - canvas.height + speed +1;
        }
    }
}

const resizeCanvas = function (e, speedUp = false) {
    if(!speedUp){
        if (window.innerHeight < window.innerWidth) {   
            screen.style.width = window.innerHeight + 'px';
            screen.style.height = window.innerHeight + 'px';
        }
        else {
            screen.style.width = window.innerWidth + 'px';
            screen.style.height = window.innerWidth + 'px';   
        }

        canvas.width = screen.offsetWidth;
        canvas.height = screen.offsetHeight;

        scale = Math.floor (canvas.width /4000 *100) /100;   
        speed = Math.floor (canvas.width /64 *100) /100; //скорость дороги
    }    
        
    if (level > 5) speed += speed / 5;
    if (level > 12) speed += speed / 6;

    roads = [ 
        new Road (`${imagePath}road.jpg`, -canvas.height), 
        new Road (`${imagePath}road.jpg`, -1),
        new Road (`${imagePath}road.jpg`, canvas.height)
    ]; 
  
    if(!speedUp) objects = [new Car(`${imagePath}white.png`, Math.floor (screen.offsetWidth/2 - carWidth*scale), Math.floor (screen.offsetHeight/2))]; 
}

window.addEventListener ("resize", resizeCanvas); 
document.addEventListener ('keydown', function (e) {keyRepeat (e)});
document.addEventListener ('keyup', function (e) {clearRepeat (e)});
startButton.addEventListener ('click', function (e) {
    e.target.blur (); //после click остается фокус и срабатывает enter
    startGame ();   
    audio.readyState ? '' : initMusic ();
});

btnMute.addEventListener ('click', function (e) {
    if (!e.detail) return false;
    audio.muted ? btnMute.classList.remove ('muted') : btnMute.classList.add('muted');
    audio.muted = audio.muted ? false : true;  
});

resizeCanvas ();

function startGame () { 
    if (isPlayed) return false;
    timerScreenUpdate = setInterval (updateCanvas, 1000 / 60); //60 Гц
    isPlayed = true;
    menu.classList.add ('hide');
    footer.classList.add ('hide');
    btnPause.classList.add ('hide');
    btnMute.classList.remove ('hide');
    timePause += new Date().getTime() - timePauseStart; 
    audio.readyState ? '' : initMusic ();
}

function stopGame () {
    if (!isPlayed) return false;
    if (isGameOver) return false;
    clearInterval (timerScreenUpdate); 
    isPlayed = false;
    btnPause.classList.remove ('hide');
    timePauseStart = new Date().getTime();
}
 
function toggleGame () {
   isPlayed ? stopGame (): startGame ();
}

function updateCanvas () { 
    roads[0].offset (roads [1]);
    roads[1].offset (roads [2]);
    roads[2].offset (roads [0]);

    for (var i = 0; i < objects.length; i++) {
        if(i == player) continue;    
        if (objects[i].outScreen) {   
            outCars++;
            objects.splice (i, 1);
            i--;
            continue;
        }    
        objects [i].offset ();
    }
  
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].constructor.name != "Car") continue;
        for (let j = i+1; j < objects.length; j++) {
            if (objects[j].constructor.name != "Car") continue;
            if (objects[i].collide (objects[j])) {
                if (i == player) {  
                    gameOver ();
                    speedChange ();
                    break;
                }
            }
        }
    } 

    if (random (0, 10000) > chance) {
        let carType = random (0, cars.length -1);  
        let x = random (0, canvas.width -carWidth*scale);
        let y = random (250, 400) *-1*scale*3;
        if (checkPosition (x, y)) {     
            let carSpeed = Math.floor (speed/2);  
            if (random (0, 10000) > 8000) carSpeed = Math.floor (speed *7 /8);       
            objects.push (new Car(`${imagePath}${cars[carType]}.png`, x, y, carSpeed));  
        }    
    }   
    drawImage ();   
}
  
function speedChange (){
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].constructor.name != "Car") continue; 
        if (!objects[i].stopped) objects[i].speed = -objects[i].speed;
    }
    
}

function checkPosition (x, y) {
    for (let i=0; i<objects.length; i++) {   
        if (i == player) continue;   
        if ((x < objects[i].x + (objects[i].image.width -100)*scale ) && 
            (x > objects[i].x - (objects[i].image.width +100)*scale) &&
            (y < objects[i].y + (objects[i].image.height -100)*scale ) &&
            (y > objects[i].y - (objects[i].image.height +100)*scale )) return false;
    }
    return true;
}

function gameOver () {    
    isGameOver = true;
    isLevelUp = false;
    saveResult ();
    setTimeout (() => {
        isGameOver = false;
        stopGame ();
        showMenu ();
        restartGame ();    
    }, 2000);  
}

function restartGame (){
    timeStart = new Date().getTime();
    timePauseStart = timeStart;
    timePause = 0;
    outCars = 0;
    level = 1;
    chance = 9950;
    resizeCanvas (); 
}

function saveResult () {
    let survivalTimeSeconds = Math.floor ((new Date().getTime() -timeStart) /1000 *10) /10;
    let result = {
        date: getCurrentDate (),
        time: getSurvivalTime (),
        cars: outCars,
        score: parseInt (outCars*survivalTimeSeconds*10),
        last: '1'
    };
    if (!localStorage.getItem ('game')) localStorage.setItem ('game', JSON.stringify ([result]));
    else {
        let game = JSON.parse (localStorage.getItem ('game'));
        if (game.length == 10) game.pop();
        game = game.map (row => {
            row.last = "";
            return row;
        })
        game.push (result);
        game = game.sort ((a, b) => b.score - a.score);      
        localStorage.setItem ('game', JSON.stringify (game));
    }
}

function getSurvivalTime () {
    let time = new Date().getTime() - timeStart - timePause;
    checkLevel (time);
    const ms = time % 1000;
    const second  = parseInt(time / 1000) % 60;
    const minute  = parseInt((time / 60) / 1000) % 60;
    return `${minute}:${getTwoDigits (second)}.${getThreeDigits (ms)}`;
}

function checkLevel (time) {
    let levelTime = 10000; //каждые 10c повышение уровня
    if (time > level*levelTime) { 
        level++;
        if (level == 6) resizeCanvas (true);
        if (level == 13) resizeCanvas (true);

        if (level > 5) chance = Math.max (10000 - (level-5)*50, 9600);
        else if (level > 12) chance = Math.max (10000 - (level-12)*50, 9600);
        else chance = Math.max (10000 - level*50, 9600);
        isLevelUp = true;
        setTimeout(() => {isLevelUp = false}, 2000);
    }   
}

function getCurrentDate () {
    const toDay = new Date();
    const year = toDay.getFullYear();
    const month = toDay.getMonth() + 1;
    const day = toDay.getDate();
    return `${day}.${getTwoDigits(month)}.${year}`;
}

function getTwoDigits (n) {
    return (n < 10) ? '0' + n : n;
}

function getThreeDigits (n) {
    if (n > 9 && n < 100 ) return '0' + n;
    if (n < 10) return '00' + n;
    else return n;
}

function showMenu (){
    menu.classList.remove ('hide');
    menu.classList.add ('records');
    footer.classList.remove ('hide');
    btnPause.classList.add ('hide');
    btnMute.classList.add ('hide');
    showHistory ();
};

function showHistory () {
    
    let table = document.createElement ('table');
    let thead = document.createElement ('thead');
    let tbody = document.createElement ('tbody');
    table.append (thead);
    table.append (tbody);
    
    menuContent.innerHTML ="";
    menuContent.append (table);

    let headContent = ['','Date','Time', 'Cars', 'Score'];
    let headRow = document.createElement('tr');

    headContent.forEach (text => {
        let heading = document.createElement ('th');
        heading.innerHTML = text;
        headRow.append (heading);
    });

    thead.append (headRow);

    let history = JSON.parse (localStorage.getItem ('game'));

    history.forEach ( (el, index) => {
        let row = document.createElement ('tr');
        let column = document.createElement ('td');
        column.innerHTML = index + 1;   
        row.append (column);
        for (let key in el) {
            if (key == "last") {
                if (el[key]) {
                    row.classList.add ('last-record');
                    row.childNodes[0].innerHTML = "You";
                }
                continue;
            }
            let column = document.createElement ('td');
            column.innerHTML = el[key];   
            row.append (column);
        }
        tbody.append (row);
    }); 
}

function drawImage () { 
    ctx.clearRect (0, 0, canvas.width, canvas.height);
    roads.forEach (road => {
        ctx.drawImage (
            road.image, 0, 0, road.image.width, road.image.height,
            road.x, road.y, canvas.width, canvas.height 
            )
    })

    objects.forEach (obj => {
        ctx.drawImage (
            obj.image, 0, 0, obj.image.width, obj.image.height,
            obj.x, obj.y, obj.image.width *scale, obj.image.height *scale
        );
    });
    
    if (!isGameOver) placeText (getSurvivalTime (), canvas.width, 0);
    if (isGameOver) placeTextCenter ("GAME OVER", canvas.width/2, canvas.height/2);
    if (isLevelUp) placeTextCenter (`LEVEL ${level}`, canvas.width/2, canvas.height/2);

}
  
function placeText (text, x, y){
    ctx.font = "13pt Courier"; 
    ctx.fillStyle = "#bfae82";
    ctx.textAlign = "left";
    // ctx.fillStyle = "#b3b3b3";
    //let textMeas = ctx.measureText (text); // 83
    //let txtHeight = parseInt (ctx.font); //17
    let textMeas = 83;
    let txtHeight = 17;
    ctx.fillText (text, x - textMeas -200*scale, y + txtHeight);
    // ctx.fillText (text, x - textMeas.width -200*scale, y + txtHeight); 
}

function placeTextCenter (text, x, y){
    ctx.font = "17pt Arial"; 
    ctx.fillStyle = "#bfae82";
    //ctx.fillStyle = "#b3b3b3";
    let textMeas = ctx.measureText (text);
    let txtHeight = parseInt (ctx.font);
    //console.log (txtHeight);
    //ctx.fillText (text, x - textMeas -200*scale, y + txtHeight);
    ctx.fillText (text, x - textMeas.width/2, y + txtHeight); 
}

function driveCar (e) {
    switch (e.keyCode) {
        case 37: objects[player].move ('x', -speed); //Влевр
        break;
        case 39: objects[player].move ('x', speed); //Вправо
        break;
        case 38: objects[player].move ('y', -speed); //Вверх
        break;
        case 40: objects[player].move ('y', speed); //Вниз
        break;
        case 13: toggleGame (); //Enter
        break;
        case 27: stopGame (); //Esc
        break;
    }
}

function keyRepeat (e) {
    if (e.keyCode == 13 || e.keyCode == 27) {
        driveCar (e);
        return false;
    } 
    if (e.keyCode != currentKey) {  
        clearInterval (timerKeyboard); 
        timerKeyboard = null;
        currentKey = e.keyCode;
    }    
    if (timerKeyboard) return false;
    timerKeyboard = setInterval (function () {
        driveCar (e);
    }, 25); 
}

function clearRepeat (e) {
    if (currentKey != e.keyCode) return false;
    clearInterval (timerKeyboard); 
    timerKeyboard = null;
}

function initMusic () {
    //let audio = new Audio ();
    let myfiles = ["autobahn.mp3","axel_f.mp3", "taxi.mp3"];
    let clone = myfiles.slice (0);
    audio.controls = false;
    audio.autoplay = true;
    audio.volume = 0.2;
    audio.onended = function (){
        if (!myfiles.length) myfiles = clone.slice (0);
        let len = myfiles.length; 
        let index = random (0, len -1);
        let path = `./assets/audio/music/${myfiles.splice (index, 1)[0]}`;
        this.src = path;
        this.play ();
   }
   audio.onended ();
}

function playBoom () {
    let path ="./assets/audio/effects/boom.mp3";
    let audio = new Audio (path);
    audio.controls = false;
    audio.autoplay = true;
    audio.volume = 0.2;
}

function random (min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor (rand);
}

