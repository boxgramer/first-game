import Phaser from "phaser";
import TextBox from "./object/TextBox";

export default class TextBoxScene extends Phaser.Scene {
    width: number = 0;
    height: number = 0;
    texts: Array<any> = []
    index: number = 0;
    startPoint: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
    targetPoint: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
    currentTextBox: TextBox | null = null;
    dataLevel: any;
    onStart: () => void = () => { };
    onEnd: () => void = () => { };
    constructor() {
        super({ key: 'textboxscene', 'active': false })
    }
    init(data: any) {
        this.dataLevel = data.dataLevel;
        this.onStart = data.onStart == undefined ? this.onStart : data.onStart;
        this.onEnd = data.onEnd == undefined ? this.onEnd : data.onEnd;
    }


    create() {
        this.width = this.sys.game.scale.gameSize.width;
        this.height = this.sys.game.scale.gameSize.height;

        this.startPoint = new Phaser.Math.Vector2(this.width * 0.5, this.height * 0.2);
        this.targetPoint = new Phaser.Math.Vector2(this.width * 0.5, this.height * 0.8);

        this.texts = this.dataLevel.textboxs;

        this.showTextBox()

    }
    update() {
        if (this.currentTextBox != null) {

            this.currentTextBox.update();
        }
    }
    showTextBox() {

        if (this.index >= this.texts.length) {
            console.log(this.index, this.texts.length)
            return;
        }
        this.currentTextBox = new TextBox(this, this.startPoint.x,
            this.startPoint.y,
            this.texts[this.index].texts,
            this.texts[this.index].who);

        this.tweens.add({
            targets: this.currentTextBox,
            x: this.targetPoint.x,
            y: this.targetPoint.y,
            duration: 500,
            repeat: 0,
            ease: Phaser.Math.Easing.Sine.Out,
        }).on('start', this.onStart)
            .on('complete', () => {
                this.currentTextBox?.startTyping()
            })
        this.index += 1;
    }
    hideTextBox(callback: () => void) {
        this.tweens.add({
            targets: this.currentTextBox,
            x: this.startPoint.x,
            y: this.startPoint.y,
            duration: 500,
            repeat: 0,
            ease: Phaser.Math.Easing.Sine.In,
        }).on('start', callback)
    }

} 