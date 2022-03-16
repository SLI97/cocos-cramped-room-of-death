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
import DataManager from '../Runtime/DataManager';

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
    this.animator.setValue(newState.toLowerCase(), true);
  }

  init() {
    this.x = 2;
    this.y = 8;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = DIRECTION_ENUM.TOP;
    this.state = ENTITY_STATE_ENUM.IDLE;
  }

  onLoad() {
    this.animator = this.getComponent(animation.AnimationController);
    this.transform = this.getComponent(UITransform);
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputProcess, this);
  }

  start() {
    this.init();
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputProcess);
  }

  update() {
    this.updateXY();
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
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

  inputProcess(inputDirection: CONTROLLER_ENUM) {
    if (this.willBlock(inputDirection)) {
      return;
    }
    this.move(inputDirection);
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1;
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1;
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
      this.state = ENTITY_STATE_ENUM.TURNLEFT;
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
      this.state = ENTITY_STATE_ENUM.TURNRIGHT;
    }
  }

  willBlock(type: CONTROLLER_ENUM) {
    const { targetX: x, targetY: y, direction } = this;
    const { tileInfo: tileInfo } = DataManager.Instance;
    // const enemies: EnemyManager[] = DataManager.Instance.enemies.filter(
    //   (enemy: EnemyManager) => enemy.state !== ENTITY_STATE_ENUM.DEATH,
    // );
    // const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door;
    // const bursts: BurstManager[] = DataManager.Instance.bursts.filter(
    //   (burst: BurstManager) => burst.state !== ENTITY_STATE_ENUM.DEATH,
    // );

    const { mapRowCount: row, mapColumnCount: column } = DataManager.Instance;

    //按钮方向——向上
    if (type === CONTROLLER_ENUM.TOP) {
      const playerNextY = y - 1;

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          return true;
        }

        const weaponNextY = y - 2;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[x]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //   return true;
        // }

        //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === weaponNextY) || (enemyX === x && enemyY === playerNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          return true;
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          return true;
        }

        const weaponNextY = y;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[x]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if (enemyX === x && enemyY === playerNextY) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          return true;
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          return true;
        }

        const weaponNextX = x - 1;
        const weaponNextY = y - 1;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          return true;
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          return true;
        }

        const weaponNextX = x + 1;
        const weaponNextY = y - 1;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //     return true;
        //   }
        // }

        //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          return true;
        }
      }

      //按钮方向——向下
    } else if (type === CONTROLLER_ENUM.BOTTOM) {
      const playerNextY = y + 1;

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;

          return true;
        }

        const weaponNextY = y;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[x]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if (enemyX === x && enemyY === playerNextY) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //     return true;
        //   }
        // }

        //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          return true;
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;

          return true;
        }

        const weaponNextY = y + 2;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[x]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //   return true;
        // }

        //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === weaponNextY) || (enemyX === x && enemyY === playerNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          return true;
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;

          return true;
        }

        const weaponNextX = x - 1;
        const weaponNextY = y + 1;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          return true;
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;

          return true;
        }

        const weaponNextX = x + 1;
        const weaponNextY = y + 1;
        const nextPlayerTile = tileInfo[x]?.[playerNextY];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          return true;
        }
      }

      //按钮方向——向左
    } else if (type === CONTROLLER_ENUM.LEFT) {
      const playerNextX = x - 1;

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;

          return true;
        }

        const weaponNextX = x - 1;
        const weaponNextY = y - 1;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          return true;
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;

          return true;
        }

        const weaponNextX = x - 1;
        const weaponNextY = y + 1;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          return true;
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;

          return true;
        }

        const weaponNextX = x - 2;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[y];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === y)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          return true;
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;

          return true;
        }

        const weaponNextX = x;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[y];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if (enemyX === playerNextX && enemyY === y) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          return true;
        }
      }

      //按钮方向——向右
    } else if (type === CONTROLLER_ENUM.RIGHT) {
      const playerNextX = x + 1;

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;

          return true;
        }

        const weaponNextX = x + 1;
        const weaponNextY = y - 1;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          return true;
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;

          return true;
        }

        const weaponNextX = x + 1;
        const weaponNextY = y + 1;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          return true;
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;

          return true;
        }

        const weaponNextX = x;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[y];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if (enemyX === playerNextX && enemyY === y) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKBACK;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          return true;
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;

          return true;
        }

        const weaponNextX = x + 2;
        const nextPlayerTile = tileInfo[playerNextX]?.[y];
        const nextWeaponTile = tileInfo[weaponNextX]?.[y];

        //判断门
        // if (
        //   ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
        //   doorState !== ENTITY_STATE_ENUM.DEATH
        // ) {
        //   this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //   return true;
        // }
        //
        // //判断敌人
        // for (let i = 0; i < enemies.length; i++) {
        //   const enemy = enemies[i];
        //   const { x: enemyX, y: enemyY } = enemy;
        //
        //   if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === y)) {
        //     this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
        //     return true;
        //   }
        // }
        //
        // //判断地裂陷阱
        // if (
        //   bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
        //   (!nextWeaponTile || nextWeaponTile.turnable)
        // ) {
        //   return false;
        // }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          return true;
        }
      }

      //按钮方向——左转
    } else if (type === CONTROLLER_ENUM.TURNLEFT) {
      let nextY, nextX;
      if (direction === DIRECTION_ENUM.TOP) {
        //朝上左转的话，左上角三个tile都必须turnable为true，并且没有敌人
        nextY = y - 1;
        nextX = x - 1;
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextY = y + 1;
        nextX = x + 1;
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y + 1;
        nextX = x - 1;
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y - 1;
        nextX = x + 1;
      }

      //判断门
      // if (
      //   ((doorX === x && doorY === nextY) ||
      //     (doorX === nextX && doorY === y) ||
      //     (doorX === nextX && doorY === nextY)) &&
      //   doorState !== ENTITY_STATE_ENUM.DEATH
      // ) {
      //   this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
      //   return true;
      // }
      //
      // //判断敌人
      // for (let i = 0; i < enemies.length; i++) {
      //   const enemy = enemies[i];
      //   const { x: enemyX, y: enemyY } = enemy;
      //
      //   if (enemyX === nextX && enemyY === y) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
      //
      //     return true;
      //   } else if (enemyX === nextX && enemyY === nextY) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
      //
      //     return true;
      //   } else if (enemyX === x && enemyY === nextY) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
      //
      //     return true;
      //   }
      // }

      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
        return true;
      }

      //按钮方向——右转
    } else if (type === CONTROLLER_ENUM.TURNRIGHT) {
      let nextX, nextY;
      if (direction === DIRECTION_ENUM.TOP) {
        //朝上右转的话，右上角三个tile都必须turnable为true
        nextY = y - 1;
        nextX = x + 1;
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextY = y + 1;
        nextX = x - 1;
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y - 1;
        nextX = x - 1;
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y + 1;
        nextX = x + 1;
      }

      //判断门
      // if (
      //   ((doorX === x && doorY === nextY) ||
      //     (doorX === nextX && doorY === y) ||
      //     (doorX === nextX && doorY === nextY)) &&
      //   doorState !== ENTITY_STATE_ENUM.DEATH
      // ) {
      //   this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
      //   return true;
      // }
      //
      // //判断敌人
      // for (let i = 0; i < enemies.length; i++) {
      //   const enemy = enemies[i];
      //   const { x: enemyX, y: enemyY } = enemy;
      //
      //   if (enemyX === nextX && enemyY === y) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
      //
      //     return true;
      //   } else if (enemyX === nextX && enemyY === nextY) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
      //
      //     return true;
      //   } else if (enemyX === x && enemyY === nextY) {
      //     this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
      //
      //     return true;
      //   }
      // }

      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
        return true;
      }
    }

    return false;
  }
}
