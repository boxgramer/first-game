import Phaser from "phaser";
import Placement from "./Placement";

export default class PlacementContainer {
    x: number;
    y: number;
    count: number = 5;
    width: number = 50;
    scene: Phaser.Scene;
    placements: Array<Placement> = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.setupPlacement();
    }

    setupPlacement() {
        var maxWidth = this.width * this.count;
        var halfMaxWidth = maxWidth / 2;
        var startPosX = this.x - halfMaxWidth + (this.width / 2)
        for (let i = 0; i < this.count; i++) {
            let placement = new Placement(this.scene, startPosX, this.y);
            this.placements.push(placement);
            startPosX += this.width;
        }
    }

    getEmptyPlacement(type: string) {
        for (let i = 0; i < this.placements.length; i++) {


            console.log(this.placements[i].collected, type, " out placement")
            if (this.placements[i].collected == type) {

                return null;
            }
        }
        for (let i = 0; i < this.placements.length; i++) {
            if (this.placements[i].collected == null) {
                this.placements[i].collected = type;
                return this.placements[i];
            }
        }


        return null
    }


}