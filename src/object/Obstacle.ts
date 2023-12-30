import Phaser from "phaser";

export default class Obstacle {


    scene: Phaser.Scene;
    polygon: Phaser.Geom.Polygon;
    graphics: Phaser.GameObjects.Graphics;
    fx: Phaser.FX.Glow;
    isGlow: boolean = false;
    name: string;

    constructor(scene: Phaser.Scene, points: Array<number>, worldWidth: number, worldHeight: number, name: string = 'obstacle', isGlow: boolean = false) {
        this.scene = scene;
        this.name = name;

        this.polygon = new Phaser.Geom.Polygon(this.convertPoint(points, worldWidth, worldHeight));
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(1);
        this.fx = this.graphics.postFX.addGlow(0xA0E7E5, 0, 0, false, 0.1, 24);
        this.setGlow(isGlow);
    }
    destroy() {
        this.graphics.destroy();
    }

    convertPoint(points: Array<number>, worldWidth: number, worldHeight: number) {


        for (let i = 0; i < points.length; i++) {

            if ((i + 1) % 2 == 0) {
                //point y
                points[i] = worldHeight * (points[i] / 100);

            } else {
                // pont x 
                points[i] = worldWidth * (points[i] / 100);

            }
        }
        return points;
    }









    setGlow(value: boolean) {
        this.isGlow = value;
        if (value) {
            this.fx.outerStrength = 10;
        } else {
            this.fx.outerStrength = 0;
        }
    }
    toogleGlow() {
        this.isGlow = !this.isGlow;
        this.setGlow(this.isGlow);

    }


    update() {
        this.graphics.clear();

        this.graphics.lineStyle(1, 0xffffff, 1);
        this.graphics.fillStyle(0xffffff, 1);


        this.graphics.strokePoints(this.polygon.points);
        this.polygon.points.forEach(p => {
            this.graphics.fillCircle(p.x, p.y, 2);
        })


    }
}