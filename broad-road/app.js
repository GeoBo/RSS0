let screen = document.querySelector (".screen");
let canvas = document.querySelector ("canvas"); 
let ctx = canvas.getContext ("2d");
ctx.font = "30px Arial";
let scale; //Масштаб машин
let roads = [];  //Анимированный фон
let objects = []; //Массив игровых объектов
let player = 0;
let timerScreenUpdate;
let timerKeyboard;
let currentKey;
let speed;
//let imagePath = "https://raw.githubusercontent.com/evgeniikucheriavii/JS-Game/master/images/";
let imagePath = "./assets/image/road/";
let timeStart = new Date().getTime();
let timePause = 0;
let timePauseStart = timeStart;
let carWidth = 402;
//let carHeight = 790;
let outCars = 0;
let menu = document.querySelector (".menu");
let startButton = document.querySelector (".start__button");
//let pauseIcon = document.querySelector (".pause__icon");
let isPlayed = false;
let cars = ['blue', 'green', 'white', 'yellow', 'police'];

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
        if(v == "x") {//Перемещение по оси X
            this.x += d; //Смещение
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
        if (this.y < car.y + (car.image.height-50) * scale && this.y + (car.image.height-50) * scale > car.y) {
            if (this.x + (this.image.width-70) * scale > car.x && this.x < car.x + (this.image.width-70) * scale) {
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

const resizeCanvas = function () {
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
    speed = Math.floor (canvas.width /64 *100) /100;
   
    roads = [ //Массив с фонами
        new Road (`${imagePath}road.jpg`, -canvas.height), 
        new Road (`${imagePath}road.jpg`, -1),
        new Road (`${imagePath}road.jpg`, canvas.height)
    ]; 
  
    objects = [new Car(`${imagePath}red.png`, Math.floor (screen.offsetWidth/2 - carWidth*scale), Math.floor (screen.offsetHeight/2))]; 
}

window.addEventListener ("resize", resizeCanvas); 
document.addEventListener ('keydown', function (e) {keyRepeat (e)});
document.addEventListener ('keyup', function (e) {clearRepeat (e)});
startButton.addEventListener ('click', function (e) {e.target.blur(); startGame()});

resizeCanvas ();



function startGame () { 
    if (isPlayed) return false;
    timerScreenUpdate = setInterval (updateCanvas, 1000 / 60); //60 Гц
    isPlayed = true;
    menu.classList.add ('hide');
    //pauseIcon.classList.add ('hide');
    timePause += new Date().getTime() - timePauseStart; 
}

function stopGame () { //Остановка обновления 
    if (!isPlayed) return false;
    clearInterval (timerScreenUpdate); 
    isPlayed = false;
    //pauseIcon.classList.remove ('hide');
    timePauseStart = new Date().getTime();
}
 
function toggleGame () {
   isPlayed ? stopGame (): startGame ();
}

function updateCanvas () { //Обновление игры
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
        if(objects[i].constructor.name != "Car") continue;
        for (let j = i+1; j < objects.length; j++) {
            if (objects[j].constructor.name != "Car") continue;
            if (objects[i].collide (objects[j])) {
                if (i == player || j == player) {
                    gameOver ();
                    break;
                }
            }
        }
    } 
    if (random (0, 10000) > 9700) {
        let carType = random (0, cars.length -1);  
        let x = random (0, canvas.width -carWidth*scale);
        let y = random (250, 400) *-1*scale*3;
        if (checkPosition (x, y)) {  
            let carSpeed = speed/2;
            if (random (0, 10000) > 8000) carSpeed = speed *7 /8 ;
            objects.push (new Car(`${imagePath}${cars[carType]}.png`, x, y, carSpeed));  
        }    
    }   
    drawImage ();   
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
    stopGame ();
    saveResult ();
    // showHistory ();
}

function saveResult () {
    let survivalTimeSeconds = Math.floor ((new Date().getTime() -timeStart) /1000 *10) /10;
    let result = {
        date: getCurrentDate (),
        time: getSurvivalTime (),
        cars: outCars,
        score: outCars*survivalTimeSeconds*10,
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
    // let time = new Date().getTime() - timeStart;
    let time = new Date().getTime() - timeStart - timePause;
    const second  = parseInt(time / 1000) % 60;
    const ms = time - second*1000;
    const minute  = parseInt((time / 60) / 1000) % 60;
    // let hour = parseInt(((time / 60) / 60) / 1000) % 24;
    return `${minute}:${getTwoDigits (second)}.${getThreeDigits (ms)}`;
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

function showHistory () {
    let history = JSON.parse (localStorage.getItem ('game'));
    // history.forEach (el => {console.log (el)}); 
    history.forEach ( (el, index) => {
      console.log (index + 1);
        for (let key in el) {
            if (key == "last") continue;
            console.log (el[key]);
        }
    }); 
}

function drawImage () { //Работа с графикой
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
    ctx.fillText (getSurvivalTime (), canvas.width-60, canvas.height-20); 
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
        // case 13: startGame (); //Enter
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

function playMusic () {
    let audio = new Audio();
    let myfiles=["longlost.mp3","Nightcore.mp3"];
    audio.controls = false;
    audio.autoplay = true ;
    audio.onended = function (){
        let len = myfiles.length;
        if (len){
            let index = random (0, len -1);
            let path = `audio/${myfiles.splice (index, 1)[0]}`;
            this.src  = path;
            this.play ();
       }
   }
}

function random (min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor (rand);
}

console.clear();