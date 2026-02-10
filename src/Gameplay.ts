import Ship from "./object/Ship";
import BlackHole from "./object/BlackHole";
import Line from "./object/Line";
import Obstacle from "./object/Obstacle";
import BigBlackHole from "./object/BigBlackHole";
import MiniMap from "./object/MiniMap";
import Meteor from "./object/Meteor";
import TextBox from "./object/TextBox";
import Power from "./object/Power";
import PlacementContainer from "./object/PlacementContainer";
import Location, { pos } from "./utils/Location";
import { Data } from "./utils/Data";


export default class Gameplay extends Phaser.Scene {

    line!: Line;
    ship!: Ship;
    shapes: Array<Phaser.Geom.Polygon> = [];
    obstacles: Array<Obstacle> = [];
    graphic!: Phaser.GameObjects.Graphics;
    twisters: Array<BlackHole> = [];
    meteors: Array<Meteor> = [];
    powers: Array<Power> = [];
    placementContainer: PlacementContainer | null = null;
    bigBlackHole: BigBlackHole | null = null;
    healthImages: Array<Phaser.GameObjects.Image> = []
    minimap!: MiniMap;
    location!: Location;
    dataStorage: Data = new Data();



    isOpenPortal: boolean = false;
    lives: number = 3;
    isGameOver: boolean = false;
    isWin: boolean = false;
    countObstacleHit: number = 0;
    isEnding: boolean = false;
    level: string = 'level 1';

    textBoxScene: Phaser.Scene | null = null;
    loseGuiScene: Phaser.Scene | null = null;
    width: number = 0.0;
    height: number = 0.0;
    dataLevel: any;

    scoreText: Phaser.GameObjects.Text | null = null;
    constructor() {
        super(
            'gameplay',
        );
    }
    preload() {
        this.load.image('indicator', 'assets/indikator.png')
        this.load.image('star', 'assets/star.png');
        this.load.image('twister', 'assets/tornado_obstacle.png');
        this.load.image('portal', 'assets/tornado_portal.png');
        this.load.image('ship', 'assets/cryon_ship.png');
        this.load.image('health', 'assets/health.png');
        this.load.image('sblue', 'assets/stone-blue.png');
        this.load.image('sbrown', 'assets/stone-brown.png');
        this.load.image('sgreen', 'assets/stone-green.png');
        this.load.image('sred', 'assets/stone-red.png');
        this.load.image('syellow', 'assets/stone-yellow.png');
        this.load.image('placement', 'assets/meteor-placement.png');
        this.load.image('btn_pause', 'assets/pause.png');


        this.load.json('level0', 'level/level0.json');
        this.load.json('level1', 'level/level1.json');
    }

