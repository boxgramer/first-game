
import Phaser from "phaser";
import Ship from "./Ship";
import Meteor from "./Meteor";
export default class MiniMap extends Phaser.GameObjects.Graphics {
    x: number = 0;
    y: number = 0;
    width: number = 100;
    height: number = 100;
    dataLevel: any;
    obstacles: Array<Phaser.Geom.Polygon> = []
    blackHoles: Array<any> = []
    meteors: Array<Meteor> = []

    ship: Ship | null = null;
    isWin: boolean = false;


    constructor(scene: Phaser.Scene, dataLevel: any) {
        super(scene);
        this.scene.add.existing(this);
        this.dataLevel = dataLevel;
        this.setScrollFactor(0);
        this.setDepth(10);

        this.width = this.dataLevel.world.width * 0.2;
        this.height = this.dataLevel.world.height * 0.1;
        this.x = (this.dataLevel.world.width / 2) - ((this.width / 2) + 5)
        this.y = 5;

        this.setupObstacle();
        this.setupBlackHoles();
    }

    addShip(ship: Ship) {
        this.ship = ship;
        this.update()
    }

    update() {
        this.clear();
        this.lineStyle(1.5, 0xdfd8c8);
        this.strokeRect(this.x, this.y, this.width, this.height);
        if (this.ship != null) {
            this.fillStyle(0xdfd8c8)
            this.fillCircle(this.convertX(this.ship.x), this.convertY(this.ship.y), 3);
        }
        this.obstacles.forEach(polygon => {
            this.lineStyle(1, 0xffffff)
            this.strokePoints(polygon.points)
        })
        this.blackHoles.forEach(bh => {
            if (bh.type == "portal") {
                if (this.isWin) {
                    this.lineStyle(2, 0xdfd8c8);
                    this.strokeCircle(this.convertX(bh.x), this.convertY(bh.y), 13)
                }
            } else {
                this.lineStyle(2, 0xffbcd1);
                this.strokeCircle(this.convertX(bh.x), this.convertY(bh.y), 13)
            }
        })
        this.meteors.forEach(m => {
            if (m.visible) {
                this.fillStyle(0x52575d)
                this.fillCircle(this.convertX(m.x), this.convertY(m.y), 5)
            }
        })
    }
    setupObstacle() {
        this.dataLevel.obstacles.forEach((ob: any) => {
            const points: Array<number> = [];
            ob.points.forEach((p: number, i: number) => {
                if ((i + 1) % 2 == 0) {
                    points.push(this.convertY(p))
                } else {
                    points.push(this.convertX(p))
                }

            })
            this.obstacles.push(new Phaser.Geom.Polygon(points));
        })

    }
    setupBlackHoles() {
        this.dataLevel.blackHoles.forEach((bh: any) => {
            this.blackHoles.push({
                x: bh.x,
                y: bh.y,
                redius: bh.radius,
                type: bh.type
            })
        });
    }
    convertX(value: number) {
        return this.x + ((value / this.dataLevel.world.width) * this.width);
    }
    convertY(value: number) {
        return this.y + ((value / this.dataLevel.world.height) * this.height);
    }
}
