export interface DrawType {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
}

export interface Point {
  x: number;
  y: number;
}
