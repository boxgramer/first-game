import Ship from "./object/Ship";
import BlackHole from "./object/BlackHole";
import Line from "./object/Line";
import Obstacle from "./object/Obstacle";
import BigBlackHole from "./object/BigBlackHole";
import MiniMap from "./object/MiniMap";
import Meteor from "./object/Meteor";
import TextBox from "./object/TextBox";


export default class Gameplay extends Phaser.Scene {

    line!: Line;
    ship!: Ship;
    shapes: Array<Phaser.Geom.Polygon> = [];
    obstacles: Array<Obstacle> = [];
    graphic!: Phaser.GameObjects.Graphics;
    twisters: Array<BlackHole> = [];
    meteors: Array<Meteor> = [];
    bigBlackHole: BigBlackHole | null = null;
    healthImages: Array<Phaser.GameObjects.Image> = []
    minimap!: MiniMap;



    isOpenPortal: boolean = false;
    lives: number = 3;
    isGameOver: boolean = false;
    isWin: boolean = false;
    countObstacleHit: number = 0;
    isEnding: boolean = false;
    level: string = 'level 1';
    dataLevel: any;

    loseGuiScene: Phaser.Scene | null = null;

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
        this.load.json('level1', 'level/level1.json');
    }

    init(data: any) {
        this.lives = data.lives != undefined ? data.lives : 3;

    }
    create() {



        this.isOpenPortal = false;
        this.isGameOver = false;
        this.isEnding = false;
        this.countObstacleHit = 0;
        this.isWin = false;
        this.bigBlackHole = null;
        this.setupHealth(this.lives)

        this.dataLevel = this.cache.json.get('level1');





        this.setupStar()

        this.setupTwister(this.dataLevel.blackHoles);
        this.setupObstacle(this.dataLevel.obstacles);
        this.setupMeteors(this.dataLevel.meteors);

        this.add.text(this.dataLevel.world.width / 2 - 50, 20, this.dataLevel.level.title, { fontSize: 20, align: 'center', fontFamily: 'painter', color: '#dfd8c8' }).setDepth(10).setScrollFactor(0);
        this.ship = new Ship(this, new Phaser.Math.Vector2(this.dataLevel.player.x, this.dataLevel.player.y), 10, this.dataLevel.world.width, this.dataLevel.world.height);

        this.ship.onHit = () => {
            this.lives -= 1;
            this.setupHealth(this.lives)
            this.ship.setToStart()
            console.log('on hit')
        }

        this.ship.onHitPortal = () => {
            this.restart()
        }

        this.ship.setDirectionDegress(this.dataLevel.player.direction);
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
        this.minimap = new MiniMap(this, this.dataLevel)
        this.minimap.meteors = this.meteors;
        this.minimap.addShip(this.ship);

        var textBox = new TextBox(this, 400, 800)
        textBox.typingText("Agus", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare ac felis eu maximus. Vestibulum non odio ipsum. Fusce placerat placerat lorem. Aliquam lacinia justo nec ligula suscipit sagittis. Mauris vitae lectus vitae nibh semper sodales. Vestibulum massa tellus, eleifend id tortor ac, mollis tempor nisl. Vivamus iaculis ex non lectus suscipit, scelerisque cursus velit rutrum. Nullam eget varius augue, efficitur lobortis est. Praesent at scelerisque quam. In hac habitasse platea dictumst. Aliquam faucibus dolor dignissim augue venenatis, non dictum orci posuere. Vestibulum maximus ex urna, id sodales tellus venenatis volutpat.")
    }
    loseCondition() {

        this.scene.setActive(false, this)
        this.scene.launch('losegui', {
            'dataLevel': this.dataLevel
        })
        this.loseGuiScene = this.scene.get('losegui')

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
            console.log('is game over');
            if (this.isWin) {
                if (!this.isEnding) {

                    this.destroyAll()

                    this.bigBlackHole = new BigBlackHole(this, this.dataLevel.portal.x, this.dataLevel.portal.y)
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

        this.ship.update(time, delta);
        this.line.update();
        this.obstacles.forEach(obstacles => {
            obstacles.update();
        })





        this.isWin = this.calculaateWinStatus();
        this.isGameOver = this.calculateGameOver();

        if (this.isWin && !this.isOpenPortal) {
            console.log("is Win")
            this.openPortal()
            this.isOpenPortal = true;
        }
        if (!this.isWin && this.isOpenPortal) {
            console.log('is lose')
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
        this.cameras.main.setBounds(0, 0, this.dataLevel.world.width, this.dataLevel.world.height).setName('main');
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.startFollow(this.ship);
    }

    setupObstacle(obstacles: Array<any>) {
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
    setupTwister(blackHole: Array<any>) {

        blackHole.forEach(b => {
            const blackHole = new BlackHole(this, b.x, b.y, b.type);

            this.twisters.push(blackHole);
        })


    }
    setupMeteors(meteor: Array<any>) {
        meteor.forEach(m => {
            const metorit = new Meteor(this, m.x, m.y, m.radius)
            this.meteors.push(metorit)

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
            image.setTintFill(0xffffff)
            image.setDepth(10)
            image.setScrollFactor(0)
            image.setScale(0.03)
            this.healthImages.push(image);
            startPosX += space;
        }
    }
    setupStar() {
        const star = this.add.image(Phaser.Math.Between(0, this.dataLevel.world.width), Phaser.Math.Between(0, this.dataLevel.world.height), 'star').setVisible(false)
        const rt = this.add.renderTexture(this.dataLevel.world.width / 2, this.dataLevel.world.height / 2, this.dataLevel.world.width, this.dataLevel.world.height)
        rt.setDepth(0)
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.dataLevel.world.width)
            const y = Phaser.Math.Between(0, this.dataLevel.world.height)
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