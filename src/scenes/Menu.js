class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }
    
    preload() {
        this.load.path = 'assets/';
        //this.load.audio('bgm', './assets/endless_runner.mp3');
        this.load.audio('arena_1', 'Arena_1.mp3');
        this.load.audio('atk_sfx', 'attackSFX.wav');
        this.load.audio('jump', './assets/Jump.wav');
        //this.load.image('menubackground', './assets/menubg.png');
    }
    
    create() {
        let menuConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '100px',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let startConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '50px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        //
        //menu background
        //this.menubackground = this.add.tileSprite(0, 0, 1280, 960, 'menubackground').setOrigin(0, 0);
        // title text
        this.add.text(game.config.width/2, game.config.height/2 - 100, 'Title', menuConfig).setOrigin(0.5);

        // start button
        menuConfig.fontSize = "50px";
        let start = this.add.text(game.config.width/2, game.config.height/2 + 10, 'Start', startConfig).setOrigin(0.5);
        start.setInteractive();
        start.on('pointerover', () => {
            start.setScale(1.3);
        })
        start.on('pointerout', () => {
            start.setScale(1);
        }) 
        start.on('pointerdown', () => {
            this.scene.start("playScene");
            //this.sound.play('sfx_select');
        })

        //controls text
        let control = this.add.text(game.config.width/2, game.config.height/2 + 100, 'Controls', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '20px';
        //this.add.text(game.config.width/2, game.config.height/2 + 320, '↑ to Jump(press twice to double jump)', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 140, '← to move left', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 165, '→ to move right', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 190, 'A to attack left', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 215, 'D to attack right', menuConfig).setOrigin(0.5);

        //loop background music
        // var music = this.sound.add('bgm');
        // music.setLoop(true);
        // music.play();
    }
}

class GameMenu extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    
    preload() {
        //this.load.audio('sfx_select', './assets/blip_select12.wav');
        //this.load.image('endbackground', './assets/endingbg.png');
    }

    // init (data) {
    //     this.finalscore = data.score;
    // }
    
    create() {
        let endConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '100px',
            color: 'red',
            align: 'center',
        }
        // game over background
        //this.endingbackground = this.add.tileSprite(0, 0, 1280, 960, 'endbackground').setOrigin(0, 0);
        //game over text
        this.add.text(game.config.width/2, game.config.height/2 - 200, 'GAME OVER', endConfig).setOrigin(0.5);

        //restart button
        endConfig.fontSize = "60px";
        this.add.text(game.config.width/2, game.config.height/2 - 100, 'Score: ' + this.finalscore, endConfig).setOrigin(0.5);
        let restart = this.add.text(game.config.width/2, game.config.height/2 + 50, 'RESTART', endConfig).setOrigin(0.5);
        restart.setInteractive();
        restart.on('pointerover', () => {
            restart.setScale(1.3);
        })
        restart.on('pointerout', () => {
            restart.setScale(1);
        }) 
        restart.on('pointerdown', () => {
            
            this.scene.start("playScene");
            //this.sound.play('sfx_select');
            
        })
        //return to main menu button
        let main = this.add.text(game.config.width/2, game.config.height/2 + 150, 'MAIN MENU', endConfig).setOrigin(0.5);
        main.setInteractive();
        main.on('pointerover', () => {
            main.setScale(1.3);
        })
        main.on('pointerout', () => {
            main.setScale(1);
        }) 
        main.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start("mainScene");
            //this.sound.play('sfx_select');
        })
    }
}
