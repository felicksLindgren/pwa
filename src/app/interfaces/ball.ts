export interface Ball {
  position: { x: number, y: number };
  velocity: { x: number, y: number };
  mass: number;
  radius: number;
  restitution: number;
}
