class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.atlas("character",'player.png','player.json');
        this.load.atlas("slime",'slime.png','slime.json');
        this.load.atlas("flying_monster",'flying_monster.png','flying_monster.json');
        this.load.image('bk', 'background for final project(test).png');      
        this.load.image('layer', 'layer.png');
    }

    create() { 
        //background
        this.background = this.add.tileSprite(0, 0, 680, 480, 'bk').setOrigin(0, 0);

        //scoreconfig
        this.lives = 100;
        this.score = 0;
        this.nextspawn = 20;
        let scoreConfig = {
            fontFamily: 'Palatino Linotype',
            fontSize: '30px',
            color: 'red',
            align: 'left',
            padding: {
                bottom: 5,
            },
        }
        this.scoretext = this.add.text(0, 0, 'Score: ' + this.score, scoreConfig);
        this.livestext = this.add.text(0, 40, 'HP: ' + this.lives, scoreConfig);

        //player movement
        this.playerJumps = 0;
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.VELOCITY = 500;
        this.direction = 0;     //left = 0 and right = 1

        this.cameras.main.setBackgroundColor('#666');

        //slime group
        this.slimeGroup = this.add.group({
            classType: Slime,
            runChildUpdate: true,
        });

        //flying monster group
        this.flyGroup = this.add.group({
            classType: FlyingMon,
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

        //slime animation
        this.anims.create({
            key: 'slime_walk',
            frames: this.anims.generateFrameNames('slime', {
                prefix: 'slime_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 2,
            repeat: -1,
            yoyo: true,
        });

        //flying monster animation
        this.anims.create({
            key: 'monster_flying',
            frames: this.anims.generateFrameNames('flying_monster', {
                prefix: 'flying_',
                start: 1,
                end: 6,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
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
        this.swordHitbox.body.immovable = true;
        this.swordHitbox.body.allowGravity = false;

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.layer);

        this.slimeAdd();
    }

    jump() {
        if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < 2))
        {
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(-300);
            this.playerJumps ++;
            
        }
    }

    //spawns slime
    slimeAdd() {
        let slime;
        var test = Phaser.Math.Between(1, 100);
        if (test % 2 == 0) {
            slime = new Slime(this, Phaser.Math.RND.between(0,150), game.config.height - 47, 'slime', 'slime_0001').setScale(1.2);
        } else {
            slime = new Slime(this, game.config.width - Phaser.Math.RND.between(0,150), game.config.height - 47, 'slime', 'slime_0001').setScale(1.2);
        }
        this.physics.add.existing(slime);
        this.slimeGroup.add(slime);
        slime.anims.play('slime_walk');
        this.physics.add.collider(slime, this.ground);
    }

    flyingAdd() {
        let flying;
        var test = Phaser.Math.Between(1, 100);
        if (test % 2 == 0) {
            flying = new FlyingMon(this, Phaser.Math.RND.between(0,50), 240, 'flying_monster', 'flying_0001');
        } else {
            flying = new FlyingMon(this, game.config.width - Phaser.Math.RND.between(0,50), 240, 'flying_monster', 'flying_0001');
        }
        this.physics.add.existing(flying);
        flying.body.allowGravity = false;
        this.flyGroup.add(flying);
        flying.anims.play('monster_flying');
    }

    update() {
        if (this.lives <= 0) {
            this.scene.start("endScene", {score: this.score});
        }

        //slime collision check
        this.slimeGroup.getChildren().forEach(function(slime){
            //checks if sword hits slime
            this.physics.add.overlap(slime, this.swordHitbox, (obj1, obj2) => {
                obj1.destroy();
                this.score += 5;
                this.scoretext.text = 'Score: ' + this.score;
                this.slimeAdd();
            })

            //checks if player gets hit by slime
            this.physics.add.overlap(slime, this.player, (obj1, obj2) => {
                obj1.destroy();
                this.score += 1;
                this.slimeAdd();
                this.lives -= 5;
                this.livestext.text = "HP: " + this.lives;
                this.scoretext.text = 'Score: ' + this.score;
            })
        }, this);

        //flying monster collision check
        this.flyGroup.getChildren().forEach(function(fly){
            //checks if sword hits flying monster
            this.physics.add.overlap(fly, this.swordHitbox, (obj1, obj2) => {
                obj1.destroy();
                this.score += 10;
                this.scoretext.text = 'Score: ' + this.score;
            })

            //checks if player gets hit by flying monster
            this.physics.add.overlap(fly, this.player, (obj1, obj2) => {
                obj1.destroy();
                this.score += 5;
                this.lives -= 10;
                this.livestext.text = "HP: " + this.lives;
                this.scoretext.text = 'Score: ' + this.score;
            })
        }, this);

        //spawns flying monster in every 20 score increments
        if (this.score - (this.score % 20) == this.nextspawn) {
            this.flyingAdd();
            this.nextspawn += 20;
        }

        if(Phaser.Input.Keyboard.JustDown(this.keySpace)) {
            this.jump();
        }

        //player runs left
        if (cursors.left.isDown) {
            this.direction = 0;
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.anims.play('run_left', true);
            if (!cursors.down.isDown) {
                this.physics.world.remove(this.swordHitbox.body);
                this.swordHitbox.x = -100;
                this.swordHitbox.y = -100;
            }
        //player runs right
        }   else if (cursors.right.isDown) {
                this.direction = 1;
                this.player.body.setVelocityX(this.VELOCITY);
                this.player.anims.play('run_right', true);
                if (!cursors.down.isDown) {
                    this.physics.world.remove(this.swordHitbox.body);
                    this.swordHitbox.x = -100;
                    this.swordHitbox.y = -100;
                }
        //player not moving 
        }   else if (cursors.down.isDown) {
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
        }   else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown) {
                this.player.anims.play('idle', true);
                this.player.body.setVelocityX(0);
                this.swordHitbox.body.enable = false;
                this.physics.world.remove(this.swordHitbox.body);
                this.swordHitbox.x = -100;
                this.swordHitbox.y = -100;
        }
    }
}