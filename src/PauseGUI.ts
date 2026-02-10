import Phaser from "phaser";

export default class LoseGUI extends Phaser.Scene {

    card: Phaser.GameObjects.Image | null = null;
    btnHome: Phaser.GameObjects.Image | null = null;
    btnContinue: Phaser.GameObjects.Image | null = null;
    dataLevel: any;
    width: number = 0.0;
    height: number = 0.0;
    gameScene: Phaser.Scene | null = null

    constructor() {
        super({ key: 'pausegui', 'active': false })
    }
    preload() {

        this.load.image('card', 'assets/card.png');
        this.load.image('btn_home', 'assets/btn_home.png');
        this.load.image('btn_continue', 'assets/btnContinue.png');


    }
    init(data: any) {
        this.dataLevel = data.dataLevel;
    }


    create() {

        this.width = this.sys.game.scale.gameSize.width;
        this.height = this.sys.game.scale.gameSize.height;




        var targetTweenHeight = 700
        this.gameScene = this.scene.get('gameplay');
        this.card = this.add.image(this.width / 2, (this.height / 2) - targetTweenHeight, 'card').setScale(0.3).setOrigin(0.5, 0.5)
        this.tweens.add({
            targets: this.card,
            y: this.height / 2,
            duration: 500,
            ease: 'sine.out'

        })
        this.btnContinue = this.add.image(this.width / 2, (this.height * 0.55) - targetTweenHeight, 'btn_continue')
            .setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('continue')
                this.scene.stop('pausegui')
                this.scene.resume('gameplay')
            })
        this.tweens.add({
            targets: this.btnContinue,
            y: this.height * 0.55,
            duration: 500,
            ease: 'sine.out'

        })

        this.btnHome = this.add.image(this.width / 2, (this.height * 0.7) - targetTweenHeight, 'btn_home')
            .setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('home')
                this.scene.stop('gameplay')
                this.scene.stop('losegui')
                this.scene.start('mainmenu')
            })
        this.tweens.add({
            targets: this.btnHome,
            y: this.height * 0.7,
            duration: 500,
            ease: 'sine.out'

        })
        var text = this.add.text(this.width / 2, (this.height * 0.3) - targetTweenHeight, "Game Paused", { fontFamily: 'painter', fontSize: 50, color: '#dfd8c8' }).setOrigin(0.5)
        this.tweens.add({
            targets: text,
            y: this.height * 0.3,
            duration: 500,
            ease: 'sine.out'

        })

    }

    update(time: number, delta: number): void {

    }
    setActive(value: boolean) {
        this.scene.setActive(value, this)
        this.scene.setVisible(value, this)
    }



}