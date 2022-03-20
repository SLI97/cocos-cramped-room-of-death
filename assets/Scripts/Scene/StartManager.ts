import { _decorator, Component, Node, director } from 'cc'
import { SCENE_ENUM } from '../../Enum'
import FaderManager from '../../Runtime/FaderManager'
const { ccclass } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  onLoad() {
    director.preloadScene(SCENE_ENUM.Battle)
    FaderManager.Instance.fadeOut(1000)

    this.node.once(Node.EventType.TOUCH_START, this.handleStart, this)
  }

  async handleStart() {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}
