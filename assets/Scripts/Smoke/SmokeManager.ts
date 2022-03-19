import { _decorator } from 'cc'
import { IEntity } from '../../Levels'
import { EnemyManager } from '../../Base/EnemyManager'
import { SmokeStateMachine } from 'db://assets/Scripts/Smoke/SmokeStateMachine'
const { ccclass } = _decorator

@ccclass('SmokeManager')
export class SmokeManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
