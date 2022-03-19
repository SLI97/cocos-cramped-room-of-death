import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { EntityManager } from '../../Base/EntityManager'
import DataManager from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import { IEntity } from '../../Levels'
import { WoodenSkeletonStateMachine } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonStateMachine'
const { ccclass } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  start() {
    this.onChangeDirection(true)
  }

  /***
   * 根据玩家在敌人的象限改变敌人的朝向
   */
  onChangeDirection(init = false) {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const disX = Math.abs(playerX - this.x)
    const disY = Math.abs(playerY - this.y)

    //确保敌人在初始化的时候调整一次direction
    if (disX === disY && !init) {
      return
    }

    //第一象限
    if (playerX >= this.x && playerY <= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP

      //第二象限
    } else if (playerX <= this.x && playerY <= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP

      //第三象限
    } else if (playerX <= this.x && playerY >= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM

      //第四象限
    } else if (playerX >= this.x && playerY >= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    }
  }

  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }

    const { targetX: playerX, targetY: playerY, state: playerState } = DataManager.Instance.player
    if (
      ((playerX === this.x && Math.abs(playerY - this.y) <= 1) ||
        (playerY === this.y && Math.abs(playerX - this.x) <= 1)) &&
      playerState !== ENTITY_STATE_ENUM.DEATH &&
      playerState !== ENTITY_STATE_ENUM.AIRDEATH
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
