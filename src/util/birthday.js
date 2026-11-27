export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Days in a month; without a year February allows the 29th. */
export const daysInMonth = (month, year) => {
  if (!month) return 31;
  if (month === 2) return year ? (isLeap(year) ? 29 : 28) : 29;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

/** "25 December 1990" or "25 December" when the year isn't known. */
export const formatBirthday = (c) => {
  if (!c?.birthdayMonth || !c?.birthdayDay) return null;
  const base = `${c.birthdayDay} ${MONTHS[c.birthdayMonth - 1]}`;
  return c.birthdayYear ? `${base} ${c.birthdayYear}` : base;
};

/**
 * Days until the next birthday (0 = today) and the age then, if the year is known.
 * 29 February is celebrated on the 28th in non-leap years, matching the server.
 */
export const nextBirthday = (c, today = new Date()) => {
  if (!c?.birthdayMonth || !c?.birthdayDay) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const on = (year) => {
    const day = c.birthdayMonth === 2 && c.birthdayDay === 29 && !isLeap(year) ? 28 : c.birthdayDay;
    return new Date(year, c.birthdayMonth - 1, day);
  };
  let date = on(start.getFullYear());
  if (date < start) date = on(start.getFullYear() + 1);
  const inDays = Math.round((date - start) / 86_400_000);
  const turning = c.birthdayYear ? date.getFullYear() - c.birthdayYear : null;
  return { date, inDays, turning };
};

export const describeInDays = (n) => (n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`);
