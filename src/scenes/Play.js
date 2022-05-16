class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.atlas("character",'player.png','player.json');
        this.load.image('slime', 'slime.png');        
    }

    create() {
        this.VELOCITY = 500;
        this.DRAG = 800;
        this.cameras.main.setBackgroundColor('#666');
        //animations
        //idle
        //hi
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('character', {
                prefix: 'idle_stand_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'run_right',
            frames: this.anims.generateFrameNames('character', {
                prefix: 'idle_runright_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'run_left',
            frames: this.anims.generateFrameNames('character', {
                prefix: 'idle_runleft_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'atk_right',
            frames: this.anims.generateFrameNames('character', {
                prefix: 'idle_atkright_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'atk_left',
            frames: this.anims.generateFrameNames('character', {
                prefix: 'idle_atkleft_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.ground = this.add.group();
        this.groundSprite = this.physics.add.sprite(0, game.config.height, 'ground').setScale(2);
        this.groundSprite.body.immovable = true;
        this.groundSprite.body.allowGravity = false;
        this.ground.add(this.groundSprite);

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'character', 'idle_stand_0001').setScale(1.5);

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.ground);

        this.physics.world.wrap(this.player, 0);
    }

    update() {
        if (cursors.left.isDown) {
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.anims.play('run_left', true);
        } else if (cursors.right.isDown) {
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.anims.play('run_right', true);
        } else if (!cursors.right.isDown && !cursors.left.isDown) {
            this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);       
        }
    }
}