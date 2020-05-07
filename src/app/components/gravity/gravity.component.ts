import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ball } from 'src/app/interfaces/ball';

const FRAME_RATE = 1 / 40;
const FRAME_DELAY = FRAME_RATE * 1000; // ms
const RADIUS = 15;
const A = Math.PI * RADIUS * RADIUS / (10000);
const CD = 0.47;
const RHO = 1.22;
const AG = 9.81;
const FRICTION = 0.97;

/*
 * Experiment with values of mass, radius, restitution,
 * gravity (ag), and density (rho)!

 * Changing the constants literally changes the environment
 * the ball is in.

 * Some settings to try:
 * the moon: ag = 1.6
 * water: rho = 1000, mass 5
 * beach ball: mass 0.05, radius 30
 * lead ball: mass 10, restitution -0.05
 */

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss']
})
export class GravityComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  width = window.innerWidth * 0.8 + 1;
  height = window.innerHeight * 0.8 + 1;
  backgroundSize = `${this.width / 10}px ${this.height / 10}px`;
  ball: Ball;
  mouse = { x: 0, y: 0, isDown: false };
  loopTimer = false;

  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.ball = {
      position: { x: this.width / 2, y: 0 },
      velocity: { x: 0, y: 0 },
      mass: 0.1,
      radius: RADIUS,
      restitution: -0.7
    };
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.canvas.nativeElement.onmousemove = this.getMousePosition.bind(this);
    this.canvas.nativeElement.onmousedown = this.mouseDown.bind(this);
    this.canvas.nativeElement.onmouseup = this.mouseUp.bind(this);

    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = '#000000';
    setInterval(this.loop.bind(this), FRAME_DELAY);
  }

  loop() {
    if (!this.mouse.isDown) {
      // Do physics
      // Drag force: Fd = -1/2 * Cd * A * rho * v * v
      let Fx = -0.5 * CD * A * RHO * this.ball.velocity.x * this.ball.velocity.x * this.ball.velocity.x / Math.abs(this.ball.velocity.x);
      let Fy = -0.5 * CD * A * RHO * this.ball.velocity.y * this.ball.velocity.y * this.ball.velocity.y / Math.abs(this.ball.velocity.y);

      Fx = (isNaN(Fx) ? 0 : Fx);
      Fy = (isNaN(Fy) ? 0 : Fy);

      // Calculate acceleration ( F = ma )
      const ax = Fx / this.ball.mass;
      const ay = AG + (Fy / this.ball.mass);
      // Integrate to get velocity
      this.ball.velocity.x += ax * FRAME_RATE;
      this.ball.velocity.y += ay * FRAME_RATE;

      // Integrate to get position
      this.ball.position.x += this.ball.velocity.x * FRAME_RATE * 100;
      this.ball.position.y += this.ball.velocity.y * FRAME_RATE * 100;
    }

    // Handle collisions
    if (this.ball.position.y < this.ball.radius) {
      this.ball.velocity.y *= this.ball.restitution;
      this.ball.position.y = this.ball.radius;
    }
    if (this.ball.position.y > this.height - this.ball.radius) {
      this.ball.velocity.y *= this.ball.restitution;
      this.ball.position.y = this.height - this.ball.radius;
    }
    if (this.ball.position.x > this.width - this.ball.radius) {
      this.ball.velocity.x *= this.ball.restitution;
      this.ball.position.x = this.width - this.ball.radius;
    }
    if (this.ball.position.x < this.ball.radius) {
      this.ball.velocity.x *= this.ball.restitution;
      this.ball.position.x = this.ball.radius;
    }
    if (this.ball.position.y === this.height - this.ball.radius && this.ball.velocity.x !== 0) {
      this.ball.velocity.x *= FRICTION;
    }

    // Draw the ball

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();

    this.ctx.translate(this.ball.position.x, this.ball.position.y);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();

    // Draw the slingshot
    if (this.mouse.isDown) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.ball.position.x, this.ball.position.y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.stroke();
      this.ctx.closePath();
  }
  }

  mouseDown = (event: any) => {
    if (event.which === 1) {
      this.getMousePosition(event);
      this.mouse.isDown = true;
    }
  }

  mouseUp = (event: any) => {
    if (event.which === 1) {
      this.mouse.isDown = false;
      this.ball.velocity.y = (this.mouse.y - this.ball.position.y) / 10;
      this.ball.velocity.x = (this.mouse.x - this.ball.position.x) / 10;
    }
  }

  getMousePosition(event: any) {
    this.mouse.x = event.pageX - this.canvas.nativeElement.offsetLeft;
    this.mouse.y = event.pageY - this.canvas.nativeElement.offsetTop;
  }
}
