import Singleton from '../Base/Singleton'
import { ILevel, ITile } from '../Levels'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { TileManager } from '../Scripts/TIle/TileManager'
import { DoorManager } from '../Scripts/Door/DoorManager'
import { EnemyManager } from '../Base/EnemyManager'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import SpikesManager from '../Scripts/Spikes/SpikesManager'
import { SmokeManager } from '../Scripts/Smoke/SmokeManager'

export type IRecord = Omit<ILevel, 'mapInfo'>

/**
 * 全局数据管理类
 */
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  player: PlayerManager
  enemies: EnemyManager[]
  spikes: SpikesManager[]
  bursts: BurstManager[]
  door: DoorManager
  smokes: SmokeManager[]
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1
  mapInfo: Array<Array<ITile>> = [] //关卡的描述数据
  tileInfo: Array<Array<TileManager>> = [] //实例化出来的tileManager实例
  records: IRecord[] //撤回数据za

  private constructor() {
    super()
    this.reset()
  }

  reset() {
    //地图信息
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0

    // //活动元素信息
    this.player = null
    this.enemies = []
    this.spikes = []
    this.bursts = []
    this.door = null
    this.smokes = []

    this.records = []
  }
}
