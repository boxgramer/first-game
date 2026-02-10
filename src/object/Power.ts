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

    collect(targetPos: Phaser.Math.Vector2) {
        const x = this.x - this.scene.cameras.main.scrollX;
        const y = this.y - this.scene.cameras.main.scrollY;
        var star = this.scene.add.image(x, y, this.type)
        star.setScrollFactor(0)
        star.setScale(this.scale)

        this.scene.tweens.add({
            targets: star,
            x: targetPos.x,
            y: targetPos.y,
            duration: 500,
            ease: Phaser.Math.Easing.Sine.Out

        }).on('complete', () => {
        })

        this.destroy(true)
    }
    convertPos(pos: Phaser.Math.Vector2) {
        return this.scene.cameras.main.getWorldPoint(pos.x, pos.y);
    }


}