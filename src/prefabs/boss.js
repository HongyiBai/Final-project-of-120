class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.moveSpeed = .5;        //x movement
    }

    update() {
        // move boss
        if (this.y >= 340) {
            this.x += this.moveSpeed;
        }
        // checks if it should move left or right
        if(this.x >= 615) {
            this.anims.play('boss_walk_left', true);
            this.moveSpeed = -.5;
        } else if (this.x <= 0){
            this.anims.play('boss_walk_right', true);
            this.moveSpeed = .5;
        }
    }
}