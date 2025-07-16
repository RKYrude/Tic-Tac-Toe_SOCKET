

function main(){
    
    document.querySelectorAll(".butt_start")[0].addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    
    document.querySelectorAll(".butt_start")[0].addEventListener("click", startGameClick);
    
    for(let i=0; i<9; i++){
        document.querySelectorAll(".box")[i].addEventListener("click", ()=>{
            boxClick(i);
        });
    }

    document.querySelectorAll(".restart")[0].addEventListener("click", gameRestart);

    document.querySelectorAll(".back")[0].addEventListener("click", menuButton);
   
}
main();


//THIS IS DONE
function startGameClick(){
    let audio = new Audio('./Assets/sounds/clear-mouse-clicks.wav');
    audio.playbackRate = 1.9;
    audio.play();
    setTimeout(()=> {  //game starts after full sound is played
        document.querySelectorAll(".lobby_container")[0].style.cssText = "display: none";
        document.querySelectorAll(".game")[0].style.cssText = "display: block";
    },180);
}


var playerTurn = 1;
var grid_match = ["-","-","-","-","-","-","-","-","-"];
var pressed = null;
var p1_win_count = null;
var p2_win_count = null;

function boxClick(i){
    
    if(document.querySelectorAll(".box")[i].style.marginTop !== '9px'){ //if btn is NOT pressed. 9px means pressed
        let audio = new Audio('./Assets/sounds/clear-mouse-clicks.wav');
        audio.playbackRate = 1.9;
        audio.play();        

        if(playerTurn == 1){ //checks player turn     GREEN - RED
            playerTurn++;
            document.querySelectorAll("span")[0].innerText = playerTurn;
            document.querySelector("h1 img").setAttribute("src", "./Assets/RED_INSET_CROSS.svg");
            document.querySelector("h1 span").style.cssText = "color: #FF625C;"; //RED
            document.querySelectorAll(".box")[i].setAttribute("src", "./Assets/GREEN_CIRCLE.svg");
            document.querySelectorAll(".box")[i].style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;"; //GREEN SHADOW
            grid_match[i] = "O";
            winTest();
        }
        else{
            playerTurn--;
            document.querySelectorAll("span")[0].innerText = playerTurn;
            document.querySelector("h1 img").setAttribute("src", "./Assets/GREEN_INSET_CIRCLE.svg");
            document.querySelector("h1 span").style.cssText = "color: #12CDC0;"; //GREEN
            document.querySelectorAll(".box")[i].setAttribute("src", "./Assets/RED_CROSS.svg");
            document.querySelectorAll(".box")[i].style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;"; //RED SHADOW
            grid_match[i] = "X";
            winTest();
        }        
    }
}

function gameRestart(){
    let audio = new Audio('./Assets/sounds/restart-sound2.wav');
    audio.volume = 0.5;
    audio.play();

    playerTurn = 1;
    document.querySelector(".game h1").innerHTML = 'Player <span>1</span> Turn <img draggable="false" src="./Assets/WIN_CROWN.svg" alt="">';
    document.querySelectorAll("span")[0].innerText = playerTurn;
    document.querySelector("h1 img").setAttribute("src", "./Assets/GREEN_INSET_CIRCLE.svg");
    document.querySelector("h1 span").style.cssText = "color: #12CDC0;"; //GREEN
    
    for(let i=0; i<9; i++){
        document.querySelectorAll(".box")[i].setAttribute("src", "./Assets/GREY_GRID_BLOCK.svg"); //GREY BLOCK
        document.querySelectorAll(".box")[i].style.cssText = "margin-top: 0px; box-shadow: 0px 19px 0px 0px #4B5C6E;"; //GREY shadow
    }

    grid_match = ["-","-","-","-","-","-","-","-","-"];
}


function countReset(){
    p1_win_count = 0;
    p2_win_count = 0;
    document.querySelectorAll(".win_counter span")[0].innerText = p1_win_count;
    document.querySelectorAll(".win_counter span")[1].innerText = p2_win_count;
}



function menuButton(){
    gameRestart();
    let audio = new Audio('./Assets/sounds/clear-mouse-clicks.wav');
    audio.playbackRate = 1.9;
    audio.play();
    document.querySelectorAll(".lobby_container")[0].style.cssText = "display: block";
    document.querySelectorAll(".game")[0].style.cssText = "display: none";
}



