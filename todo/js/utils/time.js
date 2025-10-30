export const isTodayDone = (date) => {
  const today = new Date();
  const todoDate = new Date(date);

  return (
    today.getFullYear() === todoDate.getFullYear() &&
    today.getMonth() === todoDate.getMonth() &&
    today.getDate() === todoDate.getDate()
  );
};

export const timeTransformer = (timestamp, format = "yyyy-mm-dd") => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formattedDate = format
    .replace("yyyy", year)
    .replace("mm", month.toString().padStart(2, "0"))
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("hh", hour.toString().padStart(2, "0"))
    .replace("mm", minute.toString().padStart(2, "0"))
    .replace("ss", second.toString().padStart(2, "0"));

  return formattedDate;
};

export const getTodayTimestamp = () => {
  const now = new Date(); // 获取当前时间
  const year = now.getFullYear(); // 获取当前年份
  const month = now.getMonth(); // 获取当前月份（0-11）
  const date = now.getDate(); // 获取当前日期（1-31）
  const startOfDay = new Date(year, month, date, 0, 0, 0, 0); // 构造当天 0 点的时间
  return startOfDay.getTime(); // 获取时间戳
};

/**
 * 获取当前月份初的时间戳
 * @param {Date} timestamp 时间戳
 * @returns {number} 当前月份初的时间戳
 */
export const getMonthTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
};

/**
 * 获取当前日期初的时间戳
 * @param {Date} timestamp 时间戳
 * @returns {number} 当前日期初的时间戳
 */
export const getDateTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
};

/**
 * 获取当前时间戳的星期几
 * @param {Date} timestamp 时间戳
 * @returns {number} 星期几（0-6，0表示星期日）
 */
export const getDay = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDay();
};

export const getDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDate();
};
