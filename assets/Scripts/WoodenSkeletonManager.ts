import { _decorator, animation, Component, Node, UITransform } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import EventManager from '../Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from './TileManager';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends Component {
  private animator: animation.AnimationController;
  private transform: UITransform;
  private _state: ENTITY_STATE_ENUM;
  private _direction: DIRECTION_ENUM;

  x: number;
  y: number;

  get direction() {
    return this._direction;
  }

  set direction(newDirection) {
    this._direction = newDirection;
    this.animator.setValue(PARAMS_NAME_ENUM.DIRECTION.toLowerCase(), DIRECTION_ORDER_ENUM[this._direction]);
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
    this.animator.setValue(newState.toLowerCase(), true);
  }

  onLoad() {
    this.animator = this.getComponent(animation.AnimationController);
    this.transform = this.getComponent(UITransform);
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
  }

  init() {
    this.x = 7;
    this.y = 6;
    this.direction = DIRECTION_ENUM.BOTTOM;
    this.state = ENTITY_STATE_ENUM.IDLE;
  }

  start() {
    this.init();
  }

  onDestroy() {}

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
  }
}
