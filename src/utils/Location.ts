
import Phaser from "phaser";
import Obstacle from "../object/Obstacle";

export type pos = { x: number, y: number };
export type obstaclePos = { points: number[], name: string };

export default class Location {
    positions: pos[] = [];
    graphics!: Phaser.GameObjects.Graphics;
    cellWidth: number = 0;
    cellHeight: number = 0;
    width: number = 0;
    height: number = 0;


    constructor(scene: Phaser.Scene, width: number, height: number, isDebug = true, cols = 10, rows = 15) {

        this.width = width;
        this.height = height;

        this.graphics = scene.add.graphics();
        if (isDebug) {
            this.graphics.fillStyle(0xff0000, 1);
        }

        this.cellWidth = this.width / cols;
        this.cellHeight = this.height / rows;



        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * this.cellWidth + this.cellWidth / 2;
                const y = i * this.cellHeight + this.cellHeight / 2;
                if (isDebug) {
                    this.graphics.fillCircle(x, y, 5);
                }
                this.positions.push({ x, y });
            }
        }

        console.log(this.positions)



    }

    calculationConstelation(startPos: pos, count: number, output: pos[], fromIndx: number = -1) {

        console.log("point pos:", startPos, "count:", count, "fromIndx:", fromIndx, this.width, this.height);
        if (count <= 0) return;
        output.push({ x: startPos.x, y: startPos.y });
        const dir = [
            { x: 0, y: -this.cellHeight, i: 0 }, // up
            { x: this.cellWidth, y: 0, i: 1 },  // right
            { x: 0, y: this.cellHeight, i: 2 },  // down
            { x: -this.cellWidth, y: 0, i: 3 },  // left


            // corner / diagonal
            { x: this.cellWidth, y: -this.cellHeight, i: 4 },   // up-right
            { x: this.cellWidth, y: this.cellHeight, i: 5 },    // down-right
            { x: -this.cellWidth, y: this.cellHeight, i: 6 },   // down-left
            { x: -this.cellWidth, y: -this.cellHeight, i: 7 },  // up-left

        ];
        const newDir = dir.filter((d) => d.i !== fromIndx);
        for (const d of Phaser.Utils.Array.Shuffle(newDir)) {

            const newPos = { x: startPos.x + d.x, y: startPos.y + d.y };
            if (newPos.x > 0 && newPos.x < this.width && newPos.y > 0 && newPos.y < this.height) {

                this.calculationConstelation(newPos, count - 1, output, d.i);

                return

            }

        }
    }
    getRandomObstacle(count: number): obstaclePos[] {
        const obstacle: obstaclePos[] = []
        for (let i = 0; i < count; i++) {
            const startPos = this.getRandomPosition();
            const constellation: pos[] = [];
            this.calculationConstelation(startPos, 4, constellation);
            const name = Math.random().toString(36).slice(2, 10);
            console.log('constellation', constellation);
            const points = [];
            for (const p of constellation) {
                points.push(p.x);
                points.push(p.y);
            }
            obstacle.push({ points, name });
        }

        return obstacle;
    }


    getRandomPosition(): pos {
        const randomIndex = Phaser.Math.Between(0, this.positions.length - 1);
        const pos = this.positions[randomIndex];
        this.positions.splice(randomIndex, 1);
        return pos;

    }
    getRandomWithCount(count: number): pos[] {
        const selectedPositions: pos[] = [];
        for (let i = 0; i < count; i++) {
            if (this.positions.length === 0) {
                break;
            }
            selectedPositions.push(this.getRandomPosition());
        }
        return selectedPositions;

    }

}; 