function winTest() {
    let winningCondition = '';
    let winner = '';

    // Check Player 1 (O) win conditions
    if ((grid_match[0] === "O" && grid_match[1] === "O" && grid_match[2] === "O")) {
        winningCondition = 'top row';
        winner = '1';
    } else if ((grid_match[3] === "O" && grid_match[4] === "O" && grid_match[5] === "O")) {
        winningCondition = 'middle row';
        winner = '1';
    } else if ((grid_match[6] === "O" && grid_match[7] === "O" && grid_match[8] === "O")) {
        winningCondition = 'bottom row';
        winner = '1';
    } else if ((grid_match[0] === "O" && grid_match[3] === "O" && grid_match[6] === "O")) {
        winningCondition = 'left column';
        winner = '1';
    } else if ((grid_match[1] === "O" && grid_match[4] === "O" && grid_match[7] === "O")) {
        winningCondition = 'middle column';
        winner = '1';
    } else if ((grid_match[2] === "O" && grid_match[5] === "O" && grid_match[8] === "O")) {
        winningCondition = 'right column';
        winner = '1';
    } else if ((grid_match[0] === "O" && grid_match[4] === "O" && grid_match[8] === "O")) {
        winningCondition = 'left-to-right diagonal';
        winner = '1';
    } else if ((grid_match[2] === "O" && grid_match[4] === "O" && grid_match[6] === "O")) {
        winningCondition = 'right-to-left diagonal';
        winner = '1';
    }

    // Check Player 2 (X) win conditions
    if (winningCondition === '') {  // Only check for Player 2
        if ((grid_match[0] === "X" && grid_match[1] === "X" && grid_match[2] === "X")) {
            winningCondition = 'top row';
            winner = '2';
        } else if ((grid_match[3] === "X" && grid_match[4] === "X" && grid_match[5] === "X")) {
            winningCondition = 'middle row';
            winner = '2';
        } else if ((grid_match[6] === "X" && grid_match[7] === "X" && grid_match[8] === "X")) {
            winningCondition = 'bottom row';
            winner = '2';
        } else if ((grid_match[0] === "X" && grid_match[3] === "X" && grid_match[6] === "X")) {
            winningCondition = 'left column';
            winner = '2';
        } else if ((grid_match[1] === "X" && grid_match[4] === "X" && grid_match[7] === "X")) {
            winningCondition = 'middle column';
            winner = '2';
        } else if ((grid_match[2] === "X" && grid_match[5] === "X" && grid_match[8] === "X")) {
            winningCondition = 'right column';
            winner = '2';
        } else if ((grid_match[0] === "X" && grid_match[4] === "X" && grid_match[8] === "X")) {
            winningCondition = 'left-to-right diagonal';
            winner = '2';
        } else if ((grid_match[2] === "X" && grid_match[4] === "X" && grid_match[6] === "X")) {
            winningCondition = 'right-to-left diagonal';
            winner = '2';
        }
    }

    if (winningCondition !== '') {
        let audio = new Audio('./Assets/sounds/winning-sound.wav');
        audio.volume = 0.5;
        audio.play();

        

        document.querySelector(".game h1").innerHTML = `Player <span>${winner}</span> WON <img draggable="false" src="./Assets/WIN_CROWN.svg" alt="">`;
        
        if (winner === '1') {
            p1_win_count++;
            document.querySelectorAll(".win_counter span")[0].innerText = p1_win_count;

            for (let j = 0; j < 9; j++) {
                let box = document.querySelectorAll(".box")[j];

                box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #4B5C6E;"; //grey
                if (grid_match[j] === "X"){
                    box.setAttribute("src", "./Assets/GREY_CROSS.svg");
                } 
                else if (grid_match[j] === "O"){
                    box.setAttribute("src", "./Assets/GREY_CIRCLE.svg");
                }
            }
                
            if(winningCondition === 'top row'){
                for(let k=0; k<=2; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'middle row'){
                for(let k=3; k<=5; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'bottom row'){
                for(let k=6; k<=8; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'left column'){
                for(let k=0; k<=6; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'middle column'){
                for(let k=1; k<=7; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'right column'){
                for(let k=2; k<=8; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'left-to-right diagonal'){
                for(let k=0; k<=8; k+=4){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }
            else if(winningCondition === 'right-to-left diagonal'){
                for(let k=2; k<=6; k+=2){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/GREEN_CIRCLE.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #009EA2;";
                } 
            }   
        } 
        
        //Plaayer 2 condition
        else if (winner === '2') {

            p2_win_count++;
            document.querySelectorAll(".win_counter span")[1].innerText = p2_win_count;

            document.querySelector("h1 span").style.cssText = "color: #FF625C";
            
            for (let j = 0; j < 9; j++) {
                let box = document.querySelectorAll(".box")[j];

                box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #4B5C6E;"; //grey
                if (grid_match[j] === "X"){
                    box.setAttribute("src", "./Assets/GREY_CROSS.svg");
                } 
                else if (grid_match[j] === "O"){
                    box.setAttribute("src", "./Assets/GREY_CIRCLE.svg");
                }
            }

            if(winningCondition === 'top row'){
                for(let k=0; k<=2; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'middle row'){
                for(let k=3; k<=5; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'bottom row'){
                for(let k=6; k<=8; k++){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'left column'){
                for(let k=0; k<=6; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'middle column'){
                for(let k=1; k<=7; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'right column'){
                for(let k=2; k<=8; k+=3){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'left-to-right diagonal'){
                for(let k=0; k<=8; k+=4){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
            else if(winningCondition === 'right-to-left diagonal'){
                for(let k=2; k<=6; k+=2){
                    box = document.querySelectorAll(".box")[k];
                    box.src = "./Assets/RED_CROSS.svg";
                    box.style.cssText = "margin-top: 9px; box-shadow: 0px 10px 0px 0px #E63F45;";
                } 
            }
        }
    } 

    else if (!grid_match.includes("-")) {
        let audio = new Audio('./Assets/sounds/draw-sound.wav');
        audio.volume = 0.5;
        audio.play();
       
        document.querySelector(".game h1").innerHTML = ' <span>DRAW</span> <img  draggable="false" src="./Assets/DRAW.svg" alt="">';
        document.querySelector("span").style.color = "black";
    }
}