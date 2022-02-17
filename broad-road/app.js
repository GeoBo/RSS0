let screen = document.querySelector (".screen");
let canvas = document.querySelector ("canvas"); 
let ctx = canvas.getContext ("2d"); //Получение контекста — через него можно работать с холстом
let scale; //Масштаб машин
let roads = [];  //Анимированный фон
let objects = []; //Массив игровых объектов
let player = 0; //Объект, которым управляет игрок, — тут будет указан номер объекта в массиве objects
let timerScreenUpdate;
let timerKeyboard;
let currentKey;
let speed = 10;
// let imagePath = "https://raw.githubusercontent.com/evgeniikucheriavii/JS-Game/master/images/";
let imagePath = "./assets/image/road/";

let score = 0;
let timeStart = new Date().getTime();
let timeEnd;

window.addEventListener ("resize", resizeCanvas); 
document.addEventListener ('keydown', function (e) {keyRepeat (e)});
document.addEventListener('keyup', function (e) {clearRepeat (e)});

resizeCanvas ();
// startGame ();

//acceleration ();

// function acceleration () {
//     setInterval (() => {speed++}, 5000);
// };

class Road {
    constructor (imagePath, y, speed) {
        this.x = 0;
        this.y = y;
        this.image = new Image();     
        this.image.src = imagePath;
    }
 
    offset (road) {
        this.y += speed;
        if (this.y > screen.offsetHeight) { //Если изображение ушло за край холста, то меняем положение   
            // this.y = road.y - this.image.height + speed; // +67 Новое положение указывается с учётом второго фона
            this.y = road.y - canvas.height + speed +1; // Новое положение указывается с учётом второго фона
        }
    }
}

roads = [ //Массив с фонами
    new Road (`${imagePath}road.jpg`, -canvas.height), 
    new Road (`${imagePath}road.jpg`, -1),
    new Road (`${imagePath}road.jpg`, canvas.height)
]; 

class Car {
    constructor (image, x, y, speed) {
        this.x = x;
        this.y = y;
        this.image = new Image ();
        this.image.src = image;
        this.speed = speed;
    }
  
    offset () {
        //this.y += speed;
        this.y += this.speed;
        if (this.y > canvas.height + 50) {
            this.outScreen = true;
            score += 100;
            //console.log(score);
        }    
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
        if (this.y < car.y + (car.image.height-50) * scale && this.y + (car.image.height-50) * scale > car.y) {//Если объекты находятся на одной линии по горизонтали     
            if (this.x + (this.image.width-70) * scale > car.x && this.x < car.x + (this.image.width-70) * scale) {//Если объекты находятся на одной линии по вертикали           
                timeEnd = new Date().getTime() -timeStart;
                //console.log (timeEnd);
                return true;     
            }
        }
        return false;
    }
}

objects = [new Car(`${imagePath}car.png`, Math.floor (screen.offsetWidth/2 - 402/2*scale), Math.floor (screen.offsetHeight/2))]; //Массив игровых объектов







function random (min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor (rand);
}

function startGame () {
    if (timerScreenUpdate) return false;
    timerScreenUpdate = setInterval (updateCanvas, 1000 / 60); //60 Гц
}
  
function stopGame () { //Остановка обновления
    clearInterval (timerScreenUpdate); 
    timerScreenUpdate = null;
}
  
function updateCanvas () { //Обновление игры
    roads[0].offset (roads [1]);
    roads[1].offset (roads [2]);
    roads[2].offset (roads [0]);

    for (var i = 0; i < objects.length; i++) {
        if(i == player) continue;
        objects[i].offset();
        if (objects[i].outScreen) objects.splice(i, 1);
    }

    for (let i = 0; i < objects.length; i++) {
        if (i == player) continue;
        if (objects[player].collide(objects[i])) {
            stopGame ();
            break;
        }
    }
    
    if (random (0, 10000) > 9700) {
        let x = random (30, canvas.width -50);
        let y = random (250, 400) *-1;
        if (checkPosition (x, y)) {  
            let carSpeed = speed/2;
            if (random (0, 10000) > 8000) carSpeed = speed/2 +2;
            objects.push (new Car(`${imagePath}car_red.png`, x, y, carSpeed));  
        }    
    }
    drawImage ();    
}
  

function checkPosition (x, y) {
    for (let i=0; i<objects.length; i++) {   
        if (i == player) continue;   
        if ((x < objects[i].x + objects[i].image.width*scale +50) && 
            (x > objects[i].x - objects[i].image.width*scale -50) &&
            (y < objects[i].y + objects[i].image.height*scale +100) &&
            (y > objects[i].y - objects[i].image.height*scale -100)) return false;
    }
    return true;
}

function drawImage () { //Работа с графикой
    ctx.clearRect (0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
    roads.forEach (road => {
    ctx.drawImage (
        road.image, 
        0, 
        0, 
        road.image.width, 
        road.image.height, //Высота изображения
        road.x, 
        road.y, 
        canvas.width, //Ширина изображения на холсте
        canvas.height //Так как ширина и высота фона одинаковые, в качестве высоты указывается ширина
        )
    })

    objects.forEach (obj => {
        ctx.drawImage (
            obj.image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            obj.image.width, //Ширина изображения
            obj.image.height, //Высота изображения
            obj.x, //Положение по оси X на холсте
            obj.y, //Положение по оси Y на холсте
            obj.image.width * scale, //Ширина изображения на холсте, умноженная на масштаб
            obj.image.height * scale //Высота изображения на холсте, умноженная на масштаб
        );
    });
 }
   
function resizeCanvas () {
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
    
    scale = canvas.width / 4000;

    if (objects.length) objects = [new Car(`${imagePath}car.png`, Math.floor (screen.offsetWidth*2/4 - 402*scale), Math.floor (screen.offsetHeight/2))]; //Массив игровых объектов
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
        case 13: startGame (); //Enter
        break;
        case 27: stopGame (); //Esc
        break;
    }
}

function keyRepeat (e) {
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