import Phaser from "phaser";
import Ship from "./Ship";

export default class BigBlackHole extends Phaser.GameObjects.Image {

    speedRotation: number = -0.01;
    speedScale: number = 0.01;
    maxScale: number = 1.3;
    objects: Array<any> = []
    isEngGame: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'twister');
        this.scene.add.existing(this);
        this.setScale(0)


    }
    getPoint() {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    addObject(object: any) {
        this.objects.push({
            'object': object,
            'angle': Phaser.Math.Angle.BetweenPoints(this.getPoint(), object.getPoint()),
            'radius': object.getPoint().distance(this.getPoint()),
        })
    }
    update() {
        this.rotation += this.speedRotation
        if (this.scale <= this.maxScale)
            this.scale += this.speedScale;
        this.objects.forEach(obj => {
            obj.object.x = this.x + Math.cos(obj.angle) * obj.radius;
            obj.object.y = this.y + Math.sin(obj.angle) * obj.radius;

            const targetNormalVel = new Phaser.Math.Vector2(
                Math.cos(obj.angle + Phaser.Math.DegToRad(270)),
                Math.sin(obj.angle + Phaser.Math.DegToRad(270))

            )
            obj.object.direction = targetNormalVel.angle();
            obj.object.setDirectionShip();

            obj.radius -= 0.5;
            obj.angle += this.speedRotation;
            if (obj.radius <= 0) {

                obj.radius = 0;
                this.isEngGame = true;
            }

        })
    }






}