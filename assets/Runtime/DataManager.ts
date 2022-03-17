import Singleton from '../Base/Singleton';
// import TileManager from '../Scenes/Battle/GameObjects/Tile/TileManager';
import { ILevel, ITile } from '../Levels';
import { TileManager } from '../Scripts/TileManager';
import { PlayerManager } from '../Scripts/PlayerManager';
import { WoodenSkeletonManager } from '../Scripts/WoodenSkeletonManager';
// import PlayerManager from '../Scenes/Battle/GameObjects/Player/Scripts/PlayerManager';
// import EnemyManager from '../Base/EnemyManager';
// import DoorManager from '../Scenes/Battle/GameObjects/Door/Scripts/DoorManager';
// import SpikesManager from '../Scenes/Battle/GameObjects/Spikes/Scripts/SpikesManager';
// import BurstManager from '../Scenes/Battle/GameObjects/Burst/Scripts/BurstManager';
// import SmokeManager from '../Scenes/Battle/GameObjects/Smoke/Scripts/SmokeManager';

// export type IRecord = Omit<ILevel, 'mapInfo'>;

/**
 * 全局数据管理类
 */
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  player: PlayerManager;
  // enemies: EnemyManager[];
  enemies: WoodenSkeletonManager[];
  // spikes: SpikesManager[];
  // bursts: BurstManager[];
  // door: DoorManager;
  // smokes: SmokeManager[];
  mapRowCount: number;
  mapColumnCount: number;
  levelIndex: number = 1;
  // frame: number = 0;
  mapInfo: Array<Array<ITile>> = []; //关卡的描述数据
  tileInfo: Array<Array<TileManager>> = []; //实例化出来的tileManager实例
  // records: IRecord[]; //撤回数据za

  constructor() {
    super();
    this.reset();
  }

  reset() {
    //地图信息
    this.mapInfo = [];
    this.tileInfo = [];
    this.mapRowCount = 0;
    this.mapColumnCount = 0;
    //
    // //活动元素信息
    this.player = null;
    this.enemies = [];
    // this.spikes = [];
    // this.bursts = [];
    //
    // this.door = null;
    // this.smokes = [];
    //
    // this.records = [];
  }
}
