export const isTodayDone = (date) => {
  const today = new Date();
  const todoDate = new Date(date);

  return (
    today.getFullYear() === todoDate.getFullYear() &&
    today.getMonth() === todoDate.getMonth() &&
    today.getDate() === todoDate.getDate()
  );
};

export const getTodayTimestamp = () => {
  const now = new Date(); // 获取当前时间
  const year = now.getFullYear(); // 获取当前年份
  const month = now.getMonth(); // 获取当前月份（0-11）
  const date = now.getDate(); // 获取当前日期（1-31）
  const startOfDay = new Date(year, month, date, 0, 0, 0, 0); // 构造当天 0 点的时间
  return startOfDay.getTime(); // 获取时间戳
};
