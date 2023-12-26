import Phaser, { GameObjects } from "phaser";

export default class TextBox extends Phaser.GameObjects.Image {

    text: Phaser.GameObjects.Text;
    whoSaid: Phaser.GameObjects.Text;
    maxCharWidth: number = 40;
    maxCharLine: number = 5;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'textbox')
        this.setScale(0.3)

        this.scene.add.existing(this)
        this.whoSaid = this.scene.add.text(this.getTopLeft().x! + 40, this.getTopLeft().y! + 3, "Agus", {
            fontSize: 19,
            align: "left",
            fontFamily: 'painter',
            color: '#dfd8c8',
        })
        var mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.scene.make.graphics().fillRect(this.getTopLeft().x! + 15, this.getTopLeft().y! + 38, 560, 110))
        this.text = this.scene.add.text(this.getTopLeft().x! + 20, this.getTopLeft().y! + 40, "hellow assd asdi asdiasdisd askdjfalsdjf askdjfksdjfls djflasdjf lasjdflsjdfljsldjflskdjf jsdlfjlsjdfsdf asd a alsdjf asdfoisaduf osdufo asdfuou oasidufosdhf asdiufoasdfsdifskljfl sdf0iasdfpsdipa sdia aisdujpasid ap apsdiuaposiduapodiu paoisdu apoisdupaosdupaoisdu asd woldl asdjfa;lsdjf a;lsdjf asldjf;lasdjfa;lsdjf;alsdjf;a dsjf;lajs df;al ", {
            fontSize: 20,
            align: "left",
            fontFamily: 'painter',
            color: '#dfd8c8',
            wordWrap: { width: 550, useAdvancedWrap: true }
        }).setOrigin(0)
            .setMask(mask);

        // this.scene.add.zone(this.getTopLeft().x! + 15, this.getTopLeft().y! + 38, 560, 110)
        //     .setInteractive()
        //     .on("pointermove", (p: any) => {
        //         if (p.isDown) {
        //             this.text.y += p.velocity.y / 10;
        //             this.text.y = Phaser.Math.Clamp(this.text.y, -110, 110)
        //         }
        //     })


    }

    typingText(who: string, text: string) {
        let i = 0;
        let width = 0;
        let height = 0;
        let textLength = text.length;
        this.whoSaid.text = who;
        this.text.text = text.substring(0, i);

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



            },
            repeat: textLength - 1,
            delay: textLength * 0.1,

        })


    }


}
