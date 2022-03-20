import { _decorator, Component, UITransform, Sprite } from 'cc'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { IEntity } from '../Levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/TIle/TileManager'
import { randomByLength } from '../Utils'
import StateMachine from './StateMachine'
const { ccclass } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  id: string = randomByLength(12)
  fsm: StateMachine

  protected transform: UITransform
  private _state: ENTITY_STATE_ENUM
  private _direction: DIRECTION_ENUM
  type: ENTITY_TYPE_ENUM

  x: number
  y: number

  get direction() {
    return this._direction
  }

  set direction(newDirection) {
    this._direction = newDirection
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state
  }

  set state(newState) {
    this._state = newState
    this.fsm.setParams(newState, true)
  }

  init(params: IEntity) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    this.transform = this.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    this.x = params.x
    this.y = params.y
    this.direction = params.direction
    this.state = params.state
  }

  onDestroy() {}

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
