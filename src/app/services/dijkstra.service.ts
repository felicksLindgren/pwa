import { Injectable } from '@angular/core';
import { GridNode } from '../interfaces/grid-node';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {

  constructor() { }

  evalute(grid: GridNode[][], start: GridNode, finish: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];
    start.distance = 0;
    const unvisitedNodes = grid.reduce((acc, val) => acc.concat(val), []);

    while (!!unvisitedNodes.length) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) { continue; }
      if (closestNode.distance === Infinity) { return visitedNodesInOrder; }

      closestNode.internalIsVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode === finish) { return visitedNodesInOrder; }
      this.updateUnvisitedNeighbours(closestNode, grid);
    }
  }

  // #region Private methods

  private getUnvisitedNeighbours(node: GridNode, grid: GridNode[][]): GridNode[] {
    const neighbours = [];
    const {column, row} = node;

    // Push next node ABOVE current if we're still inside grid
    if (row > 0) { neighbours.push(grid[row - 1][column]); }

    // Push next node BELOW current if we're still inside grid
    if (row < grid.length - 1) { neighbours.push(grid[row + 1][column]); }

    // Push next node LEFT OF current if we're still inside grid
    if (column > 0) { neighbours.push(grid[row][column - 1]); }

    // Push next node RIGHT OF current if we're still inside grid
    if (column < grid[0].length - 1) { neighbours.push(grid[row][column + 1]); }

    // Filter all nodes that are already visited
    return neighbours.filter(neighbor => !neighbor.internalIsVisited);
  }

  private updateUnvisitedNeighbours(node: GridNode, grid: GridNode[][]) {
    const unvisitedNeighbours = this.getUnvisitedNeighbours(node, grid);
    for (const neighbour of unvisitedNeighbours) {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
    }
  }

  // #endregion
}
