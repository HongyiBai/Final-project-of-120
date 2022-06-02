class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }
    
    preload() {
        this.load.path = 'assets/';
        this.load.image('ground', 'ground.png');
        this.load.audio('arena_1', 'Arena_1.mp3');
        this.load.audio('atk_sfx', 'attackSFX.wav');
        this.load.image('background', 'Mainmenufinal.png');
    }
    
    create() {
        let controlConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '25px',
            color: '#1F4659',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let startConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '30px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //menu background
        this.background = this.add.tileSprite(0, 0, 680, 480, 'background').setOrigin(0, 0);

        // start button
        let start = this.add.text(game.config.width - 80 , game.config.height/2 - 20, 'Start', startConfig).setOrigin(0.5);
        start.setInteractive();
        start.on('pointerover', () => {
            start.setScale(1.2);
        })
        start.on('pointerout', () => {
            start.setScale(1);
        }) 
        start.on('pointerdown', () => {
            this.scene.start("playScene");
        })

        //controls text
        let control = this.add.text(200, 233, 'Controls', controlConfig).setOrigin(0.5);
        controlConfig.fontSize = '15px';
        this.add.text(200, 290, '← to move left\n→ to move right\nSpace to Jump\n(2x to double jump)\n↓ to attack', controlConfig).setOrigin(0.5);

        //loop background music
        var music = this.sound.add('arena_1');
        music.setLoop(true);
        music.play();
    }
}

class GameMenu extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    
    preload() {
        this.load.path = 'assets/';
        this.load.image('gameover', 'endingscenefinal.png');
    }

    init (data) {
        this.finalscore = data.score;
    }
    
    create() {
        let endConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '60px',
            color: 'red',
            align: 'center',
        }
        // game over background
        this.background = this.add.tileSprite(0, 0, 680, 480, 'gameover').setOrigin(0, 0);

        //game over text
        this.add.text(game.config.width/2, game.config.height/2 - 160, 'GAME OVER', endConfig).setOrigin(0.5);

        //score
        endConfig.fontSize = "30px";
        this.add.text(game.config.width/2, game.config.height/2 - 115, 'Score: ' + this.finalscore, endConfig).setOrigin(0.5);

        //restart button
        let restart = this.add.text(game.config.width - 115, game.config.height/2 + 65, 'RESTART', endConfig).setOrigin(0.5);
        restart.setInteractive();
        restart.on('pointerover', () => {
            restart.setScale(1.2);
        })
        restart.on('pointerout', () => {
            restart.setScale(1);
        }) 
        restart.on('pointerdown', () => {
            this.scene.start("playScene");           
        })

        //return to main menu button
        let main = this.add.text(game.config.width - 115, game.config.height/2 + 105, 'MAIN MENU', endConfig).setOrigin(0.5);
        main.setInteractive();
        main.on('pointerover', () => {
            main.setScale(1.2);
        })
        main.on('pointerout', () => {
            main.setScale(1);
        }) 
        main.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start("mainScene");
        })
    }
}
