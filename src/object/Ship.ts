import Phaser, { Tweens } from "phaser";
import Obstacle from "./Obstacle";
import BlackHole from "./BlackHole";
import Meteor from "./Meteor";
import Star from "./Power";
import PlacementContainer from "./PlacementContainer";
import Location from "../utils/Location";

export default class Ship extends Phaser.GameObjects.Sprite {

    placementContainer: PlacementContainer | null = null;
    startPosition: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO
    point: Phaser.Math.Vector2;
    velocity: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
    direction: number = 0;
    maxSpeed: number = 15;
    speed: number = 0;
    bounceSpeed: number = 0;
    radius: number = 50;
    scene: Phaser.Scene;
    length: number = 5;
    graphics: Phaser.GameObjects.Graphics;
    circle: Phaser.Geom.Circle;
    line: Phaser.Geom.Line;
    isDestroy: boolean = false;
    isHit: boolean = false;
    worldMaxWidth: number = 800;
    worldMaxHeight: number = 600;
    pointTrails: any = [];
    onHit: () => void = () => { };
    onHitPortal: () => void = () => { };

    fire: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    firePosMarginY: number = 30;
    fireAnggleRange: number = 100;
    location!: Location;


    constructor(scene: Phaser.Scene, location: Location, radius: number = 50, maxWorldWidth: number = 800, maxWorldHeight: number = 600) {
        const point = location.getRandomPosition();

        super(scene, point.x, point.y, 'ship')
        this.scene = scene;

        this.location = location;
        this.point = new Phaser.Math.Vector2(point.x, point.y);
        this.startPosition = new Phaser.Math.Vector2(point.x, point.y); // save start point
        this.radius = radius;
        this.graphics = this.scene.add.graphics();
        this.circle = new Phaser.Geom.Circle(this.point.x, this.point.y, this.radius);
        this.velocity = new Phaser.Math.Vector2(Math.cos(this.direction), Math.sin(this.direction));
        this.line = new Phaser.Geom.Line(this.point.x,
            this.point.y,
            this.point.x + this.velocity.x * this.length,
            this.point.y + this.velocity.y * this.length
        );
        this.worldMaxHeight = maxWorldHeight;
        this.worldMaxWidth = maxWorldWidth;

        this.update(0, 0);
        this.scene.add.existing(this);
        this.setScale(0.08)
        this.setDepth(1);

        this.setDirectionShip()




    }

    fireSetup() {
        if (this.fire != null) {
            return;
        }
        this.fire = this.scene.add.particles(0, 0, 'meteorit', {

            x: () => {
                return this.x - Math.cos(this.direction) * this.firePosMarginY;
            },
            y: () => {

                return this.y - Math.sin(this.direction) * this.firePosMarginY;
            },
            color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
            lifespan: 500,
            angle: () => {
                return Phaser.Math.Between(
                    (180 + (Phaser.Math.RadToDeg(this.direction)) - this.fireAnggleRange),
                    (180 + (Phaser.Math.RadToDeg(this.direction)) + this.fireAnggleRange)
                )
            },
            scale: 0.03,
            speed: () => {
                return Phaser.Math.Between(this.speed, this.speed * 2);
            },
            blendMode: 'ADD',

        })


    }
    destroy(fromScene?: boolean | undefined): void {
        this.isDestroy = true;
        super.destroy(fromScene);
        this.graphics.destroy();
    }
    setDirectionDegress(degress: number) {
        this.direction = Phaser.Math.DegToRad(degress);
        this.setDirectionShip()
    }
    setDirectionShip() {
        this.rotation = this.direction //+ Phaser.Math.DegToRad(180);
    }


