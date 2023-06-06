const displayController=(()=>{
    const renderMessage=(message)=>{
        document.querySelector("#message").innerHTML = message;
    }
    return{
        renderMessage
    }
})();

const gameBoardModule=(()=>{
    let gameboard=["","","","","","","","",""];

    //display board
    const render=()=>{
        let boardHTML="";
        gameboard.forEach((square,index)=>{
            boardHTML+=`<div class="square" id=square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML =  boardHTML;
        
    }
    //update gameboard array
    const update=(index,value)=>{
        gameboard[index]=  value;
    }

    const getGameBoard=()=>gameboard;

    return{
        render,
        update,
        getGameBoard
    }
})();

//Player factory function
const Player=(name,mark)=>{
    return{
        name,mark
    }
}

const gameControllerModule=(()=>{
    let players=[];
    let currentPlayerIndex;
    let gameOver;
    
    const start=()=>{
        players=[
            Player(document.querySelector('#player1').value,'X'),
            Player(document.querySelector('#player2').value,'O'),
        ]

        currentPlayerIndex=0;
        gameOver=false;
        gameBoardModule.render();
        const squares=document.querySelectorAll(".square");
        squares.forEach((square)=>{
            square.addEventListener("click",handleClick);

        })
    }
    const handleClick=(event)=>{
        if(gameOver)
            return;

        let index=parseInt(event.target.id.split("-")[1]);
        if(gameBoardModule.getGameBoard()[index]==""){
            event.target.textContent = players[currentPlayerIndex].mark;
            gameBoardModule.update(index,players[currentPlayerIndex].mark)
            currentPlayerIndex=currentPlayerIndex===0?1:0;

            if(checkForWin(gameBoardModule.getGameBoard(),players[currentPlayerIndex].mark)){
                gameOver=true;
                displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
            }else if(checkForTie(gameBoardModule.getGameBoard())){
                gameOver=true;
                displayController.renderMessage(`It is a tie`);
            }
        }
    }
    const restart=()=>{
        gameBoardModule.getGameBoard().fill("");
        gameBoardModule.render()
    }
    return{
        start,
        handleClick,
        restart
    }
})();


function checkForWin(board){
    const winningCombinations=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for(let i=0;i<winningCombinations.length;i++){
        const [a,b,c] = winningCombinations[i];
        if(board[a] && board[a]===board[b]&&board[a]===board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie(board){
    return board.every(cell=>cell!=="");
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener("click",()=>{
   gameControllerModule.restart();

})

const startButton = document.querySelector('#start-button')
startButton.addEventListener("click",()=>{
    gameControllerModule.start();
});
