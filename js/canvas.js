function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  var canvas = document.querySelector("canvas#pinpon");
  canvas.width = document.querySelector("canvas#pinpon").offsetWidth;
  canvas.height = document.querySelector("canvas#pinpon").offsetHeight;
  var ctx = canvas.getContext("2d");
  
  var TAU = 2 * Math.PI;
  var SIN = 3 * Math.PI;
  
  times = [];
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(loop);
  }
  
  function Ball (startX, startY, startVelX, startVelY) {
    this.x = startX || Math.random() * canvas.width;
    this.y = startY || Math.random() * canvas.height;
    this.size = getRandomInt(1,7);
    this.hue = getRandomInt(0,255);
    this.sat = '100%';
    this.lig = '90%';
    this.alpha = this.size * 10;
    this.vel = {
      x: startVelX || Math.random() * 3 - 1,
      y: startVelY || Math.random() * 3 - 1
    };
    this.update = function(canvas) {
      if (this.x > canvas.width + 50 || this.x < -50) {
        this.vel.x = -this.vel.x;
      }
      if (this.y > canvas.height + 50 || this.y < -50) {
        this.vel.y = -this.vel.y;
      }
      this.x += this.vel.x;
      this.y += this.vel.y;
    };
    this.draw = function(ctx, can) {
      ctx.beginPath();
      var distM = distMouse(this);
      if (distM > 200) {
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = 1 - distM / 240;
      }
      ctx.fillStyle = `hsla(${this.hue},${this.sat},${this.lig}, ${this.alpha})`;
      ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, this.size + 1, 0, TAU, false);
      ctx.fill();
    }
  }
  
  var balls = [];
  for (var i = 0; i < canvas.width * canvas.height / (65*65); i++) {
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  
  var lastTime = Date.now();
  function update() {
    var diff = Date.now() - lastTime;
    for (var frame = 0; frame * 16.6667 < diff; frame++) {
      for (var index = 0; index < balls.length; index++) {
        balls[index].update(canvas);
      }
    }
    lastTime = Date.now();
  }
  var mouseX = -1e9, mouseY = -1e9;
  document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  
  function distMouse(ball) {
    return Math.hypot(ball.x - mouseX, ball.y - mouseY);
  }
  
  function draw() {
    for (var index = 0; index < balls.length; index++) {
      var ball = balls[index];
      ctx.beginPath();
      ball.draw(ctx, canvas);
    }
  }
  
  // Start
  loop();