    update(time: number, delta: number) {

        this.setDirectionShip()


        this.updateVelocity(delta);



        this.circle.x = this.point.x;
        this.circle.y = this.point.y;
        this.x = this.point.x;
        this.y = this.point.y;


        this.setupLine();
        this.draw()
        if (this.speed > 0) {
            if (this.fire != null) {
                this.fire.start()
            } else {
                this.fireSetup();
            }

        } else {
            if (this.fire != null) {
                this.fire.stop();
            }


        }



    }
    setToStart() {
        const p = this.location.getRandomPosition();
        this.point = new Phaser.Math.Vector2(p.x, p.y);

    }
    meteorHitEffect(callback: () => void) {
        var blinkBefore = this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300,
            repeat: 2,
            yoyo: true,
        })
        var blinkAfter = this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 300,
            repeat: 4,
            yoyo: true,
            delay: 300,
        })
        blinkBefore.on('complete', () => {
            callback()
        })
        blinkAfter.on('complete', () => {
            this.isHit = false;
            this.setAlpha(1)


        })


    }
    blackHoleHitEffect(callback: () => void) {
        var blinkAfter = this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300,
            repeat: 3,
            yoyo: true,
        })
        blinkAfter.on('start', () => {
            callback()

            this.setToStart()

        })
        blinkAfter.on('complete', () => {
            this.graphics.setVisible(true)
            this.isHit = false;
            this.setAlpha(1)
        })
    }
    getPoint() {
        return this.point;
    }
    draw() {

        this.graphics.clear();

        // this.drawTrail();
    }
    addParticle(x: number, y: number) {

        const emitter = this.scene.add.particles(x, y, 'meteorit', {
            lifespan: 2000,
            speed: { min: 10, max: 150 },
            scale: { start: 0.05, end: 0.00 },
            emitting: false,
        })
        emitter.explode(40);
    }
    getPlacement(starType: string) {
        if (this.placementContainer == null) {
            return null;
        }
        return this.placementContainer.getEmptyPlacement(starType);



    }
    collideWithStar(stars: Array<Star>) {
        stars.forEach(star => {
            if (!star.isHit) {
                let isHit = this.collideWithCircle(star.circle)

                if (isHit) {
                    let placement = this.getPlacement(star.type);
                    if (placement != null) {
                        star.isHit = true;
                        star.collect(new Phaser.Math.Vector2(placement.x, placement.y))
                    }
                }
            }

        })
    }

    collideWithMeteors(meteors: Array<Meteor>) {
        if (this.isHit) {
            return
        }
        for (let i = 0; i < meteors.length; i++) {
            if (!meteors[i].visible) {
                return;
            }
            let isHit = this.collideWithCircle(meteors[i].circle)
            if (isHit) {
                this.isHit = true;
                this.speed = 0;
                this.meteorHitEffect(this.onHit)
                this.addParticle(meteors[i].x, meteors[i].y)
                meteors[i].setVisible(false)
                break;
            }
        }
    }
    collideWithCircle(circle: Phaser.Geom.Circle) {
        if (Phaser.Geom.Intersects.CircleToCircle(this.circle, circle)) {
            return true;
        }
        return false;
    }
    colideWithLine(line: Phaser.Geom.Line) {

        if (Phaser.Geom.Intersects.LineToCircle(line, this.circle)) {
            this.direction = Phaser.Geom.Line.ReflectAngle(this.line, line)
            this.velocity.x = Math.cos(this.direction);
            this.velocity.y = Math.sin(this.direction);
            this.bounceSpeed = 5;
            return true;
        }

        return false;

    }
    colideWithObstacles(obstacles: Array<Obstacle>) {

        for (let j = 0; j < obstacles.length; j++) {

            if (this.getLineFromPoint(obstacles[j].polygon.points)) {
                obstacles[j].toogleGlow();
                break;
            }
        }
    }
    collideWithBlackHole(blackHoleses: Array<BlackHole>) {
        blackHoleses.forEach(blackHole => {
            if (!blackHole.visible) {
                return;
            }
            const distance = this.point.distance(blackHole.getPoint());
            if (distance <= blackHole.area) {
                this.onHitWithBlackHole(blackHole);
            }
        })

    }
    onHitWithBlackHole(blackHole: BlackHole) {
        if (this.isHit)
            return;
        const targetAngle = Phaser.Math.Angle.BetweenPoints(this.point, blackHole.getPoint());
        const targetVel = new Phaser.Math.Vector2(
            Math.cos(targetAngle),
            Math.sin(targetAngle),
        )

        const targetNormalVel = new Phaser.Math.Vector2(
            Math.cos(targetAngle + Phaser.Math.DegToRad(90)),
            Math.sin(targetAngle + Phaser.Math.DegToRad(90))

        )
        const distance = this.point.distance(blackHole.getPoint());
        if (distance <= 3) {
            if (blackHole.type != 'portal') {
                this.isHit = true;
                this.bounceSpeed = 0.3;
                this.graphics.setVisible(false);
                this.blackHoleHitEffect(this.onHit)

            }
            else {
                this.onHitPortal();
            }
        } else {
            this.bounceSpeed = 1;
        }
        this.velocity.lerp(targetVel, blackHole.suctionForce)
        this.velocity.lerp(targetNormalVel, blackHole.normalForce);
        this.direction = this.velocity.angle();
    }
    getLineFromPoint(points: Phaser.Geom.Point[]) {
        for (let i = 0; i < points.length - 1; i++) {
            let nextIndex = (i + 1) % points.length;
            if (this.colideWithLine(
                new Phaser.Geom.Line(points[i].x, points[i].y,
                    points[nextIndex].x, points[nextIndex].y),
            )) {
                return true;
            }


        }
        return false;


    }
    setReflectIntersectPoint(point: Phaser.Math.Vector2, line: Phaser.Geom.Line) {
        if (Phaser.Geom.Intersects.PointToLine(point, line)) {
            this.direction = Phaser.Geom.Line.ReflectAngle(this.line, line)
            this.velocity.x = Math.cos(this.direction);
            this.velocity.y = Math.sin(this.direction);


        }

    }
    updateVelocity(deltaTime: number) {
        const delta = deltaTime / 1000;
        this.velocity.normalize();
        if ((this.point.x >= this.worldMaxWidth || this.point.x <= 0)) {
            this.velocity.mirror(Phaser.Math.Vector2.UP);
            this.direction = this.velocity.angle();
            this.bounceSpeed = 5;
        } else if ((this.point.y >= this.worldMaxHeight || this.point.y <= 0)) {
            this.velocity.mirror(Phaser.Math.Vector2.RIGHT);
            this.direction = this.velocity.angle();
            this.bounceSpeed = 5;
        }
        this.velocity.x *= (this.speed + this.bounceSpeed);
        this.velocity.y *= (this.speed + this.bounceSpeed);
        if (this.speed > 0) {
            this.speed -= delta;
            // this.addTrail(this.point.x, this.point.y, Math.cos(this.direction) * -32, Math.sin(this.direction) * -32);

        } else {
            this.speed = 0;
        }
        if (this.bounceSpeed > 0) {
            this.bounceSpeed = 0;
        }


        this.point.add(this.velocity);
    }
    // addTrail(x: number, y: number, ajustX: number = 0, ajustY: number = 0) {
    //     this.pointTrails.push({
    //         pos: new Phaser.Math.Vector2(x + ajustX, y + ajustY),
    //         time: 4.0,
    //     })
    // }
    // removeTrail() {
    //     for (let i = 0; i < this.pointTrails.length; i++) {
    //         let p = this.pointTrails[i];
    //         p.time -= 0.5;
    //         if (p.time <= 0) {
    //             this.pointTrails.splice(i, 1);
    //             i -= 1;
    //         }
    //     }
    // }
    linearInterpolation(norm: number, min: number, max: number) {
        return (max - min) * norm + min;
    };
    // drawTrail() {
    //     if (this.pointTrails.length > 4) {
    //         this.graphics.lineStyle(1, 0xFFFF00, 1.0);
    //         this.graphics.beginPath();
    //         this.graphics.lineStyle(0, 0xFFFF00, 1);
    //         this.graphics.moveTo(this.pointTrails[0].pos.x, this.pointTrails[0].pos.y)
    //         for (let i = 1; i < this.pointTrails.length - 4; i++) {
    //             let p = this.pointTrails[i].pos;
    //             this.graphics.lineStyle(Phaser.Math.Interpolation.Linear([0, 10], i / (this.pointTrails.length - 4)), 0xffff00, 0.5);

    //             this.graphics.lineTo(p.x, p.y);
    //         };
    //         var count = 0;
    //         for (let i = this.pointTrails.length - 4; i < this.pointTrails.length; i++) {
    //             let p = this.pointTrails[i].pos;

    //             this.graphics.lineStyle(Phaser.Math.Interpolation.Linear([10, 0], count++ / 4), 0xFFFF00, 1.0);


    //             this.graphics.lineTo(p.x, p.y);
    //         }

    //         this.graphics.strokePath();
    //         this.graphics.closePath();

    //     }
    //     this.removeTrail();
    // }
    setupLine() {
        this.line.x1 = this.point.x;
        this.line.y1 = this.point.y;
        this.line.x2 = this.point.x + this.velocity.x * this.length;
        this.line.y2 = this.point.y + this.velocity.y * this.length;

    }
    setPower(power: number, angle: number) {

        if (this.speed != 0) {
            return;
        }
        this.direction = angle;


        this.speed = power / 10;
        this.velocity.x = Math.cos(this.direction);
        this.velocity.y = Math.sin(this.direction);
    }
    setShipAngle(power: number, angle: number) {
        if (this.speed != 0) {
            return;
        }
        this.direction = angle;
        this.length = power;
    }

}