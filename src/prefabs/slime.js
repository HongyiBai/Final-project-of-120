class Slime extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.hp = 20;   // store pointValue
        this.moveSpeed = 1.5;        // pixels per frame
    }

    update() {
        // move spaceship left.
        this.x += this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x >= 640) {
            this.moveSpeed = -1.5;
        } else if (this.x <= 0){
            this.moveSpeed = 1.5;
        }
    }
}