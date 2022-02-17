let canvas = document.querySelector ("canvas"); 
let screen = document.querySelector (".screen");
let speed = 10;

class Road {
  constructor (imagePath, y) {
      this.x = 0;
      this.y = y;
      this.image = new Image();     
      this.image.src = imagePath;
  }

  offset (road) {
      this.y += speed; 
      if (this.y > screen.offsetHeight) { //Если изображение ушло за край холста, то меняем положение   
          // this.y = road.y - this.image.height + speed; // +67 Новое положение указывается с учётом второго фона
          this.y = road.y - canvas.height + speed + 1; // +67 Новое положение указывается с учётом второго фона
      }
  }
}


export default Road;