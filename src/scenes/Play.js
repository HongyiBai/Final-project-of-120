class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.atlas("character",'player.png','player.json');
        this.load.atlas("slime",'slime.png','slime.json');
        this.load.atlas("flying_monster",'flying_monster.png','flying_monster.json');
        this.load.atlas('boss', 'boss.png', 'boss.json');  
        this.load.image('layer', 'layer.png');
        this.load.image('bk','finalbackground.png');
        this.load.audio('gamemusic', 'playscenemusic.mp3');
    }

    create() { 
        //background
        this.background = this.add.tileSprite(0, 0, 680, 480, 'bk').setOrigin(0, 0);

        //music
        var music = this.sound.add('gamemusic');
        music.setLoop(true);
        music.play();

        //scoreconfig
        this.lives = 100;
        this.score = 0;
        this.nextspawn = 20;
        this.boss_spawned = false;
        this.bosshp = 200;
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
        this.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
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

        //player animations
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
            frameRate: 20,
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
            frameRate: 20,
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
            frameRate: 3,
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
        
        //boss animation
        //walk right
        this.anims.create({
            key: 'boss_walk_right',
            frames: this.anims.generateFrameNames('boss', {
                prefix: 'walkright_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });

        //walk left
        this.anims.create({
            key: 'boss_walk_left',
            frames: this.anims.generateFrameNames('boss', {
                prefix: 'walkleft_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });

        //idle
        this.anims.create({
            key: 'boss_idle',
            frames: this.anims.generateFrameNames('boss', {
                prefix: 'stand_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });

        //attack right
        this.anims.create({
            key: 'boss_atk_right',
            frames: this.anims.generateFrameNames('boss', {
                prefix: 'attackright_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
        });

        //attack left
        this.anims.create({
            key: 'boss_atk_left',
            frames: this.anims.generateFrameNames('boss', {
                prefix: 'attackleft_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 3,
        });

        //temp ground
        this.ground = this.add.group();
        this.groundSprite = this.physics.add.sprite(0, game.config.height, 'ground').setScale(2);
        this.groundSprite.body.immovable = true;
        this.groundSprite.body.allowGravity = false;
        this.ground.add(this.groundSprite);
        this.groundSprite.alpha = 0;

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
        var size = Phaser.Math.FloatBetween(0.75, 1.5);
        if (test % 2 == 0) {
            slime = new Slime(this, Phaser.Math.RND.between(0,150), game.config.height - 50, 'slime', 'slime_0001').setOrigin(0.5).setScale(size);
            this.physics.add.collider(slime, this.ground);
        } else {
            slime = new Slime(this, game.config.width - Phaser.Math.RND.between(0,150), game.config.height - 50, 'slime', 'slime_0001').setOrigin(0.5).setScale(size);
            this.physics.add.collider(slime, this.ground);
        }
        this.physics.add.existing(slime);
        this.slimeGroup.add(slime);
        slime.anims.play('slime_walk');
    }

    flyingAdd() {
        let flying;
        var test = Phaser.Math.Between(1, 100);
        if (test % 2 == 0) {
            flying = new FlyingMon(this, Phaser.Math.RND.between(0,100), Phaser.Math.RND.between(240,280), 'flying_monster', 'flying_0001').setScale(1.1);
        } else {
            flying = new FlyingMon(this, game.config.width - Phaser.Math.RND.between(0,100), Phaser.Math.RND.between(240,280), 'flying_monster', 'flying_0001').setScale(1.1);
        }
        this.physics.add.existing(flying);
        flying.body.allowGravity = false;
        this.flyGroup.add(flying);
        flying.anims.play('monster_flying');
    }

    update() {
        if (this.lives <= 0) {
            this.scene.start("endScene", {score: this.score, win: false});
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

        //spawns flying monster every 20 points
        if (this.score - (this.score % 20) == this.nextspawn) {
            this.flyingAdd();
            this.nextspawn += 20;
        }

        //spawn boss once reaching 500
        if (this.score >= 500 && !this.boss_spawned) {
            this.boss_spawned = true;
            this.boss = new Boss (this, game.config.width/2, game.config.width/2 - 100, 'boss', 'stand_0001').setOrigin(0,0).setScale(2);
            let scoreConfig = {
                fontFamily: 'Palatino Linotype',
                fontSize: '30px',
                color: 'red',
                align: 'center',
                padding: {
                    bottom: 5,
                },
            }
            this.bosshptext = this.add.text(game.config.width/2, 0, 'Boss HP: ' + this.bosshp, scoreConfig).setOrigin(0.5,0);
            this.physics.add.existing(this.boss);
            this.physics.add.collider(this.boss, this.ground);
            this.boss.anims.play('boss_walk_right', true);
        }
        
        if (this.boss_spawned) {
            if (this.boss.y >= 380) {
                this.boss.body.allowGravity = false;
            }
            this.boss.update();
            // this.physics.add.overlap(this.boss, this.player, (obj1, obj2) => {
            //     this.lives -= 20;
            //     this.livestext.text = "HP: " + this.lives;
            // },)
            this.physics.add.overlap(this.boss, this.swordHitbox, (obj1, obj2) => {
                this.bosshp -= 10;
                this.bosshptext.text = "Boss HP: " + this.bosshp;
                if (this.bosshp <= 0) {
                    obj1.destroy();
                    this.bosshptext.destroy();
                    this.scene.start("endScene", {score: this.score});
                }
            },) 
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
        //player attack 
        }   else if (cursors.down.isDown) {
                //attacking left
                if (this.direction == 0) {
                    //this.sound.play('atk_sfx');
                    //this.player.anims.play('atk_left');
                    this.player.play('atk_left', true);
                    this.swordHitbox.body.enable = true;
                    this.physics.world.add(this.swordHitbox.body, true);
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
        //player not moving 
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