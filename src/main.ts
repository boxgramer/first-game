import Phaser from 'phaser'

import Gameplay from './Gameplay'
import LoseGUI from './LoseGUI'
import MainMenu from './MainMenu'
import TextBoxScene from './TextBoxScene'
import PauseGUI from './PauseGUI'

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
	scene: [MainMenu, Gameplay, LoseGUI, PauseGUI, TextBoxScene],
	render: {
		antialias: true,
	}
}

export default new Phaser.Game(config)
