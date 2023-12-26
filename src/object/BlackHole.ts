import Phaser from "phaser";

export default class BlackHole extends Phaser.GameObjects.Image {

    speedRotation: number = -0.01;
    suctionForce: number = 0.5; // range 0 - 1;
    normalForce: number = 0.4; // range 0 -0.9;
    area: number = 100;
    type: string = ''
    defaultScale: number;

    constructor(scene: Phaser.Scene, x: number, y: number, type: string = 'twister', scale: number = 0.2) {
        super(scene, x, y, type);
        this.scene.add.existing(this);
        this.setDepth(0);
        this.setScale(scale);
        this.type = type;
        this.defaultScale = this.scale;

        if (type == 'portal') {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    getPoint() {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    update() {
        this.rotation += this.speedRotation
    }

    openPortal() {
        if (this.type != 'portal')
            return;

        console.log("open portal")
        this.setActive(true);
        this.setVisible(true);
        let scale = this.defaultScale;
        this.setScale(0);
        this.scene.tweens.add({
            targets: this,
            scale: scale,
            duration: 1000,
            repeat: 0,
            ease: Phaser.Math.Easing.Sine.InOut
        })
    }

    closePortal() {
        if (this.type != 'portal')
            return;

        console.log("close portal")
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 1000,
            repeat: 0,
            ease: Phaser.Math.Easing.Sine.InOut
        }).on("complete", () => {
            this.setActive(false);
            this.setVisible(false);

        })

    }




}