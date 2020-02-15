
const EMPTY_CELL = 0
function getCellName(row, col) {
  return `${row}_${col}`
}


/**
 * Scaffolds a board at the given mountNode (DOM reference).
 * 
 * Table with a ID - row_col will be created like below
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * | 0_0 | 0_1 | 0_2 | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * | 1_0 | 1_1 | 1_2 | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * | 2_0 | 2_1 | 2_2 | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * | ... |     |     | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * |     |     |     | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * |     |     |     | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * |     |     |     | ... |     |     |     |     |
 * |-----|-----|-----|-----|-----|-----|-----|-----|
 * 
 * @param {DOM} mountNode
 * @param {number} cellSize
 */
export default class Board {
  constructor(mountNode, cellSize = 60) {
    // Please don't configure it to anything < 60
    if (cellSize < 60) {
      cellSize = 60;
    }

    this.mountNode = mountNode
    this.cellSize = cellSize
    this.marioCellIndex = '0_0';
    this.poisonPlaces={};
    this.mushroomPlaces={};
    this.currentDir="RIGHT";
    this.currentSpeed=1000;
    this.poisonImageUrl="http://pm1.narvii.com/6508/2cab51768eafc444e372b827797b2e00cb9d8ab2_hq.jpg";
    this.mushroomImageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Novosel_mushroom.svg/64px-Novosel_mushroom.svg.png";
    this.marioImageUrl="http://icons.iconarchive.com/icons/ph03nyx/super-mario/64/Paper-Mario-icon.png";
    this.score=0;
    this.intervalTimer=null;
    this.init();

    // get elements and bind listeners
    this.speedBtn= document.getElementById("speed");
    this.pauseBtn= document.getElementById("pause");
    this.resumeBtn= document.getElementById("resume");
    this.scoreDiv= document.getElementById("score");
    this.scoreDiv.innerText=this.score;
    this.speedBtn.addEventListener('click',()=>{
      this.currentSpeed-=100;
      this.startGame(this.currentDir);
    });

    this.pauseBtn.addEventListener('click',()=>{
      if(this.intervalTimer)
        clearInterval(this.intervalTimer);
    });

    this.resumeBtn.addEventListener('click',()=>{
      this.startGame(this.currentDir);
    });
  }

  init() {
    const boardRect = this.mountNode.getBoundingClientRect()

    this.noOfCols = Math.floor(boardRect.width / this.cellSize)
    this.noOfRows = Math.floor(boardRect.height / this.cellSize)
  }

  /**
   * Will create the table
   */
  create() {
    const grid = this.getGrid()
    this.mountNode.innerHTML = grid

    this.board = Array(this.noOfRows).fill(0)
    Array(this.noOfRows).fill(0).forEach((_, i) => {
      this.board[i] = Array(this.noOfCols).fill(0)
    })

    this.setObjectsOnBoard(this.marioCellIndex);
    document.addEventListener('keydown', this.startGame.bind(this));
  }

  startGame(e){
    switch (e.keyCode) {
      case 37:
        this.currentDir="LEFT";
        break;
      case 38:
      this.currentDir="UP";
        break;
      case 39:
      this.currentDir="RIGHT";
        break;
      case 40:
      this.currentDir="DOWN";
        break;  
      default:
        break;
    }
    // start timer
    if(this.intervalTimer)
    {
      clearInterval(this.intervalTimer);
    }
    this.intervalTimer=setInterval(()=>{
      this.generateNextMove();
    },this.currentSpeed);
  }

  // places object on board with random values
  setObjectsOnBoard(marioCellIndex){
    let el=document.getElementById(marioCellIndex);
    this.setBackgroundImage(el,this.marioImageUrl);
    let p=Math.floor((Math.random() * (this.noOfCols-1)) + 2);
    let m=Math.floor((Math.random() * (this.noOfRows-1)) + 2);
    this.mushroomPlaces={};
    this.poisonPlaces={};
    for(let i=0;i<this.noOfCols;i++){
      for(let j=0;j<this.noOfRows;j++){
        let el=document.getElementById(i+'_'+j);
        if(el && el.style.backgroundImage=="" && i+j== p){
          this.poisonPlaces[''+i+'_'+j]=true;
          this.setBackgroundImage(el,this.poisonImageUrl);

        }
        if(el && el.style.backgroundImage=="" && i+j==m){
          this.mushroomPlaces[''+i+'_'+j]=true;
          this.setBackgroundImage(el,this.mushroomImageUrl);
        }
      }
    }
  }

  setBackgroundImage(el,imageUrl){
    el.style.backgroundImage="url("+imageUrl+')';
    el.style.backgroundSize="30px 30px";
    el.style.backgroundRepeat="no-repeat";
    el.style.backgroundPosition="center center";
  }

