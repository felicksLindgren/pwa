import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from 'src/app/services/tic-tac-toe.service';
import { Observable } from 'rxjs';
import { OnDestroyComponent } from '../on-destroy/on-destroy.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent extends OnDestroyComponent implements OnInit {
  grid$: Observable<any[][]>;
  lastMove: string;

  constructor(private tictactoeService: TicTacToeService) {
    super();
    this.grid$ = this.tictactoeService.getGrid();
    this.tictactoeService.getLastMove().pipe(takeUntil(this.destroy$)).subscribe(value => this.lastMove = value);
  }

  ngOnInit() {
  }

  click(grid: any, node: any) {

    if (grid[node.row][node.column].value) { return; }

    if (this.lastMove) {
      if (this.lastMove === 'X') {
        grid[node.row][node.column].value = 'O';

        this.tictactoeService.saveLastMove('O');
        this.tictactoeService.saveGrid(grid);
        return;
      }
      if (this.lastMove === 'O') {
        grid[node.row][node.column].value = 'X';

        this.tictactoeService.saveLastMove('X');
        this.tictactoeService.saveGrid(grid);
        return;
      }
    } else {
      grid[node.row][node.column].value = 'X';

      this.tictactoeService.saveLastMove('X');
      this.tictactoeService.saveGrid(grid);
      return;
    }
  }

  resetGrid(grid: any[][]) {
    for (let i = 0; i < grid.length; i++) {
      for (let y = 0; y < grid[i].length; y++) {
        grid[i][y].value = '';
      }
    }

    this.tictactoeService.saveLastMove(null);
    this.tictactoeService.saveGrid(grid);
  }
}
