import { __private, _decorator, Asset, Component, Node, resources, SpriteFrame } from 'cc'
import Singleton from '../Base/Singleton'
const { ccclass, property } = _decorator

@ccclass('ResourceManager')
export class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  loadRes<T extends Asset = SpriteFrame>(
    path: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
    type?: __private._cocos_core_asset_manager_shared__AssetType<T> | null,
  ) {
    return new Promise<T>((resolve, reject) => {
      resources.load<T>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  loadDir<T extends Asset = SpriteFrame>(
    path: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
    type?: __private._cocos_core_asset_manager_shared__AssetType<T> | null,
  ) {
    return new Promise<T[]>((resolve, reject) => {
      resources.loadDir<T>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }
}
