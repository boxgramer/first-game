import Phaser from 'phaser'

import Gameplay from './Gameplay'
import LoseGUI from './LoseGUI'
import MainMenu from './MainMenu'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	scale: {
		mode: Phaser.Scale.RESIZE,
	},
	// width: 800,
	// height: 700,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}

	},
	scene: [MainMenu, Gameplay, LoseGUI],
	render: {
		antialias: true,
	}
}

export default new Phaser.Game(config)
