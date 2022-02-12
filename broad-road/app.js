let body = document.querySelector ("body");
let screen = document.querySelector (".screen");
let canvas = document.querySelector ("canvas"); 
let ctx = canvas.getContext ("2d"); //Получение контекста — через него можно работать с холстом
let scale = 0.1; //Масштаб машин
let roads = [];  //Анимированный фон
let objects = []; //Массив игровых объектов
let player = 0; //Объект, которым управляет игрок, — тут будет указан номер объекта в массиве objects
let timerScreenUpdate;
let timerKeyboard;
let currentKey;
let speed = 10;
let imagePath = "https://raw.githubusercontent.com/evgeniikucheriavii/JS-Game/master/images/";

window.addEventListener ("resize", resizeCanvas); 
document.addEventListener ('keydown', function (e) {keyRepeat (e)});
document.addEventListener('keyup', function (e) {clearRepeat (e)});

resizeCanvas (); // При загрузке страницы задаётся размер холста

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

function startGame () {
    if (timerScreenUpdate) return false;
    timerScreenUpdate = setInterval (updateCanvas, 1000 / 60); //60 Гц
}
 
function stopGame () { //Остановка обновления
    clearInterval (timerScreenUpdate); 
    timerScreenUpdate = null;
}
 
function updateCanvas () { //Обновление игры
    // roads[0].offset (roads [1]);
    // roads[1].offset (roads [0]);

    roads[0].offset (roads [1]);
    roads[1].offset (roads [2]);
    roads[2].offset (roads [0]);
    drawImage ();
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
          canvas.width //Так как ширина и высота фона одинаковые, в качестве высоты указывается ширина
          //road.image.height
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

    scale = canvas.width / 3000;
}

class Road {
    constructor (imagePath, y, speed) {
        this.x = 0;
        this.y = y;
        this.image = new Image();     
        this.image.src = imagePath;
    }
 
    offset (road) {
        this.y += speed; //При обновлении изображение смещается вниз
        // console.log ('this.y ' +this.y);
        // console.log ('road.y ' +road.y);
        //if(this.y > window.innerHeight) {
        if (this.y > screen.offsetHeight) { //Если изображение ушло за край холста, то меняем положение   
            // this.y = road.y - this.image.height + speed; // +67 Новое положение указывается с учётом второго фона
            this.y = road.y - canvas.height + speed +1; // +67 Новое положение указывается с учётом второго фона
        }
    }
}

roads = [
  // new Road (`${imagePath}road.jpg`, 0), 
  // new Road (`${imagePath}road.jpg`, canvas.height),

  new Road (`${imagePath}road.jpg`, -canvas.height), 
  new Road (`${imagePath}road.jpg`, 0),
  new Road (`${imagePath}road.jpg`, canvas.height)
]; //Массив с фонами

class Car {
    constructor (image, x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image ();
        this.image.src = image;
    }
  
    offset () {
        this.y += speed;
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
}

objects = [new Car(`${imagePath}car.png`, Math.floor (screen.offsetWidth*3/4), Math.floor (screen.offsetHeight/2))]; //Массив игровых объектов


 //startGame();
