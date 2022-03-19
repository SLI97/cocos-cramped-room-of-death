import { Color, Component, game, Graphics, RenderRoot2D, view } from 'cc'
import Singleton from '../Base/Singleton'
import { createUINode } from 'db://assets/Utils'
import { DrawManager } from 'db://assets/Scripts/UI/DrawManager'

export default class FaderManager extends Singleton {
  private fader: DrawManager
  private constructor() {
    super()

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const node = createUINode()
    node.setParent(root)
    this.fader = node.addComponent(DrawManager)
    this.fader.init()
    game.addPersistRootNode(root)
  }

  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  async fadeIn() {
    await this.fader.fadeIn()
  }

  async fadeOut() {
    await this.fader.fadeOut()
  }

  async mask() {
    await this.fader.mask()
  }
}
