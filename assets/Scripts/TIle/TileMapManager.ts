import { _decorator, Component } from 'cc'
import DataManager from '../../Runtime/DataManager'
import { ResourceManager } from '../../Runtime/ResourceManager'
import { createUINode, randomByRange } from '../../Utils'
import { TileManager } from './TileManager'
const { ccclass } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const { mapInfo } = DataManager.Instance
    DataManager.Instance.tileInfo = []
    const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile/tile/')
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      DataManager.Instance.tileInfo[i] = []
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        if (item.src === null || item.type === null) {
          continue
        }

        //number为1、5、9的tile有多种图片，随机挑一张图来渲染
        //i%2和j%2仅仅是为了让随机的个数少一点，这样就保留更多的纯色砖块，地面看出来不会太突兀
        let number = item.src
        if (number === 1 && i % 2 === 0 && j % 2 === 1) {
          number += randomByRange(0, 4)
        } else if (number === 5 && i % 2 === 0 && j % 2 === 1) {
          number += randomByRange(0, 4)
        } else if (number === 9 && i % 2 === 0 && j % 2 === 1) {
          number += randomByRange(0, 4)
        }

        const imgSrc = `tile (${number})`
        const spriteFrame = spriteFrames.find(item => item.name === imgSrc) || spriteFrames[0]
        const type = item.type
        const tile = createUINode()
        const tileManager = tile.addComponent(TileManager)
        tileManager.init(type, spriteFrame, i, j)
        tile.setParent(this.node)
        DataManager.Instance.tileInfo[i][j] = tileManager
      }
    }
  }
}