    init() {
        this.lives = 3;

    }
    // percent value
    convertX(value: number) {
        return this.width * (value / 100);
    }
    convertY(value: number) {
        return this.height * (value / 100);
    }
    create() {



        this.isOpenPortal = false;
        this.isGameOver = false;
        this.isEnding = false;
        this.countObstacleHit = 0;
        this.isWin = false;
        this.bigBlackHole = null;
        this.setupHealth(this.lives)
        this.setupPuaseButton()


        this.dataStorage = new Data();
        this.dataLevel = this.cache.json.get('level0');

        this.width = this.sys.game.scale.gameSize.width;
        this.height = this.sys.game.scale.gameSize.height * 3;



        this.location = new Location(this, this.width, this.height, false)



        this.placementContainer = new PlacementContainer(this, this.width / 2, 80)

        this.setupStar()



        if (this.dataStorage.isTutorialCompleted()) {

            this.setupByLevel(this.dataStorage.getLevel());
        } else {
            this.setupObstacle(this.location.getRandomObstacle(1));
            this.setupPortal(this.location.getRandomWithCount(1));
            this.setupPowers(this.location.getRandomWithCount(3), "sblue");
        }




        this.add.text(this.width / 2 - 50, 20, "World " + this.dataStorage.getLevel(), { fontSize: 40, align: 'center', fontFamily: 'painter', color: '#dfd8c8' }).setDepth(10).setScrollFactor(0);
        this.ship = new Ship(this, this.location, 10, this.width, this.height);
        this.scoreText = this.add.text(this.width / 2 + 30, 63, this.dataStorage.getScore().toString(), { fontSize: 30, align: 'left', fontFamily: 'painter', color: '#dfd8c8' }).setDepth(10).setScrollFactor(0);


        this.ship.placementContainer = this.placementContainer
        this.ship.onHit = () => {
            this.lives -= 1;
            this.setupHealth(this.lives)
        }
        this.ship.onUpdateScore = (type: string) => {
            let score = this.dataStorage.getScore();
            if (type == "sblue")
                score += 5;
            else if (type == "sbrown")
                score += 15;
            else if (type == "sgreen")
                score += 25;
            else if (type == "sred")
                score += 45;
            else if (type == "syellow")
                score += 55;

            this.dataStorage.addScore(score);
            if (this.scoreText != null) {
                this.scoreText.setText(this.dataStorage.getScore().toString());
            }
        }

        this.ship.onHitPortal = () => {
            this.dataStorage.addLevel();
            this.restart()
        }

        this.ship.setDirectionDegress(-90);
        this.line = new Line(this,
            (power, angle) => {
                this.ship.setShipAngle(power, angle)
            },
            (power, angle) => {
                this.ship.setPower(power, angle);
            }, (indikator) => {
                indikator.setPosition(this.ship.x - 50, this.ship.y)
            });
        this.line.start();

        this.setupCamera();
        this.minimap = new MiniMap(this, this.width, this.height)
        this.minimap.setObstacle(this.obstacles);
        this.minimap.meteors = this.meteors;
        this.minimap.blackHoles = this.twisters;
        this.minimap.powers = this.powers;

        this.minimap.addShip(this.ship);
        if (!this.dataStorage.isTutorialCompleted()) {


            this.setupTextBox();
            this.dataStorage.completeTutorial();
        }


        // var textBox = new TextBox(this, 400, 800)
        // textBox.typingText("Agus", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare ac felis eu maximus. Vestibulum non odio ipsum. Fusce placerat placerat lorem. Aliquam lacinia justo nec ligula suscipit sagittis. Mauris vitae lectus vitae nibh semper sodales. Vestibulum massa tellus, eleifend id tortor ac, mollis tempor nisl. Vivamus iaculis ex non lectus suscipit, scelerisque cursus velit rutrum. Nullam eget varius augue, efficitur lobortis est. Praesent at scelerisque quam. In hac habitasse platea dictumst. Aliquam faucibus dolor dignissim augue venenatis, non dictum orci posuere. Vestibulum maximus ex urna, id sodales tellus venenatis volutpat.")

    }
    setupByLevel(level: number) {
        const obstacleCount = this.scaleLevelGame(level, 1, 0.4, 1, 6);
        const portalCount = this.scaleLevelGame(level, 1, 0.15, 1, 3);

        const blackHoleCount = this.scaleLevelGame(level, 2, 0.6, 1, 10);
        const meteorCount = this.scaleLevelGame(level, 6, 1.2, 5, 25);

        const powerBlue = this.scaleLevelGame(level, 3, -0.2, 1, 3);
        const powerRed = this.scaleLevelGame(level, 2, -0.15, 1, 2);
        const powerGreen = this.scaleLevelGame(level, 2, -0.15, 1, 2);
        const powerYellow = this.scaleLevelGame(level, 1, -0.1, 1, 1);
        const powerBrown = this.scaleLevelGame(level, 2, -0.15, 1, 2);

        // APPLY
        this.setupObstacle(this.location.getRandomObstacle(obstacleCount));
        this.setupPortal(this.location.getRandomWithCount(portalCount));

        this.setupBlackHole(this.location.getRandomWithCount(blackHoleCount));
        this.setupMeteors(this.location.getRandomWithCount(meteorCount));

        this.setupPowers(this.location.getRandomWithCount(powerBlue), "sblue");
        this.setupPowers(this.location.getRandomWithCount(powerRed), "sred");
        this.setupPowers(this.location.getRandomWithCount(powerGreen), "sgreen");
        this.setupPowers(this.location.getRandomWithCount(powerYellow), "syellow");
        this.setupPowers(this.location.getRandomWithCount(powerBrown), "sbrown");
    }
    scaleLevelGame(
        level: number,
        base: number,
        growth: number,
        min: number,
        max: number
    ) {
        const value = base + level * growth;
        return Phaser.Math.Clamp(
            Phaser.Math.Between(value - 1, value + 1),
            min,
            max
        );
    }

    setupTextBox() {
        this.scene.launch('textboxscene', {
            'dataLevel': this.dataLevel,
            'onStart': () => {
                this.scene.setActive(false, this);
            },
            'onEnd': () => {
                this.scene.setActive(true, this);
            }
        })
        this.textBoxScene = this.scene.get('textboxscene')
    }
    loseCondition() {

        this.scene.setActive(false, this)
        this.scene.launch('losegui')
        this.loseGuiScene = this.scene.get('losegui')

    }
    pauseCondition() {
        this.scene.setActive(false, this)
        this.scene.pause('gameplay')
        this.scene.launch('pausegui')
    }
    restart() {
        this.scene.stop('losegui')
        this.destroyAll()
        this.scene.restart({
            'lives': 3,
        });

    }

