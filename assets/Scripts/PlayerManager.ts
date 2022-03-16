import { _decorator, animation, Component, UITransform } from 'cc';
import EventManager from '../Runtime/EventManager';
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../Enum';
import { TILE_HEIGHT, TILE_WIDTH } from './TileManager';

const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  private animator: animation.AnimationController;
  private transform: UITransform;
  private _state: ENTITY_STATE_ENUM;
  private _direction: DIRECTION_ENUM;

  private readonly speed = 1 / 10;
  x: number;
  y: number;
  targetX: number;
  targetY: number;

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
    this.animator.setValue(newState, true);
  }

  init() {
    this.x = 0;
    this.y = 0;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = DIRECTION_ENUM.TOP;
    this.state = ENTITY_STATE_ENUM.IDLE;
  }

  onLoad() {
    this.animator = this.getComponent(animation.AnimationController);
    this.transform = this.getComponent(UITransform);
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
  }

  start() {
    this.init();
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move);
  }

  update() {
    this.updateXY();
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
  }

  updateXY() {
    //逼近targetX
    if (this.targetX < this.x) {
      this.x -= this.speed;
    } else if (this.targetX > this.x) {
      this.x += this.speed;
    }

    //逼近targetY
    if (this.targetY < this.y) {
      this.y -= this.speed;
    } else if (this.targetY > this.y) {
      this.y += this.speed;
    }

    //两者近似就触发结束
    if (Math.abs(this.targetX - this.x) < 0.01 && Math.abs(this.targetY - this.y) < 0.01) {
      this.x = this.targetX;
      this.y = this.targetY;
      // this.isMoveing = false;
      // EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
    }
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY += 1;
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY -= 1;
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1;
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1;
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT;
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT;
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM;
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP;
      }
    } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT;
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT;
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP;
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM;
      }
    }
  }
}
