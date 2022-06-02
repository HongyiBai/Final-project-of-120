class FlyingMon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.moveSpeed = 2;        //x movement
        this.fly = 1;              //y movement
    }

    update() {
        // move slime.
        this.x += this.moveSpeed;
        this.y += this.fly;
        // checks if it should move left or right
        if(this.x >= 665) {
            this.moveSpeed = -2;
        } else if (this.x <= 0){
            this.moveSpeed = 2;
        }
        if (this.y <= 100) {
            this.fly = 1;
        } else if (this.y >= 433) {
            this.fly = -1;
        }
    }
}