const canvas: HTMLCanvasElement =
    document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const gameAssets = {
    cross: new Image(),
    circle: new Image()
}
// Initiate Image Sources
gameAssets.cross.src = 'cross.png';
gameAssets.circle.src = 'circle.png';

type BoxState = '-' | 'X' | 'O';
const winningCombos: Array<Array<number>> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]];
var isCross = true;
var boxArea: Array<{ loc: number, x: number, y: number, width: number, height: number, boxState: BoxState }> = [];

const initiate = () => {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.rect(5, 5, canvas.width - 10, canvas.height - 10);
        ctx.strokeStyle = 'slate';
        ctx.stroke();

        const boxWidth = (canvas.width - 15) / 3.25;
        const boxHeight = (canvas.height - 15) / 3.25;

        ctx.fillStyle = 'skyblue';
        ctx.fillRect(boxWidth, 5, boxWidth * 0.125, canvas.height - 10);
        ctx.fillRect(2.125 * boxWidth, 5, boxWidth * 0.125, canvas.height - 10);

        ctx.fillRect(5, boxHeight, canvas.width - 10, boxHeight * 0.125);
        ctx.fillRect(5, 2.125 * boxHeight, canvas.width - 10, boxHeight * 0.125);

        var loc = 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boxArea.push({
                    loc: loc++,
                    x: 5 + j * (boxWidth + boxWidth * 0.125),
                    y: 5 + i * (boxHeight + boxHeight * 0.125),
                    width: boxWidth,
                    height: boxHeight,
                    boxState: '-'
                });
                console.log(boxArea[boxArea.length - 1]);
            }
        }
    }
}


if (ctx) {
    initiate();
    console.log('Canvas initialized');
} else {
    console.error('2D context not supported');
}

gameAssets.cross.onload = () => {
    gameAssets.circle.onload = () => {
        // Both images are loaded, you can start drawing or animating
        canvas.addEventListener('click', (event: MouseEvent) => {
            console.log(`Clicked at: ${event.clientX}, ${event.clientY}`);
            const clientLoc = {
                x: event.clientX,
                y: event.clientY
            }
            if (ctx) {
                for (let box of boxArea) {
                    if (clientLoc.x >= box.x && clientLoc.x <= box.x + box.width &&
                        clientLoc.y >= box.y && clientLoc.y <= box.y + box.height) {
                        if (box.boxState === '-') {
                            box.boxState = isCross ? 'X' : 'O';
                            ctx.drawImage(isCross ? gameAssets.cross : gameAssets.circle, box.x + (box.width - 80) / 2, box.y + (box.height - 80) / 2, 80, 80);
                            isCross = !isCross;
                            console.log(`Box ${box.loc} marked as ${box.boxState}`);
                        }
                        break;
                    }
                }
                // Check for win condition
                for (let combo of winningCombos) {
                    const [a, b, c] = combo;
                    if (boxArea[a - 1].boxState !== '-' &&
                        boxArea[a - 1].boxState === boxArea[b - 1].boxState &&
                        boxArea[a - 1].boxState === boxArea[c - 1].boxState) {
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 5;
                        const startX = boxArea[a - 1].x + boxArea[a - 1].width / 2;
                        const startY = boxArea[a - 1].y + boxArea[a - 1].height / 2;
                        const endX = boxArea[c - 1].x + boxArea[c - 1].width / 2;
                        const endY = boxArea[c - 1].y + boxArea[c - 1].height / 2;
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                        console.log(`Player ${boxArea[a - 1].boxState} wins!`);  
                        // Optionally, you can highlight the winning combination or reset the game
                    }
                }                
            }
        })
    }
}