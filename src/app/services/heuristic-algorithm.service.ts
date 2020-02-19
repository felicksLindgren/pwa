import { Injectable } from '@angular/core';
import { GridNode } from '../interfaces/grid-node';
import { Direction } from '../enums/direction';

@Injectable({
  providedIn: 'root'
})
export class HeuristicAlgorithmService {

  constructor() { }

  evaluate(grid: GridNode[][], start: GridNode, finish: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];
    start.distance = 0;
    start.totalDistance = 0;
    start.direction = Direction.Up;

    const unvisitedNodes = grid.reduce((acc, val) => acc.concat(val), []);

    while (!!unvisitedNodes.length) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) { continue; }
      if (closestNode.distance === Infinity) { return visitedNodesInOrder; }

      closestNode.internalIsVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode === finish) { return visitedNodesInOrder; }
      this.updateUnvisitedNeighbours(closestNode, finish, grid);
    }
  }

  // #region Private Methods

  private getUnvisitedNeighbours(node: GridNode, grid: GridNode[][]) {
    const neighbours = [];
    const {column, row} = node;

    if (row > 0) { neighbours.push(grid[row - 1][column]); }
    if (row < grid.length - 1) { neighbours.push(grid[row + 1][column]); }
    if (column > 0) { neighbours.push(grid[row][column - 1]); }
    if (column < grid[0].length - 1) { neighbours.push(grid[row][column + 1]); }

    return neighbours.filter(neighbor => !neighbor.internalIsVisited);
  }

  private updateUnvisitedNeighbours(current: GridNode, finish: GridNode, grid: GridNode[][]) {
    const unvisitedNeighbours = this.getUnvisitedNeighbours(current, grid);
    for (const neighbour of unvisitedNeighbours) {
      neighbour.distance = (Math.abs(neighbour.row - finish.row) + Math.abs(neighbour.column - finish.column));
      neighbour.previousNode = current;
    }
  }

  // #endregion
}
