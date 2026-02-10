import Phaser from "phaser";

export default class Power extends Phaser.GameObjects.Image {


    type: string;
    circle: Phaser.Geom.Circle;
    isHit: boolean = false;
    // graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.setScale(0.08)
        this.scene.add.existing(this);
        this.type = texture;
        this.circle = new Phaser.Geom.Circle(x, y, 15)

        // this.graphics = this.scene.add.graphics();

        // this.graphics.fillStyle(0xffffff)
        // this.graphics.fillCircleShape(this.circle)
    }


    convertPos(pos: Phaser.Math.Vector2) {
        return this.scene.cameras.main.getWorldPoint(pos.x, pos.y);
    }

    addParticle(x: number, y: number) {

        return this.scene.add.particles(x, y, 'meteorit', {
            lifespan: 2000,
            speed: { min: 10, max: 150 },
            scale: { start: 0.05, end: 0.00 },
            emitting: false,
        })
    }


}