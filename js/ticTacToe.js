document.addEventListener("DOMContentLoaded", function() {
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.addEventListener("mousemove", showShape, false);
    gameBoard.addEventListener("mousedown", drawShape, false);
    const context = gameBoard.getContext('2d');
    const rect = gameBoard.getBoundingClientRect();
    let canvasWidth = context.canvas.width;
    const tttSize = 3;
    const round = 'round';
    const cross = 'cross';
    let state = true;
    let boxInit = false;
    let centerList = [];
    let winner = false;
    let moves;
    init();

    const cellSize = {side: canvasWidth/tttSize, padding: canvasWidth/10};
    const shapeSize = Math.sqrt(2 * (cellSize.side - (2 * cellSize.padding)) * (cellSize.side - (2 * cellSize.padding)));

    const resetBtn = document.getElementById('restartBtn');
    resetBtn.addEventListener('mousedown', init, false);

    function getBox(event) {
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let shortestDis = Number.MAX_SAFE_INTEGER;
        let centerPoint = {};
        let boxNumber = {};
        for(let i = 0; i < tttSize; i++) {
            let centerRow = centerList[i];
            for(let j = 0; j < tttSize; j++){
                let center = centerRow[j];
                let distance = Math.sqrt((center.x - x)* (center.x - x) + (center.y - y)* (center.y - y))
                if(distance < shortestDis){
                    shortestDis = distance;
                    centerPoint = center;
                    boxNumber = {row : i, col : j};
                }
            }
        }

        return {center : centerPoint, number : boxNumber};
    }

    function init(event){
        gameBoard.width = gameBoard.width;
        for (let i = canvasWidth/tttSize; i < canvasWidth; i += canvasWidth/tttSize) {
            drawLine({x: 0, y: i}, {x: canvasWidth, y: i}, '#000000');
            drawLine({x: i, y: 0}, {x: i, y: canvasWidth}, '#000000');
        }
        state = true;
        winner = false;
        moves = 0;
        if(boxInit){
            for(let i = 0; i < tttSize; i++) {
                let centerRow = centerList[i];
                for(let j = 0; j < tttSize; j++){
                    centerRow[j].isEmpty = true;
                    delete centerRow[j].shape;
                }
            }
        }
        else{
            initBoxCenter();
        }
        event && event.preventDefault();
    }

    function initBoxCenter(){
        for(let i = 0; i < tttSize; i++) {
            let centerRow = [];
            for(let j = 0; j < tttSize; j++){
                let a = {};
                a.x = (((canvasWidth/tttSize) *j) + ((canvasWidth/tttSize) * (j+1)))/2;
                a.y = (((canvasWidth/tttSize) *i) + ((canvasWidth/tttSize) * (i+1)))/2;
                a.isEmpty = true;
                centerRow.push(a);
            }
            centerList.push(centerRow);
        }
        boxInit = true;
    }

    function checkWin(boxNumber){
        let shape = state? round: cross;
        let pointsArr = [];
        for(let i = 0; i < tttSize; i++){
            if(centerList[boxNumber.row][i].shape !== shape){
                pointsArr = [];
                break;
            }
            pointsArr.push(centerList[boxNumber.row][i]);
            if(i === tttSize-1){
                drawLine(pointsArr[0], pointsArr[tttSize-1]);
                winner = shape;
                return;
            }
        }

        for(let i = 0; i < tttSize; i++){
            if(centerList[i][boxNumber.col].shape !== shape){
                pointsArr = [];
                break;
            }
            pointsArr.push(centerList[i][boxNumber.col]);
            if(i === tttSize-1){
                drawLine(pointsArr[0], pointsArr[tttSize-1]);
                winner = shape;
                return;
            }
        }

        if(boxNumber.row === boxNumber.col){
            for(let i = 0; i < tttSize; i++){
                if(centerList[i][i].shape !== shape){
                    pointsArr = [];
                    break;
                }
                pointsArr.push(centerList[i][i]);
                if(i === tttSize-1){
                    winner = shape;
                    drawLine(pointsArr[0], pointsArr[tttSize-1]);
                    return;
                }
            }
        }

        if((boxNumber.row + boxNumber.col) === (tttSize - 1)){
            for(let i = 0; i < tttSize; i++){
                if(centerList[i][tttSize-i-1].shape !== shape){
                    pointsArr = [];
                    break;
                }
                pointsArr.push(centerList[i][tttSize-i-1]);
                if(i == tttSize-1){
                    winner = shape;
                    drawLine(pointsArr[0], pointsArr[tttSize-1]);
                    return;
                }
            }
        }

        if(moves == (Math.pow(tttSize, 2))){
            winner = 'draw';
            return;
        }
    }

    function drawLine(endA, endB, color){
        
        context.moveTo(endA.x, endA.y);
        context.lineTo(endB.x, endB.y);
        context.strokeStyle = color;
        context.stroke();
    }

    function showShape(event){
        //TODO
    }

    function drawShape(event){
        let box = getBox(event);
        let point = box.center;
        if(point.isEmpty && !winner){
            if(state){
                drawRound(point.x, point.y);
                point.shape = round;
            }
            else{
                drawCross(point.x , point.y);
                point.shape = cross;
            }
            point.isEmpty = false;
            moves++;
            checkWin(box.number);
            if(winner){
                if(winner !== 'draw'){
                    console.log(winner + ' has won!');
                }
                else{
                    console.log("Match draw!");
                }
            }
            else{
                switchState();
            }
        }
        else{
            if(!winner){
                console.log('Box is not empty');
            }
            else{
                console.log('Game Over!');
            }
        }
        event.preventDefault();
    }

    function drawCross(x, y){
        drawLine({x : (x - shapeSize/2), y: (y - shapeSize/2)}, {x : (x + shapeSize/2), y: (y + shapeSize/2)}, "#FF0000")
        drawLine({x : (x + shapeSize/2), y: (y - shapeSize/2)}, {x : (x - shapeSize/2), y: (y + shapeSize/2)}, "#FF0000");
    }

    function drawRound(x, y){
        context.beginPath();
        context.arc(x, y, shapeSize/2, 0, 2 * Math.PI);
        context.strokeStyle = "#FF0000";
        context.stroke();
    }

    function switchState(){
        state ? (state = false) : (state = true);
    }
});