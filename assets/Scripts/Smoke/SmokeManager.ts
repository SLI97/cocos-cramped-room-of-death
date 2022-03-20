import { _decorator } from 'cc'
import { IEntity } from '../../Levels'
import { SmokeStateMachine } from './SmokeStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
const { ccclass } = _decorator

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
