let canvas = document.querySelector ("canvas"); 
let scale = canvas.width / 3000;
let speed = 10;

console.log (canvas.offsetHeight);
//scale = 0.1;

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

export default Car;

