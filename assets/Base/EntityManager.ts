import { _decorator, animation, Component, Node, UITransform } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/TileManager';
import { IEntity } from '../Levels';
const { ccclass, property } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
  private controller: animation.AnimationController;
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
    this.controller.setValue(PARAMS_NAME_ENUM.DIRECTION.toLowerCase(), DIRECTION_ORDER_ENUM[this._direction]);
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
    this.controller.setValue(newState.toLowerCase(), true);
  }

  init(params: IEntity) {
    this.controller = this.getComponent(animation.AnimationController);
    this.transform = this.getComponent(UITransform);
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
    this.x = params.x;
    this.y = params.y;
    this.direction = params.direction;
    this.state = params.state;
  }

  onDestroy() {}

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
  }
}
