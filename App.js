import Board from './board';

require('./style.css')

window.onload = () => {

  const BOARD = document.getElementsByClassName('board')[0];
  const CELL_SIZE = 60;
  
  const board = new Board(BOARD, CELL_SIZE)
  board.create();
}