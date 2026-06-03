/**
 * Thuật toán SRS đơn giản: interval tăng theo cấp số nhân
 * 1 → 3 → 7 → 14 → 30 → 60 → 90 ngày
 *
 * @param {number} currentInterval - Khoảng cách hiện tại (ngày)
 * @param {string} quality - 'good' (nhớ) | 'again' (quên)
 * @returns {number} - Interval mới
 */

const INTERVALS = [1, 3, 7, 14, 30, 60, 90];

export function getNextInterval(currentInterval, quality) {
  const normalizedInterval = Number.isFinite(currentInterval) ? currentInterval : 0;

  if (quality === "again") {
    // “Quên” thì đưa bài về ôn ngay, không đẩy sang ngày mai.
    return normalizedInterval <= 1 ? 0 : 1;
  }

  if (normalizedInterval <= 0) {
    return INTERVALS[0];
  }

  const nextInterval = INTERVALS.find((interval) => interval > normalizedInterval);
  return nextInterval || INTERVALS[INTERVALS.length - 1];
}

/**
 * Tính ngày ôn tiếp theo từ timestamp
 * @param {number} interval - Số ngày
 * @param {number} fromDate - Timestamp bắt đầu
 * @returns {number} - Timestamp ngày ôn tiếp
 */
export function getNextDueDate(interval, fromDate = Date.now()) {
  return fromDate + interval * 24 * 60 * 60 * 1000;
}

/**
 * Kiểm tra 1 bài có đến hạn ôn không
 * @param {number} dueDate - Timestamp
 * @returns {boolean}
 */
export function isDue(dueDate) {
  return Date.now() >= dueDate;
}

/**
 * Tính số ngày còn lại đến khi ôn
 * @param {number} dueDate
 * @returns {number} - Số ngày (âm = quá hạn)
 */
export function daysUntil(dueDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - now) / (1000 * 60 * 60 * 24));
}

/**
 * Tính trạng thái hiển thị
 */
export function getDueLabel(dueDate) {
  const days = daysUntil(dueDate);
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Ngày mai";
  return `${days} ngày nữa`;
}

export default {
  getNextInterval,
  getNextDueDate,
  isDue,
  daysUntil,
  getDueLabel,
};
