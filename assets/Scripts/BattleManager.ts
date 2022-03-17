import { _decorator, Component, instantiate, Node, Prefab, view } from 'cc';
import DataManager from '../Runtime/DataManager';
import Levels, { ILevel } from '../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from './TileManager';
import { PlayerManager } from './PlayerManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../Enum';
import { WoodenSkeletonManager } from './WoodenSkeletonManager';

const { ccclass, property } = _decorator;

const size = view.getVisibleSize();
export const SCREEN_WIDTH = size.width;
export const SCREEN_HEIGHT = size.height;

// @ts-ignore
if (window.vConsole) {
  // @ts-ignore
  window.vConsole.$dom.style.display = 'none';
}

@ccclass('BattleManager')
export class BattleManager extends Component {
  @property(Node)
  stage: Node = null;

  @property(Prefab)
  tileMap: Prefab = null;

  @property(Prefab)
  player: Prefab = null;

  @property(Prefab)
  woodenSkeleton: Prefab = null;

  private level: ILevel;

  start() {
    // resources.preloadDir('texture', SpriteFrame);
    // setTimeout(() => {
    this.initLevel();
    // }, 1000);
  }

  initLevel() {
    const level = Levels['level' + DataManager.Instance.levelIndex];
    if (level) {
      this.clearLevel();
      //生成新关卡数据
      this.level = level;
      // //地图信息
      DataManager.Instance.mapInfo = this.level.mapInfo;
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0]?.length || 0;

      this.generateTileMap();
      this.generatePlayer();
      this.generateEnemies();
    }
  }

  clearLevel() {
    this.stage.destroyAllChildren();
  }

  generateTileMap() {
    const tileMap = instantiate(this.tileMap);
    tileMap.setParent(this.stage);
    this.adaptMapPos();
  }

  adaptMapPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 75;
    this.stage.setPosition(-disX, disY);
  }

  generatePlayer() {
    const player = instantiate(this.player);
    player.setParent(this.stage);
    const playerManager = player.getComponent(PlayerManager);
    playerManager.init({
      x: 2,
      y: 2,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER,
    });
    DataManager.Instance.player = playerManager;
  }

  generateEnemies() {
    const woodenSkeleton = instantiate(this.woodenSkeleton);
    woodenSkeleton.setParent(this.stage);
    const woodenSkeletonManager = woodenSkeleton.getComponent(WoodenSkeletonManager);
    woodenSkeletonManager.init({
      x: 6,
      y: 7,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
    });
    DataManager.Instance.enemies.push(woodenSkeletonManager);
  }

  nextLevel() {
    DataManager.Instance.levelIndex++;
    this.initLevel();
  }
}
