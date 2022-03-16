/***
 * 生成指定长度随机uuid
 * @param n
 */
export const randomByLength = (n: number) => {
  let rnd = '';
  for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
  return rnd;
};

/***
 * 生成指定范围随机数
 * @param start
 * @param end
 */
export const randomByRange = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start) + start);
};

/***
 * 是否是移动端
 */
export const isMobile = () => {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  return Agents.some(agent => userAgentInfo.indexOf(agent) > -1);
};