    update(time: number, delta: number) {

        this.minimap.isWin = this.isWin;
        this.minimap.update();
        if (this.bigBlackHole != null) {
            this.bigBlackHole.update();
            if (this.bigBlackHole.isEngGame) {
                this.scene.restart({
                    'lives': this.lives,
                });
            }

        }

        this.twisters.forEach(twister => {
            twister.update();
        })
        if (this.isGameOver) {
            if (this.isWin) {
                if (!this.isEnding) {

                    this.destroyAll()

                    this.bigBlackHole = new BigBlackHole(this, this.width / 2, this.height / 2);
                    this.bigBlackHole.addObject(this.ship);

                    this.isEnding = true;

                }
            } else {
                if (this.lives <= 1) {

                    this.destroyAll()
                    this.removeAllHealtImage()
                    this.loseCondition()

                    return
                }


            }

            return;
        }

        this.ship.colideWithObstacles(this.obstacles)
        this.ship.collideWithBlackHole(this.twisters)
        this.ship.collideWithMeteors(this.meteors)
        this.ship.collideWithStar(this.powers)

        this.ship.update(time, delta);
        this.line.update();
        this.obstacles.forEach(obstacles => {
            obstacles.update();
        })
        this.powers.forEach(p => {
            p.update();
        })




        this.isWin = this.calculaateWinStatus();
        this.isGameOver = this.calculateGameOver();

        if (this.isWin && !this.isOpenPortal) {
            this.openPortal()
            this.isOpenPortal = true;
        }
        if (!this.isWin && this.isOpenPortal) {
            this.closePortal()
            this.isOpenPortal = false;
        }
    }
    destroyAll() {
        this.twisters.forEach(twister => {
            twister.destroy();
        })
        this.twisters = []
        this.obstacles.forEach(obstacle => {
            obstacle.destroy();
        })
        this.obstacles = []
        this.meteors.forEach(meteor => {
            meteor.destroy();
        })
        this.meteors = []
    }
    setupCamera() {
        this.cameras.main.setBounds(0, 0, this.width, this.height).setName('main');
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.startFollow(this.ship);
    }

    setupObstacle(obstacles: Array<any>) {
        console.log(obstacles);
        obstacles.forEach(ob => {
            const obstacle = new Obstacle(this, ob.points, ob.name, false);
            this.obstacles.push(obstacle);
        })
    }
    openPortal() {
        this.twisters.forEach(blackHole => {
            if (blackHole.type == 'portal') {
                blackHole.openPortal()
            }
        })

    }
    closePortal() {
        this.twisters.forEach(blackHole => {
            if (blackHole.type == 'portal') {
                blackHole.closePortal()
            }
        })

    }
    setupBlackHole(blackHole: Array<pos>) {

        blackHole.forEach(b => {
            const blackHole = new BlackHole(this, b.x, b.y, "twister");

            this.twisters.push(blackHole);
        })


    }
    setupPortal(portals: Array<pos>) {

        portals.forEach(b => {
            const blackHole = new BlackHole(this, b.x, b.y, "portal");

            this.twisters.push(blackHole);
        })


    }
    setupMeteors(meteor: Array<any>) {
        meteor.forEach(m => {
            const metorit = new Meteor(this, m.x, m.y, m.radius)
            this.meteors.push(metorit)

        })
    }
    setupPowers(powers: Array<any>, texture: string = "sblue") {
        powers.forEach(s => {
            const power = new Power(this, s.x, s.y, texture);
            this.powers.push(power)
        })
    }
    removeAllHealtImage() {
        this.healthImages.forEach(img => {
            img.destroy(true)
        })

    }
    setupHealth(countLive: number) {
        this.removeAllHealtImage()
        let startPosX = 20;
        let startPosY = 30;
        let space = 30;
        for (let i = 0; i < countLive; i++) {
            let image = this.add.image(startPosX, startPosY, 'health')
            image.setDepth(10)
            image.setScrollFactor(0)
            image.setScale(0.13)
            this.healthImages.push(image);
            startPosX += space;
        }
    }
    setupPuaseButton() {
        this.add.image(50, 80, 'btn_pause').setScrollFactor(0).setScale(0.3).setInteractive()
            .setScale(0.2)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('game paused')
                this.pauseCondition()
            })
    }
    setupStar() {
        const star = this.add.image(Phaser.Math.Between(0, this.width), Phaser.Math.Between(0, this.height), 'star').setVisible(false)
        const rt = this.add.renderTexture(this.width / 2, this.height / 2, this.width, this.height)
        rt.setDepth(0)
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.width)
            const y = Phaser.Math.Between(0, this.height)
            star.setScale(Phaser.Math.Between(1, 5) / 100)
            rt.draw(star, x, y)


        }
    }

    calculateGameOver() {
        return this.ship.isDestroy || this.lives <= 0
    }
    calculaateWinStatus() {
        this.countObstacleHit = 0;
        this.obstacles.forEach(obs => {

            if (obs.isGlow) {
                this.countObstacleHit += 1;
            }

        })
        let isHitAllStar = this.countObstacleHit >= this.obstacles.length;
        if (isHitAllStar) {
            if (!this.isWin && this.ship.speed <= 0) {
                return true;
            }
            return this.isWin;
        } else {
            return false;
        }
    }

}