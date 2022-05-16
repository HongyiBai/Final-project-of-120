let game;
 
// global game options
// let gameOptions = {
//     platformStartSpeed: 350,
//     batSpawnRangeY:[300,740],
//     spawnRange: [100, 350],
//     platformSizeRange: [100, 250],
//     playerGravity: 900,
//     jumpForce: 500,
//     playerStartPosition: 300,
//     jumps: 2
// }
 
window.onload = function() {
 
    // object containing configuration options
    let gameConfig = {
        type: Phaser.AUTO,
        width: 680,
        height: 480,
        scene: [MainMenu, Play, GameMenu],
        backgroundColor: 0x444444,
 
        // physics settings
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
                // gravity: {
                //     y: 500
                // }
            }
        }
    }
    game = new Phaser.Game(gameConfig);
}

var cursors;
let keyUP;