  movePlayer(e){
    switch (e) {
			case 'LEFT':
				// left 
				if (this.marioCellIndex.split("_")[1]!==0) {
          let el=document.getElementById(this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1],10)-1)+'');
          let indexId=this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1],10)-1)+'';
          this.markScore(el,indexId);
          document.getElementById(this.marioCellIndex).style.backgroundImage="none";
          this.setBackgroundImage(el,this.marioImageUrl);
        
          this.marioCellIndex=this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1]-1,10))+'';
				}
				break;
			case 'UP':
				// up
				if (this.marioCellIndex.split("_")[0]!==0) {
          let el=document.getElementById(parseInt(this.marioCellIndex.split("_")[0],10)-1+'_'+this.marioCellIndex.split("_")[1]);
          let indexId=parseInt(this.marioCellIndex.split("_")[0],10)-1+'_'+this.marioCellIndex.split("_")[1];
          this.markScore(el,indexId);
          document.getElementById(this.marioCellIndex).style.backgroundImage="none";
          this.setBackgroundImage(el,this.marioImageUrl);

          this.marioCellIndex=this.marioCellIndex.split("_")[0]-1+'_'+this.marioCellIndex.split("_")[1];
				}
				break;
			case 'RIGHT':
				// right 
				if (this.marioCellIndex.split("_")[1]!==this.noOfCols-1) {
          let el=document.getElementById(this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1],10)+1)+'');
          let indexId=this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1],10)+1)+'';
          this.markScore(el,indexId);
          document.getElementById(this.marioCellIndex).style.backgroundImage="none";
          this.setBackgroundImage(el,this.marioImageUrl);

          this.marioCellIndex=this.marioCellIndex.split("_")[0]+'_'+(parseInt(this.marioCellIndex.split("_")[1],10)+1)+'';
				}
				break;
			case 'DOWN':
				// down 
				if (this.marioCellIndex.split("_")[0]!==this.noOfRows-1) {
          let el=document.getElementById(parseInt(this.marioCellIndex.split("_")[0],10)+1+'_'+this.marioCellIndex.split("_")[1]);
          let indexId=parseInt(this.marioCellIndex.split("_")[0],10)+1+'_'+this.marioCellIndex.split("_")[1];
          this.markScore(el,indexId);
          document.getElementById(this.marioCellIndex).style.backgroundImage="none";
          this.setBackgroundImage(el,this.marioImageUrl);

          this.marioCellIndex=parseInt(this.marioCellIndex.split("_")[0],10)+1+'_'+this.marioCellIndex.split("_")[1];
				}
				break;
			default:
				break;
		}
  }

  markScore(el,toIndex){
    let str=(el.style.backgroundImage).substr(5,(el.style.backgroundImage).length-7);
    if(str == this.mushroomImageUrl) {
      delete this.mushroomPlaces[toIndex];
      this.score++;
      this.currentSpeed-=100;
      this.scoreDiv.innerText=this.score;
      this.setObjectsOnBoard(this.marioCellIndex);
    }else if(str ==  this.poisonImageUrl){
      delete this.poisonPlaces[toIndex];
      alert("Game Over!! You have eaten poison and your score is "+ this.score);
      window.location.reload();
    }
    
  }

  generateNextMove(){
    let move='';
    switch (this.currentDir) {
      case 'RIGHT':
        if(this.marioCellIndex.split("_")[1] < this.noOfCols-1){
          move= 'RIGHT';
        }else{
          move='LEFT';
          this.currentDir='LEFT';
        }
        break;
      case 'LEFT':
        if(this.marioCellIndex.split("_")[1] > 0){
          move= 'LEFT';
        }else{
            move='RIGHT';
            this.currentDir='RIGHT';
          }
        break;
      case 'UP':
        if(this.marioCellIndex.split("_")[0] > 0){
          move= 'UP';
        }
        else{
          move='DOWN';
          this.currentDir='DOWN';
        }
        break;
      case 'DOWN':
        if(this.marioCellIndex.split("_")[0] < this.noOfRows-1){
          move= 'DOWN';
        }
        else{
          move='UP';
          this.currentDir='UP';
        }
        break;
      default:
        break;
    }
    if(move!=='')
      this.movePlayer(move);
  }

  /**
   * @private
   */
  getGrid() {
    return `
    <table>
      <tbody>
        ${Array(this.noOfRows).fill(0).map((_, i) => {
      return `
            <tr style="height: ${this.cellSize}px">
              ${Array(this.noOfCols).fill(0).map((_, j) => {
        return `<td id="${getCellName(i, j)}" class="cell" style="height: ${this.cellSize}px; width: ${this.cellSize}px"></td>`
      }).join('')}
            </tr>
          `
    }).join('')}
      </tbody>
    </table>
  `
  }

  getBoardWidth() {
    return this.board[0].length - 1
  }

  getBoardHeight() {
    return this.board.length - 1
  }
}