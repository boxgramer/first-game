
import Phaser from "phaser";

export default class Placement extends Phaser.GameObjects.Image {

    collected: string | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'placement')
        this.scene.add.existing(this);
        this.setScrollFactor(0);

        this.setScale(0.08);
    }
}
