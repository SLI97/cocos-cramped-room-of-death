import { Component, Sprite, UITransform, _decorator } from 'cc'
import StateMachine from '../../Base/StateMachine'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enum'
import { ISpikes } from '../../Levels'
import DataManager from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import { randomByLength } from '../../Utils'
import { TILE_HEIGHT, TILE_WIDTH } from '../TIle/TileManager'
import { SpikesStateMachine } from './SpikesStateMachine'

const { ccclass } = _decorator

@ccclass('SpikesManager')
export default class SpikesManager extends Component {
  id: string = randomByLength(12)
  _totalCount: number
  _count = 0
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  fsm: StateMachine

  get count() {
    return this._count
  }

  set count(newCount) {
    this._count = newCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
  }

  get totalCount() {
    return this._totalCount
  }

  set totalCount(newCount) {
    this._totalCount = newCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount)
  }

  async init(params: ISpikes) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.node.addComponent(SpikesStateMachine)
    await this.fsm.init()
    this.x = params.x
    this.y = params.y
    const type = params.type
    this.totalCount =
      SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[type as 'SPIKES_ONE' | 'SPIKES_TWO' | 'SPIKES_THREE' | 'SPIKES_FOUR']
    this.count = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
  }

  /***
   * 更新位置，把虚拟坐标（1,1）转为屏幕实际位置
   */
  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onLoop() {
    //达到最大值会在动画回调置0，当最大值时还没归零但人又触发移动，就让他变成1就好了
    if (this.count == this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }
    this.onAttack()
  }

  backZero() {
    this.count = 0
  }

  onAttack() {
    const { x: playerX, y: playerY } = DataManager.Instance.player
    if (playerX === this.x && playerY === this.y && this.count === this.totalCount) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }
}
