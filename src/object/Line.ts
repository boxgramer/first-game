import Phaser from "phaser";

export default class Line {

    scene: Phaser.Scene;
    graphic: Phaser.GameObjects.Graphics;

    startPoint: Phaser.Math.Vector2 | null = Phaser.Math.Vector2.ZERO;
    currentPoint: Phaser.Math.Vector2 | null = Phaser.Math.Vector2.ZERO;
    isClick: boolean = false;
    power: number = 0;
    maxPower: number = 100;
    angle: number = 0; //angle in radian
    indicator: Phaser.GameObjects.Image;
    maxIndicator: number = 250;
    callback!: (power: number, angle: number) => void;
    callbackUpdate!: (power: number, angle: number) => void;
    callbackIndicator!: (indikator: Phaser.GameObjects.Image) => void;



    constructor(scene: Phaser.Scene, callbackUpdate: (power: number, angle: number) => void, callback: (power: number, angle: number) => void, callbackIndikator: (indikator: Phaser.GameObjects.Image) => void) {
        this.scene = scene;
        this.graphic = this.scene.add.graphics();
        this.callbackUpdate = callbackUpdate;
        this.callback = callback;
        this.callbackIndicator = callbackIndikator;

        this.indicator = this.scene.add.image(150, 1100, 'indicator')
        this.indicator.setScale(0.2)
        this.indicator.setCrop(0, this.maxIndicator, this.indicator.getBottomRight().x, this.indicator.getBottomRight().y)
        this.indicator.setVisible(false)

    }
    showIndikator() {
        this.indicator.setVisible(true)
        this.indicator.setCrop(0, this.maxIndicator, this.indicator.getBottomRight().x, this.indicator.getBottomRight().y)
    }
    hideIndikator() {
        this.indicator.setVisible(false)
    }

    setIndicator(value: number) {
        value = Phaser.Math.Clamp(value, 0, this.maxIndicator);
        this.indicator.setCrop(0, this.maxIndicator - value, this.indicator.getBottomRight().x, this.indicator.getBottomRight().y)
    }




    start() {
        this.scene.input.on('pointerdown', (p: Phaser.Input.InputPlugin) => {
            this.startPoint = new Phaser.Math.Vector2(p.x, p.y);
            this.currentPoint = new Phaser.Math.Vector2(p.x, p.y);
            this.isClick = true;

            this.showIndikator();
            this.callbackIndicator(this.indicator)

        })

        this.scene.input.on('pointermove', (p: Phaser.Input.InputPlugin) => {
            if (!this.isClick)
                return;
            this.currentPoint = new Phaser.Math.Vector2(p.x, p.y);
            const distance = this.startPoint?.distance(this.currentPoint!);
            this.power = Phaser.Math.Clamp(distance!, 0, this.maxPower);
            this.angle = Phaser.Math.Angle.BetweenPoints(this.currentPoint!, this.startPoint!);
            this.callbackUpdate(this.power, this.angle);
            this.callbackIndicator(this.indicator);
            this.setIndicator(this.power / 100 * this.maxIndicator)

            this.update()

        })
        this.scene.input.on('pointerup', () => {

            const distance = this.startPoint?.distance(this.currentPoint!);
            this.power = Phaser.Math.Clamp(distance!, 0, this.maxPower);
            this.angle = Phaser.Math.Angle.BetweenPoints(this.currentPoint!, this.startPoint!);
            this.callback(this.power, this.angle);
            this.isClick = false;
            this.callbackIndicator(this.indicator)

            this.hideIndikator();

        })
    }


    update() {

        if (!this.isClick)
            return;


        // this.graphic.clear();
        // this.graphic.fillStyle(0x4CD6F1, 1);
        // this.graphic.fillCircle(this.startPoint!.x, this.startPoint!.y, 5);

        // this.graphic.lineStyle(2.5, 0x65E8B4, 1);
        // this.graphic.lineBetween(this.startPoint!.x, this.startPoint!.y, this.currentPoint!.x, this.currentPoint!.y);

        // this.graphic.fillStyle(0x4CD6F1, 1);
        // this.graphic.fillCircle(this.currentPoint!.x, this.currentPoint!.y, 5);





    }


}