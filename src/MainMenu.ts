import Phaser from "phaser";
import TextBox from "./object/TextBox";

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super('mainmenu')
    }
    preload() {
        this.load.image('star', 'assets/star.png');
        this.load.image('btn_continue', 'assets/btnContinue.png')
        this.load.image('btn_newgame', 'assets/btnNewGame.png')
        this.load.image('btn_setting', 'assets/btnSetting.png')
        this.load.image('title', 'assets/TitleGame.png')
        this.load.image('meteorit', 'assets/Meteorit.png')
        this.load.image('textbox', 'assets/textbox.png')
    }
    create() {


        var width = this.sys.game.scale.width;
        var height = this.sys.game.scale.height;
        this.setupStar(width, height)
        this.setupRandomMeteor(width, height)

        var title = this.add.image(width / 2, height * 0.3, 'title')
            .setScale(0.3)
        var btnNewGame = this.add.image(width / 2, height * 0.6, 'btn_newgame')
            .setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.launch('gameplay', { 'lives': '3' })
                this.scene.stop('mainmenu')
            })
        var btnContinue = this.add.image(width / 2, height * 0.6, 'btn_continue')
            .setScale(0.3)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("continues")
            })

        var btnSetting = this.add.image(width / 2, height * 0.75, 'btn_setting')
            .setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('settng open')
            })



    }

    setupStar(width: number, height: number) {
        const star = this.add.image(Phaser.Math.Between(0, 0), Phaser.Math.Between(0, 0), 'star').setVisible(false)
        const rt = this.add.renderTexture(width / 2, height / 2, width, height)
        rt.setDepth(0)
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width)
            const y = Phaser.Math.Between(0, height)
            star.setScale(Phaser.Math.Between(1, 5) / 100)
            rt.draw(star, x, y)


        }
    }
    setupRandomMeteor(width: number, height: number) {
        const meteor = this.add.image(Phaser.Math.Between(0, 0), Phaser.Math.Between(0, 0), 'meteorit').setVisible(false)
        const rt = this.add.renderTexture(width / 2, height / 2, width, height)
        rt.setDepth(0)
        let i = 0;
        while (i < 10) {
            const x = Phaser.Math.Between(0, width)
            const y = Phaser.Math.Between(0, height)
            if (x > width * 0.2 && x < width - (width * 0.2)) {
                continue;
            }
            meteor.setScale(Phaser.Math.Between(1, 5) / 10)
            rt.draw(meteor, x, y)
            i++;


        }

    }

}