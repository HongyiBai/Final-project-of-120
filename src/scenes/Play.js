class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.atlas("character",'player.png','player.json');
        this.load.image('slime', 'slime.png');
        this.load.image('bk', 'background for final project(test).png');      
        this.load.image('layer', 'layer.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 680, 480, 'bk').setOrigin(0, 0);
        this.VELOCITY = 500;
        this.direction = 0;     //left = 0 and right = 1
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
            //repeatDelay: 2000
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
            //repeatDelay: 2000
        });

        this.ground = this.add.group();
        this.groundSprite = this.physics.add.sprite(0, game.config.height, 'ground').setScale(2);
        this.groundSprite.body.immovable = true;
        this.groundSprite.body.allowGravity = false;
        this.ground.add(this.groundSprite);

        this.layer = this.add.group();
        this.layerSprite = this.physics.add.sprite(game.config.width, game.config.height, 'layer').setScale(2);
        this.layerSprite.body.immovable = true;
        this.layerSprite.body.allowGravity = false;
        this.layer.add(this.layerSprite);

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height - 59, 'character', 'idle_stand_0001').setScale(1.5);
        this.player.setCollideWorldBounds(true);

        this.swordHitbox = this.add.rectangle(0, 0, this.player.width * 3, this.player.height * 1.5, 0, 0x000000, 0);
        this.physics.add.existing(this.swordHitbox);

        //this.slime = this.physics.add.sprite(game.config.width - 50, game.config.height - 51, 'slime');
        this.slime = new Slime(this, game.config.width - 50, game.config.height - 51, 'slime', 0);
        this.physics.add.existing(this.slime);
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.slime, this.ground);
        this.physics.add.collider(this.player,this.layer);
        this.physics.add.collider(this.slime,this.layer);

        this.physics.world.wrap(this.player, 0);
    }

    update() {
        this.slime.update();

        if (cursors.left.isDown) {
            this.direction = 0;
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.anims.play('run_left', true);
        } else if (cursors.right.isDown) {
            this.direction = 1;
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.anims.play('run_right', true);
        } else if (cursors.down.isDown) {
            if (this.direction == 0) {
                this.player.anims.play('atk_left', true);
                this.swordHitbox.body.enable = true;
                this.physics.world.add(this.swordHitbox.body);
                this.swordHitbox.x = this.player.x - this.player.width/2.5;
                this.swordHitbox.y = this.player.y;
            } else if (this.direction == 1) {
                this.swordHitbox.body.enable = true;
                this.physics.world.add(this.swordHitbox.body);
                this.player.anims.play('atk_right', true);
                this.swordHitbox.x = this.player.x + this.player.width/2;
                this.swordHitbox.y = this.player.y;
            }
        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown) {
            this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);    
            this.swordHitbox.body.enable = false;
            this.physics.world.remove(this.swordHitbox.body);
        }
    }
}