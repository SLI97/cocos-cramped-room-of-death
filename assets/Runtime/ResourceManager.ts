import { __private, _decorator, Asset, Component, Node, resources, SpriteFrame } from 'cc'
import Singleton from '../Base/Singleton'
const { ccclass, property } = _decorator

@ccclass('ResourceManager')
export class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  loadRes(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame>((resolve, reject) => {
      resources.load<SpriteFrame>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir<SpriteFrame>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }
}
