import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum';
import { EntityManager } from '../Base/EntityManager';
const { ccclass } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  init() {
    super.init();
    this.x = 7;
    this.y = 6;
    this.direction = DIRECTION_ENUM.BOTTOM;
    this.state = ENTITY_STATE_ENUM.IDLE;
  }

  onDestroy() {
    super.onDestroy();
  }
}
