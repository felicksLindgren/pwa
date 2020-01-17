import { Injectable } from '@angular/core';
import { GridNode } from '../interfaces/grid-node';
import { AstarService } from './astar.service';
import { DijkstraService } from './dijkstra.service';
import { HeuristicAlgorithmService } from './heuristic-algorithm.service';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {

  constructor(
    private astar: AstarService,
    private dijkstra: DijkstraService,
    private heuristicAlgorithm: HeuristicAlgorithmService) { }

  evaluate(type: string, grid: GridNode[][], start: GridNode, finish: GridNode): GridNode[] {
    switch (type) {
      case 'Dijkstra':
        return this.dijkstra.evalute(grid, start, finish);
      case 'Astar':
        return this.astar.evaluate(grid, start, finish);
      case 'Random':
        return this.heuristicAlgorithm.evaluate(grid, start, finish);
      default:
        return [];
    }
  }

  getNodesInShortestPathOrder(finish: GridNode): GridNode[] {
    const nodesInShortestPathOrder: GridNode[] = [];
    let currentNode = finish;

    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    return nodesInShortestPathOrder;
  }

  maze(
    grid: GridNode[][],
    startRow: number,
    finishRow: number,
    startColumn: number,
    finishColumn: number,
    orientation = 'horizontal',
    wallsToAnimate = []
  ): GridNode[] {
    if (finishRow < startRow || finishColumn < startColumn) {
      return;
    }

    const nodes = grid.reduce((acc, value) => acc.concat(value), []);
    const possibleRows = [];
    const possibleCols = [];

    if (orientation === 'horizontal') {
      for (let i = startRow; i <= finishRow; i += 2) {
        possibleRows.push(i);
      }
      for (let i = startColumn - 1; i <= finishColumn + 1; i += 2) {
        possibleCols.push(i);
      }

      const randomRow = Math.floor(Math.random() * possibleRows.length);
      const randomCol = Math.floor(Math.random() * possibleCols.length);

      for (const node of nodes) {
        if (node.isStart || node.isFinish || node.internalIsWall) { continue; }

        if (node.row === 0 || node.column === 0 || node.row === grid.length - 1 || node.column === grid[node.row].length - 1) {
          wallsToAnimate.push(node);
          node.internalIsWall = true;
        }

        if (node.row === possibleRows[randomRow] && node.column !== possibleCols[randomCol] && node.column >= startColumn - 1 && node.column <= finishColumn + 1) {
          wallsToAnimate.push(node);
          node.internalIsWall = true;
        }
      }

      if (possibleRows[randomRow] - 2 - startRow > finishColumn - startColumn) {
        const walls = this.maze(grid, startRow, possibleRows[randomRow] - 2, startColumn, finishColumn, orientation, wallsToAnimate);
        wallsToAnimate.concat(walls);
      } else {
        const walls = this.maze(grid, startRow, possibleRows[randomRow] - 2, startColumn, finishColumn, 'vertical', wallsToAnimate);
        wallsToAnimate.concat(walls);
      }
      if (finishRow - (possibleRows[randomRow] + 2) > finishColumn - startColumn) {
        const walls = this.maze(grid, possibleRows[randomRow] + 2, finishRow, startColumn, finishColumn, orientation, wallsToAnimate);
        wallsToAnimate.concat(walls);
      } else {
        const walls = this.maze(grid, possibleRows[randomRow] + 2, finishRow, startColumn, finishColumn, 'vertical', wallsToAnimate);
        wallsToAnimate.concat(walls);
      }
      return wallsToAnimate;
    } else {
      for (let i = startRow - 1; i <= finishRow + 1; i += 2) {
        possibleRows.push(i);
      }
      for (let i = startColumn; i <= finishColumn; i += 2) {
        possibleCols.push(i);
      }

      const randomRow = Math.floor(Math.random() * possibleRows.length);
      const randomCol = Math.floor(Math.random() * possibleCols.length);

      for (const node of nodes) {
        if (node.isStart || node.isFinish || node.internalIsWall) { continue; }

        if (node.row === 0 || node.column === 0 || node.row === grid.length - 1 || node.column === grid[node.row].length - 1) {
          wallsToAnimate.push(node);
          node.internalIsWall = true;
        }

        if (node.column === possibleCols[randomCol] && node.row !== possibleRows[randomRow] && node.row >= startRow - 1 && node.row <= finishRow + 1) {
          wallsToAnimate.push(node);
          node.internalIsWall = true;
        }
      }

      if (finishRow - startRow > possibleCols[randomCol] - 2 - startColumn) {
        const walls = this.maze(grid, startRow, finishRow, startColumn, possibleCols[randomCol] - 2, 'horizontal', wallsToAnimate);
        wallsToAnimate.concat(walls);
      } else {
        const walls = this.maze(grid, startRow, finishRow, startColumn, possibleCols[randomCol] - 2, orientation, wallsToAnimate);
        wallsToAnimate.concat(walls);
      }
      if (finishRow - startRow > finishColumn - (possibleCols[randomCol] + 2)) {
        const walls = this.maze(grid, startRow, finishRow, possibleCols[randomCol] + 2, finishColumn, 'horizontal', wallsToAnimate);
        wallsToAnimate.concat(walls);
      } else {
        const walls = this.maze(grid, startRow, finishRow, possibleCols[randomCol] + 2, finishColumn, orientation, wallsToAnimate);
        wallsToAnimate.concat(walls);
      }
      return wallsToAnimate;
    }
  }
}
