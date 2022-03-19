import { _decorator, Component, Node } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { EVENT_ENUM } from '../../Enum'
const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleRevoke() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOut() {}
}
