import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 50;
export const TILE_HEIGHT = 50;

@ccclass('TileManager')
export class TileManager extends Component {
  init(type: string, imgSrc: string, i: number, j: number) {
    const sprite = this.node.addComponent(Sprite);
    const transform = this.getComponent(UITransform);
    resources.load(`texture/bg/${imgSrc}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.error(err);
        return;
      }
      sprite.spriteFrame = spriteFrame;
      transform.width = TILE_WIDTH;
      transform.height = TILE_HEIGHT;
      this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    });
  }
}
