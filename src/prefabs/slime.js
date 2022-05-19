class Slime extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.moveSpeed = 1.5;        // pixels per frame
    }

    update() {
        // move slime.
        this.x += this.moveSpeed;
        // checks if it should move left or right
        if(this.x >= 665) {
            this.moveSpeed = -1.5;
        } else if (this.x <= 0){
            this.moveSpeed = 1.5;
        }
    }
}