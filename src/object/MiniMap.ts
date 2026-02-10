
import Phaser from "phaser";
import Ship from "./Ship";
import Meteor from "./Meteor";
import Obstacle from "./Obstacle";
import BlackHole from "./BlackHole";
import Power from "./Power";
export default class MiniMap extends Phaser.GameObjects.Graphics {
    x: number = 0;
    y: number = 0;
    width: number = 100;
    height: number = 100;
    worldWidth: number = 0;
    worldHeight: number = 0;
    obstacles: Array<Phaser.Geom.Polygon> = []
    blackHoles: Array<BlackHole> = []
    meteors: Array<Meteor> = []
    powers: Array<Power> = []

    ship: Ship | null = null;
    isWin: boolean = false;
    widthCamera: number = 0;
    heightCamera: number = 0;
    constructor(scene: Phaser.Scene, worldWidth: number, worldHeight: number) {
        super(scene);
        this.scene.add.existing(this);
        this.setScrollFactor(0);
        this.setDepth(10);
        this.widthCamera = this.scene.sys.game.scale.gameSize.width;
        this.heightCamera = this.scene.sys.game.scale.gameSize.height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;


        this.width = this.worldWidth * 0.1;
        this.height = this.worldHeight * 0.1;
        this.x = (this.widthCamera / 2) - ((this.width / 2) + 5)
        this.y = 5;

        // this.setupBlackHoles();
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
        this.powers.forEach(s => {
            if (!s.isHit) {
                if (s.type == 'sblue') {
                    //c8e8ed
                    this.fillStyle(0xc8e8ed)
                }
                if (s.type == 'sbrown') {
                    // 625757
                    this.fillStyle(0x625757)
                }
                if (s.type == 'sgreen') {
                    // 7ed3b2
                    this.fillStyle(0x7ed3b2)
                }
                if (s.type == 'sred') {
                    // ef6c57
                    this.fillStyle(0xef6c57)
                }
                if (s.type == 'syellow') {
                    // f7fdb1

                    this.fillStyle(0xf7fdb1)
                }
                this.fillCircle(this.convertX(s.x), this.convertY(s.y), 5)
            }
        })
    }
    setObstacle(obstacles: Array<Obstacle>) {
        obstacles.forEach((ob: Obstacle) => {
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

    convertX(value: number) {
        return this.x + ((value / this.worldWidth) * this.width);
    }
    convertY(value: number) {
        return this.y + ((value / this.worldHeight) * this.height);
    }
}
