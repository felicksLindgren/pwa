import { Injectable } from '@angular/core';
import { GridNode } from '../interfaces/grid-node';
import { Direction } from '../enums/direction';

@Injectable({
  providedIn: 'root'
})
export class AstarService {

  constructor() { }

  evaluate(grid: GridNode[][], start: GridNode, finish: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];

    const unvisitedNodes = grid.reduce((acc, val) => acc.concat(val), []);

    while (!!unvisitedNodes.length) {
      // tslint:disable-next-line:max-line-length
      unvisitedNodes.sort((a, b) => a.totalDistance !== b.totalDistance ? a.totalDistance - b.totalDistance : a.heuristicDistance - b.heuristicDistance);
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
      const distance = this.getDistance(current, neighbour);

      if (!neighbour.heuristicDistance) {
        neighbour.heuristicDistance = (Math.abs(neighbour.row - finish.row) + Math.abs(neighbour.column - finish.column));
      }

      const distanceToCompare = current.distance + distance.distance;
      if (distanceToCompare < neighbour.distance) {
        neighbour.distance = distanceToCompare;
        neighbour.totalDistance = neighbour.distance + neighbour.heuristicDistance;
        neighbour.previousNode = current;
        neighbour.direction = distance.direction;
      }
    }
  }

  private getDistance(current: GridNode, target: GridNode): { distance: number, direction: Direction } {
    const result: { distance: number, direction: Direction } = { distance: null, direction: null };

    // Above
    if (target.row < current.row && current.column === target.column) {
      result.direction = Direction.Up;

      if (current.direction === Direction.Up) {
        result.distance = 1;
      } else if (current.direction === Direction.Right) {
        result.distance = 2;
      } else if (current.direction === Direction.Left) {
        result.distance = 2;
      } else if (current.direction === Direction.Down) {
        result.distance = 3;
      }
    // Below
    }
    if (target.row > current.row && current.column === target.column) {
      result.direction = Direction.Down;

      if (current.direction === Direction.Up) {
        result.distance = 3;
      } else if (current.direction === Direction.Right) {
        result.distance = 2;
      } else if (current.direction === Direction.Left) {
        result.distance = 2;
      } else if (current.direction === Direction.Down) {
        result.distance = 1;
      }
    }
    // To the left
    if (target.column < current.column && current.row === target.row) {
      result.direction = Direction.Left;

      if (current.direction === Direction.Up) {
        result.distance = 2;
      } else if (current.direction === Direction.Right) {
        result.distance = 3;
      } else if (current.direction === Direction.Left) {
        result.distance = 1;
      } else if (current.direction === Direction.Down) {
        result.distance = 2;
      }
    }
    // To the right
    if (target.column > current.column && current.row === target.row) {
      result.direction = Direction.Right;

      if (current.direction === Direction.Up) {
        result.distance = 2;
      } else if (current.direction === Direction.Right) {
        result.distance = 1;
      } else if (current.direction === Direction.Left) {
        result.distance = 3;
      } else if (current.direction === Direction.Down) {
        result.distance = 2;
      }
    }

    return result;
  }

  // #endregion
}
