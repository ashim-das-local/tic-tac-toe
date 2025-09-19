var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var gameAssets = {
    cross: new Image(),
    circle: new Image()
};
// Initiate Image Sources
gameAssets.cross.src = 'cross.png';
gameAssets.circle.src = 'circle.png';
var winningCombos = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];
var isCross = true;
var boxArea = [];
var initiate = function () {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.rect(5, 5, canvas.width - 10, canvas.height - 10);
        ctx.strokeStyle = 'slate';
        ctx.stroke();
        var boxWidth = (canvas.width - 15) / 3.25;
        var boxHeight = (canvas.height - 15) / 3.25;
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(boxWidth, 5, boxWidth * 0.125, canvas.height - 10);
        ctx.fillRect(2.125 * boxWidth, 5, boxWidth * 0.125, canvas.height - 10);
        ctx.fillRect(5, boxHeight, canvas.width - 10, boxHeight * 0.125);
        ctx.fillRect(5, 2.125 * boxHeight, canvas.width - 10, boxHeight * 0.125);
        var loc = 1;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
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
};
if (ctx) {
    initiate();
    console.log('Canvas initialized');
}
else {
    console.error('2D context not supported');
}
gameAssets.cross.onload = function () {
    gameAssets.circle.onload = function () {
        // Both images are loaded, you can start drawing or animating
        canvas.addEventListener('click', function (event) {
            console.log("Clicked at: ".concat(event.clientX, ", ").concat(event.clientY));
            var clientLoc = {
                x: event.clientX,
                y: event.clientY
            };
            if (ctx) {
                for (var _i = 0, boxArea_1 = boxArea; _i < boxArea_1.length; _i++) {
                    var box = boxArea_1[_i];
                    if (clientLoc.x >= box.x && clientLoc.x <= box.x + box.width &&
                        clientLoc.y >= box.y && clientLoc.y <= box.y + box.height) {
                        if (box.boxState === '-') {
                            box.boxState = isCross ? 'X' : 'O';
                            ctx.drawImage(isCross ? gameAssets.cross : gameAssets.circle, box.x + (box.width - 80) / 2, box.y + (box.height - 80) / 2, 80, 80);
                            isCross = !isCross;
                            console.log("Box ".concat(box.loc, " marked as ").concat(box.boxState));
                        }
                        break;
                    }
                }
                // Check for win condition
                for (var _a = 0, winningCombos_1 = winningCombos; _a < winningCombos_1.length; _a++) {
                    var combo = winningCombos_1[_a];
                    var a = combo[0], b = combo[1], c = combo[2];
                    if (boxArea[a - 1].boxState !== '-' &&
                        boxArea[a - 1].boxState === boxArea[b - 1].boxState &&
                        boxArea[a - 1].boxState === boxArea[c - 1].boxState) {
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 5;
                        var startX = boxArea[a - 1].x + boxArea[a - 1].width / 2;
                        var startY = boxArea[a - 1].y + boxArea[a - 1].height / 2;
                        var endX = boxArea[c - 1].x + boxArea[c - 1].width / 2;
                        var endY = boxArea[c - 1].y + boxArea[c - 1].height / 2;
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                        console.log("Player ".concat(boxArea[a - 1].boxState, " wins!"));
                        // Optionally, you can highlight the winning combination or reset the game
                    }
                }
            }
        });
    };
};
