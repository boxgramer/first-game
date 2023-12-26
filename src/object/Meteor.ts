import Phaser from "phaser";

export default class Meteor extends Phaser.GameObjects.Sprite {
    circle: Phaser.Geom.Circle;
    radius: number;
    grapics: Phaser.GameObjects.Graphics;
    radiusInScale: number = 85;
    constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 50) {
        super(scene, x, y, 'meteorit')
        this.scene.add.existing(this)
        this.circle = new Phaser.Geom.Circle(x, y, radius)
        this.radius = radius
        this.grapics = this.scene.add.graphics()
        this.setScale(radius / this.radiusInScale)
    }
    update() {
        this.grapics.clear()
        this.grapics.fillStyle(0xff0000, 1)
        this.grapics.fillCircleShape(this.circle)
    }


}