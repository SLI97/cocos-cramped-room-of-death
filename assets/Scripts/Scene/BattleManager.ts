import { _decorator, Component, Node, director } from 'cc'
import DataManager, { IRecord } from '../../Runtime/DataManager'
import Levels, { ILevel } from '../../Levels'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enum'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
import { createUINode } from '../../Utils'
import { TILE_HEIGHT, TILE_WIDTH } from '../TIle/TileManager'
import { PlayerManager } from '../Player/PlayerManager'
import { TileMapManager } from '../TIle/TileMapManager'
import { DoorManager } from '../Door/DoorManager'
import EventManager from '../../Runtime/EventManager'
import { BurstManager } from '../Burst/BurstManager'
import SpikesManager from '../Spikes/SpikesManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import FaderManager from '../../Runtime/FaderManager'
import { SmokeManager } from '../Smoke/SmokeManager'
import { ShakeManager } from '../Shake/ShakeManager'

const { ccclass } = _decorator

// @ts-ignore
window?.vConsole && (window.vConsole.$dom.style.display = 'none')

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel
  private stage: Node = null
  private smokeLayer: Node = null
  private hasInited = false //第一次从菜单进来的时候，入场fade效果不一样，特殊处理一下

  onLoad() {
    director.preloadScene(SCENE_ENUM.Start)
    DataManager.Instance.levelIndex = 1

    EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this)
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
    EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
    EventManager.Instance.on(EVENT_ENUM.QUIT_BATTLE, this.quitBattle, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel)
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
    EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    EventManager.Instance.off(EVENT_ENUM.QUIT_BATTLE, this.quitBattle)

    EventManager.Instance.clear()
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  async initLevel() {
    const level = Levels['level' + DataManager.Instance.levelIndex]
    if (level) {
      if (this.hasInited) {
        await FaderManager.Instance.fadeIn()
      } else {
        await FaderManager.Instance.mask()
      }

      this.clearLevel()
      //生成新关卡数据
      this.level = level
      // //地图信息
      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0]?.length || 0
      await Promise.all([
        this.generateTileMap(),
        this.generateBursts(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generateDoor(),
        this.generateEnemies(),
      ])
      await this.generatePlayer()
      await FaderManager.Instance.fadeOut()
      this.hasInited = true
    } else {
      this.quitBattle()
    }
  }

  quitBattle() {
    this.node.destroy()
    director.loadScene(SCENE_ENUM.Start)
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
    this.stage.setSiblingIndex(2)
    this.stage.addComponent(ShakeManager)
  }

  async generateTileMap() {
    const node = createUINode()
    node.setParent(this.stage)
    const tileMapManager = node.addComponent(TileMapManager)
    await tileMapManager.init()
    this.adaptMapPos()
  }

  adaptMapPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80
    this.stage.getComponent(ShakeManager).stop()
    this.stage.setPosition(-disX, disY)
  }

  async generatePlayer() {
    const node = createUINode()
    node.setParent(this.stage)
    const playerManager = node.addComponent(PlayerManager)

    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  async generateEnemies() {
    DataManager.Instance.enemies = []
    const promises = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promises.push(manager.init(enemy))
      DataManager.Instance.enemies.push(manager)
    }

    await Promise.all(promises)
  }

  async generateBursts() {
    const promises = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)
      const burstManager = node.addComponent(BurstManager)
      promises.push(burstManager.init(burst))
      DataManager.Instance.bursts.push(burstManager)
    }
    await Promise.all(promises)
  }

  async generateSpikes() {
    const promises = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spikes = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)
      const spikesManager = node.addComponent(SpikesManager)
      promises.push(spikesManager.init(spikes))
      DataManager.Instance.spikes.push(spikesManager)
    }
    await Promise.all(promises)
  }

  async generateDoor() {
    const node = createUINode()
    node.setParent(this.stage)
    const doorManager = node.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.Instance.door = doorManager
  }

  async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const item = DataManager.Instance.smokes.find((smoke: SmokeManager) => smoke.state === ENTITY_STATE_ENUM.DEATH)
    if (item) {
      item.x = x
      item.y = y
      item.node.setPosition(item.x * TILE_WIDTH - TILE_WIDTH * 1.5, -item.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
      item.direction = direction
      item.state = ENTITY_STATE_ENUM.IDLE
    } else {
      const node = createUINode()
      node.setParent(this.smokeLayer)
      const smokeManager = node.addComponent(SmokeManager)
      await smokeManager.init({
        x,
        y,
        direction,
        state: ENTITY_STATE_ENUM.IDLE,
        type: ENTITY_TYPE_ENUM.SMOKE,
      })
      DataManager.Instance.smokes.push(smokeManager)
    }
  }

  async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  /***
   * 检查玩家是否到达门的位置
   */
  checkArrived() {
    const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
    const { x: playerX, y: playerY } = DataManager.Instance.player
    if (doorX === playerX && doorY === playerY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }

  record() {
    const item: IRecord = {
      player: {
        x: DataManager.Instance.player.targetX,
        y: DataManager.Instance.player.targetY,
        state:
          DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
          DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ||
          DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
            ? DataManager.Instance.player.state
            : ENTITY_STATE_ENUM.IDLE,
        direction: DataManager.Instance.player.direction,
        type: DataManager.Instance.player.type,
      },
      door: {
        x: DataManager.Instance.door.x,
        y: DataManager.Instance.door.y,
        state: DataManager.Instance.door.state,
        direction: DataManager.Instance.door.direction,
        type: DataManager.Instance.door.type,
      },
      enemies: DataManager.Instance.enemies.map(({ x, y, state, direction, type }) => {
        return {
          x,
          y,
          state,
          direction,
          type,
        }
      }),
      spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => {
        return {
          x,
          y,
          count,
          type,
        }
      }),
      bursts: DataManager.Instance.bursts.map(({ x, y, state, direction, type }) => {
        return {
          x,
          y,
          state,
          direction,
          type,
        }
      }),
    }

    DataManager.Instance.records.push(item)
  }

  revoke() {
    const data = DataManager.Instance.records.pop()
    if (data) {
      DataManager.Instance.player.x = DataManager.Instance.player.targetX = data.player.x
      DataManager.Instance.player.y = DataManager.Instance.player.targetY = data.player.y
      DataManager.Instance.player.state = data.player.state
      DataManager.Instance.player.direction = data.player.direction

      for (let i = 0; i < data.enemies.length; i++) {
        const item = data.enemies[i]
        DataManager.Instance.enemies[i].x = item.x
        DataManager.Instance.enemies[i].y = item.y
        DataManager.Instance.enemies[i].state = item.state
        DataManager.Instance.enemies[i].direction = item.direction
      }

      for (let i = 0; i < data.spikes.length; i++) {
        const item = data.spikes[i]
        DataManager.Instance.spikes[i].x = item.x
        DataManager.Instance.spikes[i].y = item.y
        DataManager.Instance.spikes[i].count = item.count
      }

      for (let i = 0; i < data.bursts.length; i++) {
        const item = data.bursts[i]
        DataManager.Instance.bursts[i].x = item.x
        DataManager.Instance.bursts[i].y = item.y
        DataManager.Instance.bursts[i].state = item.state
      }

      DataManager.Instance.door.x = data.door.x
      DataManager.Instance.door.y = data.door.y
      DataManager.Instance.door.state = data.door.state
      DataManager.Instance.door.direction = data.door.direction
    } else {
      //TODO 播放游戏音频嘟嘟嘟
    }
  }
}
