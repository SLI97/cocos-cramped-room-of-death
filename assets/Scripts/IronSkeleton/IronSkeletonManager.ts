import { _decorator } from 'cc'
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
