import { Layers, Node, SpriteFrame, UITransform, Vec2 } from 'cc'
import { parse } from '@typescript-eslint/parser'

/***
 * 生成指定长度随机uuid
 * @param n
 */
export const randomByLength = (n: number) => {
  let rnd = ''
  for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10)
  return rnd
}

/***
 * 生成指定范围随机数
 * @param start
 * @param end
 */
export const randomByRange = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start) + start)
}

/***
 * 是否是移动端
 */
export const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  return Agents.some(agent => userAgentInfo.indexOf(agent) > -1)
}

export const getUIMaskNumber = () => {
  return 1 << Layers.nameToLayer('UI_2D')
}

export const createUINode = (name: string = '') => {
  const node = new Node(name)
  node.layer = getUIMaskNumber()
  const transform = node.addComponent(UITransform)
  transform.anchorPoint = new Vec2(0, 1)
  return node
}

const INDEX_REG = /\((\d+)\)/

export const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) => {
  return spriteFrame.sort((a, b) => parseInt(a.name.match(INDEX_REG)[1]) - parseInt(b.name.match(INDEX_REG)[1]))
}
