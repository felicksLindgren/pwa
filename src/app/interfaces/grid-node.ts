import { Direction } from '../enums/direction';

export interface GridNode {
  column: number;
  row: number;
  isFinish: boolean;
  isStart: boolean;
  isWall: boolean;
  isVisited: boolean;
  internalIsVisited: boolean;
  internalIsWall: boolean;
  isShortestPath: boolean;
  animateWall: boolean;
  distance: number;
  previousNode: GridNode;
  direction: Direction;
  totalDistance: number;
  heuristicDistance: number;
}


