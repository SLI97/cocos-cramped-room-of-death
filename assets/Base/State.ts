import { Animation, animation, AnimationClip, resources, Sprite, SpriteFrame } from 'cc'
import { ResourceManager } from '../Runtime/ResourceManager'

export const ANIMATION_SPEED = 1000 / 8

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State {
  constructor(public animationComponent: Animation, public spriteFrameDir: string, public times?: number) {
    // resources.load(`texture/bg/${`bg (${1})`}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
    //   if (err) {
    //     console.error(err)
    //     return
    //   }
    //   track.channel.curve.assignSorted([[0.1, spriteFrame]])
    //   // sprite.spriteFrame = spriteFrame
    //   // transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    //   // this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
    //   animationClip.addTrack(track)
    //   console.log(animationClip.name)
    //   this.animationComponent.defaultClip = animationClip
    //   this.animationComponent.play()
    // })
    this.init()
  }

  async init() {
    //生成动画轨道属性
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const res = await ResourceManager.Instance.loadDir(this.spriteFrameDir, SpriteFrame)
    track.channel.curve.assignSorted(res.map(item => [0.1, item]))

    //动画添加轨道
    const animationClip = new AnimationClip()
    animationClip.addTrack(track)
    this.animationComponent.defaultClip = animationClip
    this.animationComponent.play()
  }

  run() {
    this.animationComponent.play()
  }
}
