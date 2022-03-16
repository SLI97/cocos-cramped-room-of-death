import Singleton from '../Base/Singleton';

interface IItem {
  func: Function;
  ctx: unknown;
}

/***
 * 事件中心管理类（本质就是一张map，key是事件名称，value是对应事件的函数列表）
 */
export default class EventManager extends Singleton {
  static get Instance() {
    return super.GetInstance<EventManager>();
  }

  eventDic: Map<string, Array<IItem>> = new Map();

  on(event: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(event)) {
      this.eventDic.get(event).push({ func, ctx });
    } else {
      this.eventDic.set(event, [{ func, ctx }]);
    }
  }

  off(event: string, func: Function) {
    if (this.eventDic.has(event)) {
      const index = this.eventDic.get(event).findIndex(i => func === i.func);
      index > -1 && this.eventDic.get(event).splice(index, 1);
    }
  }

  emit(event: string, ...params: unknown[]) {
    if (this.eventDic.has(event)) {
      this.eventDic.get(event).forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, params) : func(...params);
      });
    }
  }

  clear() {
    this.eventDic.clear();
  }
}
