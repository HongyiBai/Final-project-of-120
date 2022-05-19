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
        //background
        this.background = this.add.tileSprite(0, 0, 680, 480, 'bk').setOrigin(0, 0);

        //scoreconfig
        this.score = 0;
        this.nextspawn = 0;
        let scoreConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '30px',
            backgroundColor: '#821a7b',
            color: '#fcec3c',
            align: 'left',
            padding: {
                bottom: 5,
            },
        }
        this.scoretext = this.add.text(0, 0, 'Score: ' + this.score, scoreConfig);

        //player movement
        this.VELOCITY = 500;
        this.direction = 0;     //left = 0 and right = 1

        this.cameras.main.setBackgroundColor('#666');

        this.slimeGroup = this.add.group({
            classType: Slime,
            runChildUpdate: true,
        });

        //animations
        //idle
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

        //run right
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

        //run left
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

        //attack right
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
        });

        //attack left
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
        });

        //temp ground
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

        //player
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height - 59, 'character', 'idle_stand_0001').setScale(1.5);
        this.player.setCollideWorldBounds(true);

        //sword hitbox
        this.swordHitbox = this.add.rectangle(-100, -100, this.player.width * 3, this.player.height * 1.5, 0, 0x000000, 0);
        this.physics.add.existing(this.swordHitbox);

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player,this.layer);
    }

    //spawns slime
    slimeAdd() {
        let slime;
        var test = Phaser.Math.Between(1, 100);
        if (test % 2 == 0) {
            slime = new Slime(this, Phaser.Math.RND.between(0,150), game.config.height - 51, 'slime', 0);
        } else {
            slime = new Slime(this, game.config.width - Phaser.Math.RND.between(0,150), game.config.height - 51, 'slime', 0);
        }
        this.physics.add.existing(slime);
        this.slimeGroup.add(slime);
    }

    update() {
        //checks if sword hits slime
        this.slimeGroup.getChildren().forEach(function(slime){
            if (slime.x + 12 >= this.swordHitbox.x && slime.x - 12 <= this.swordHitbox.x ) {
                slime.destroy();
                this.score += 10;
                this.scoretext.text = 'Score: ' + this.score;
            }
        }, this);
        
        //spawns slime if score increases in every increment of 10
        if ((this.score - (this.score % 10)) / 10 == this.nextspawn) {
            console.log(this.score / 10);
            this.slimeAdd();
            this.nextspawn += 1;
        }

        //player runs left
        if (cursors.left.isDown) {
            this.direction = 0;
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.anims.play('run_left', true);
        //player runs right
        } else if (cursors.right.isDown) {
            this.direction = 1;
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.anims.play('run_right', true);
        //player attacks   
        } else if (cursors.down.isDown) {
            //attacking left
            if (this.direction == 0) {
                //this.sound.play('atk_sfx');
                this.player.anims.play('atk_left', true);
                this.swordHitbox.body.enable = true;
                this.physics.world.add(this.swordHitbox.body);
                this.swordHitbox.x = this.player.x - this.player.width/2.5;
                this.swordHitbox.y = this.player.y;
            //attacking right
            } else if (this.direction == 1) {
                //this.sound.play('atk_sfx');
                this.swordHitbox.body.enable = true;
                this.physics.world.add(this.swordHitbox.body);
                this.player.anims.play('atk_right', true);
                this.swordHitbox.x = this.player.x + this.player.width/2;
                this.swordHitbox.y = this.player.y;
            }
        //stop moving and attacking
        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown) {
            this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);    
            this.swordHitbox.body.enable = false;
            this.physics.world.remove(this.swordHitbox.body);
            this.swordHitbox.x = -100;
        }
    }
}