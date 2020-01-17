import { Component } from '@angular/core';
import { GridNode } from 'src/app/interfaces/grid-node';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { keyframes, animate, style, trigger, transition, state } from '@angular/animations';
import { Direction } from 'src/app/enums/direction';

const NODE_SIZE = 25;

@Component({
  selector: 'app-pathfinding-vizualizer',
  templateUrl: './pathfinding-vizualizer.component.html',
  styleUrls: ['./pathfinding-vizualizer.component.scss'],
  animations: [
    trigger('node-wall', [
      state('move', style({
        backgroundColor: 'rgb(12, 53, 71)'
      })),
      transition('* => move', [
        animate('.5s ease-out', keyframes([
          style({
            backgroundColor: 'rgb(12, 53, 71)',
            transform: 'scale(0.6)',
            offset: 0
          }),
          style({
            transform: 'scale(1.2)',
            offset: 0.5
          }),
          style({
            transform: 'scale(1)',
            offset: 1
          })
        ]))
      ])
    ]),
    trigger('node-shortest-path', [
      state('move', style({
        backgroundColor: 'rgb(255, 254, 106)'
      })),
      transition('* => move', [
        animate('1.5s ease-out', keyframes([
          style({
            backgroundColor: 'rgb(255, 254, 106)',
            transform: 'scale(0.6)',
            offset: 0
          }),
          style({
            transform: 'scale(1.2)',
            offset: 0.5
          }),
          style({
            transform: 'scale(1)',
            offset: 1
          })
        ]))
      ])
    ]),
    trigger('node-visited', [
      state('move', style({
        backgroundColor: 'rgba(0, 190, 218, 0.75)',
        borderRadius: '0%'
      })),
      transition('* => move', [
        animate('1.5s ease-out', keyframes([
          style({
            transform: 'scale(0.3)',
            backgroundColor: 'rgba(0, 0, 66, 0.75)',
            borderRadius: '100%',
            offset: 0,
          }),
          style({
            transform: 'scale(0.6)',
            backgroundColor: 'rgba(0, 0, 66, 0.75)',
            borderRadius: '100%',
            offset: 0.25
          }),
          style({
            transform: 'scale(0.9)',
            backgroundColor: 'rgba(17, 104, 217, 0.75)',
            borderRadius: '100%',
            offset: 0.5
          }),
          style({
            transform: 'scale(1.2)',
            backgroundColor: 'rgba(0, 217, 159, 0.75)',
            borderRadius: '100%',
            offset: 0.75,
          }),
          style({
            transform: 'scale(1)',
            backgroundColor: 'rgba(0, 190, 218, 0.75)',
            borderRadius: '0',
            offset: 1
          })
        ]), )
      ])
    ])
  ]
})
export class PathfindingVizualizerComponent {
  grid: GridNode[][];
  mouseIsPressed = false;
  selected = 'Dijkstra';
  speed = 50;

  private innerWidth: number;
  private innerHeight: number;

  private START_NODE_ROW: number;
  private START_NODE_COLUMN: number;
  private FINISH_NODE_ROW: number;
  private FINISH_NODE_COLUMN: number;

  constructor(private algorithmService: AlgorithmService) {
    this.innerWidth = 2 * Math.round(Math.floor((window.innerWidth / NODE_SIZE) / 1.2) / 2) + 1;
    this.innerHeight = 2 * Math.round(Math.floor((window.innerHeight / NODE_SIZE) / 1.65) / 2) - 1;
    this.START_NODE_ROW = Math.floor(this.innerHeight / 2);
    this.START_NODE_COLUMN = Math.floor(this.innerWidth / 4);
    this.FINISH_NODE_ROW = Math.floor(this.innerHeight / 2);
    this.FINISH_NODE_COLUMN = Math.floor((this.innerWidth / 4) * 3);
    this.grid = this.getInitialGrid();
  }

  async handleMouseDown(row: number, column: number) {
    const node = this.grid[row][column];

    if (node.isStart || node.isFinish) { return; }
    if (node.isWall) { node.isWall = false; return; }

    node.isWall = true;
    this.mouseIsPressed = true;
  }

  async handleMouseEnter(row: number, column: number) {
    if (!this.mouseIsPressed) { return; }
    const node = this.grid[row][column];

    if (node.isStart || node.isFinish) { return; }
    if (node.isWall) { node.isWall = false; return; }

    node.isWall = true;
  }

  resetGrid = () => this.grid = this.getInitialGrid();
  resetAlgorithm() {
    const nodes = this.grid.reduce((acc, value) => acc.concat(value), []);
    for (const node of nodes) {
        node.distance = node.isStart ? 0 : Infinity;
        node.totalDistance = node.isStart ? 0 : Infinity;
        node.direction = node.isStart ? Direction.Up : null;
        node.isVisited = false;
        node.internalIsVisited = false;
        node.isShortestPath = false;
        node.previousNode = null;
    }
  }

  vizualizeMaze() {
    const wallsToAnimate = this.algorithmService.maze(this.grid, 2, this.innerHeight - 3, 2, this.innerWidth - 3, 'vertical');
    this.animateWalls(wallsToAnimate);
  }

  visualizeAlgorithm() {
    const start = this.grid[this.START_NODE_ROW][this.START_NODE_COLUMN];
    const finish = this.grid[this.FINISH_NODE_ROW][this.FINISH_NODE_COLUMN];

    const visitedNodesInOrder = this.algorithmService.evaluate(this.selected, this.grid, start, finish);
    const nodesInShortestPathOrder = this.algorithmService.getNodesInShortestPathOrder(finish);

    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  formatLabel(value: number) {
    return `${value}ms`;
  }

  //#region Private Methods

  private animateWalls(walls: GridNode[]) {
    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        walls[i].isWall = true;
        walls[i].animateWall = true;
      }, 10 * i);
    }
  }

  private animate(visitedNodesInOrder: GridNode[], nodesInShortestPathOrder: GridNode[]) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.speed * i);
        return;
      }

      if (!this.speed) {
        visitedNodesInOrder[i].isVisited = true;
        continue;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.isVisited = true;
      }, this.speed * i);
    }
  }

  private animateShortestPath(nodesInShortestPathOrder: GridNode[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        node.isShortestPath = true;
      }, (50) * i);
    }
  }

  private getInitialGrid(): GridNode[][] {
    const grid: GridNode[][] = [];

    for (let row = 0; row < this.innerHeight; row++) {
      const currentRow: GridNode[] = [];
      for (let column = 0; column < this.innerWidth; column++) {
        currentRow.push(this.createNode(column, row));
      }
      grid.push(currentRow);
    }

    return grid;
  }



  private createNode(column: number, row: number): GridNode {
    return {
      column,
      row,
      isStart: row === this.START_NODE_ROW && column === this.START_NODE_COLUMN,
      isFinish: row === this.FINISH_NODE_ROW && column === this.FINISH_NODE_COLUMN,
      distance: (row === this.START_NODE_ROW && column === this.START_NODE_COLUMN) ? 0 : Infinity,
      totalDistance: (row === this.START_NODE_ROW && column === this.START_NODE_COLUMN) ? 0 : Infinity,
      direction: (row === this.START_NODE_ROW && column === this.START_NODE_COLUMN) ? Direction.Up : null,
      isVisited: false,
      isShortestPath: false,
      isWall: false,
      previousNode: null
    } as GridNode;
  }

  //#endregion
}
