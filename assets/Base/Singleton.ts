/***
 * 泛型单例模式接口
 */

export default class Singleton {
  private static _instance: any = null

  static GetInstance<T>(): T {
    if (this._instance === null) {
      this._instance = new this()
    }
    return this._instance
  }
}
