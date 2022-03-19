import { _decorator } from 'cc'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import DataManager from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import { IEntity } from '../../Levels'
import { EnemyManager } from '../../Base/EnemyManager'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'
const { ccclass } = _decorator

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
