import Phaser, { GameObjects } from "phaser";

export default class TextBox extends Phaser.GameObjects.Container {

    graphics: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    whoSaid: Phaser.GameObjects.Text;
    maxCharWidth: number = 40;
    maxCharLine: number = 5;

    targetTexts: Array<string> = [];
    targetWho: string = '';
    index: number = 0;
    bg: Phaser.GameObjects.Image;
    canNext: boolean = true;
    onEndTextbox: () => void = () => { }




    constructor(scene: Phaser.Scene, x: number, y: number, targetText: Array<string>, targetWho: string, onEndTextBox: () => void) {
        super(scene, x, y)


        this.scene.add.existing(this)
        this.bg = this.scene.add.image(0, 0, 'textbox');
        this.bg.setScale(0.3)
        this.whoSaid = this.scene.add.text(this.bg.getTopLeft().x! + 40, this.bg.getTopLeft().y! + 3, "Agus", {
            fontSize: 19,
            align: "left",
            fontFamily: 'painter',
            color: '#dfd8c8',
        })
        this.graphics = this.scene.make.graphics();


        this.text = this.scene.add.text(this.bg.getTopLeft().x! + 20, this.bg.getTopLeft().y! + 40, "", {
            fontSize: 20,
            align: "left",
            fontFamily: 'painter',
            color: '#dfd8c8',
            wordWrap: { width: 550, useAdvancedWrap: true }
        }).setOrigin(0);

        this.add([this.bg, this.whoSaid, this.text]);
        this.onEndTextbox = onEndTextBox;


        this.targetTexts = targetText;
        this.targetWho = targetWho;

        // this.scene.add.zone(this.getTopLeft().x! + 15, this.getTopLeft().y! + 38, 560, 110)
        //     .setInteractive()
        //     .on("pointermove", (p: any) => {
        //         if (p.isDown) {
        //             this.text.y += p.velocity.y / 10;
        //             this.text.y = Phaser.Math.Clamp(this.text.y, -110, 110)
        //         }
        //     })

        this.bg.setInteractive().on('pointerdown', () => {
            this.startTyping(this.index)

        })

    }
    update() {
        this.graphics.clear();
        this.graphics.fillRect(this.x - 270, this.y - 45, 543, 110);


    }
    startTyping(index: number = 0) {
        this.index = index;



        if (!this.canNext || this.index >= this.targetTexts.length) {
            this.onEndTextbox();
            return;
        }

        var mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.graphics)
        this.text.setMask(mask);

        this.typingText(this.targetWho, this.targetTexts[this.index]);

        this.index += 1;

    }

    typingText(who: string, text: string) {
        let i = 0;
        let width = 0;
        let height = 0;
        let textLength = text.length;
        this.whoSaid.text = who;
        this.text.text = text.substring(0, i);

        this.canNext = false;

        this.scene.time.addEvent({
            callback: () => {
                this.text.text = text.substring(0, i);

                i++;
                width++;
                if (width >= this.maxCharWidth) {
                    width = 0;
                    height++;
                    if (height > this.maxCharLine) {
                        this.text.y -= 10;
                    }
                }


                if (i >= text.length) {
                    this.canNext = true;
                }

            },
            repeat: textLength - 1,
            delay: textLength * 0.1,

        })


    }


}
