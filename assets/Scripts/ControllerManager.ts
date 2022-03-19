import { _decorator, Component, Node } from 'cc'
import EventManager from '../Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from '../Enum'
const { ccclass, property } = _decorator

/**
 * Predefined variables
 * Name = ControllerManager
 * DateTime = Wed Mar 16 2022 19:16:54 GMT+0800 (中国标准时间)
 * Author = sli97
 * FileBasename = ControllerManager.ts
 * FileBasenameNoExtension = ControllerManager
 * URL = db://assets/Scripts/ControllerManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(event: Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM)
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
