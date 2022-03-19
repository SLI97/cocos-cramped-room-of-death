import { UITransform, _decorator } from 'cc'
import { ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enum'
import EventManager from '../../Runtime/EventManager'
import { IEntity } from '../../Levels'
import DataManager from '../../Runtime/DataManager'
import { EntityManager } from '../../Base/EntityManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../TIle/TileManager'
import { BurstStateMachine } from './BurstStateMachine'
const { ccclass } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    this.transform = this.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  onBurst() {
    //我都死了，别烦我了
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { targetX: playerX, targetY: playerY } = DataManager.Instance.player
    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
      //如果我裂开的时候你人在我上面，你直接狗带吧
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }
}
