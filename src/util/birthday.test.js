import { describe, expect, it } from "vitest";
import { daysInMonth, describeInDays, formatBirthday, nextBirthday } from "./birthday";

describe("birthday helpers", () => {
  it("formats with and without a year", () => {
    expect(formatBirthday({ birthdayMonth: 12, birthdayDay: 25, birthdayYear: 1990 })).toBe("25 December 1990");
    expect(formatBirthday({ birthdayMonth: 12, birthdayDay: 25 })).toBe("25 December");
    expect(formatBirthday({})).toBeNull();
  });

  it("knows month lengths, allowing 29 Feb only when the year allows it", () => {
    expect(daysInMonth(4)).toBe(30);
    expect(daysInMonth(2)).toBe(29);
    expect(daysInMonth(2, 2023)).toBe(28);
    expect(daysInMonth(2, 2024)).toBe(29);
  });

  it("finds the next occurrence and the age then", () => {
    const today = new Date(2026, 10, 27); // 27 Nov 2026
    expect(nextBirthday({ birthdayMonth: 11, birthdayDay: 27, birthdayYear: 2000 }, today))
      .toMatchObject({ inDays: 0, turning: 26 });
    expect(nextBirthday({ birthdayMonth: 11, birthdayDay: 28 }, today)).toMatchObject({ inDays: 1, turning: null });
    expect(nextBirthday({ birthdayMonth: 1, birthdayDay: 3, birthdayYear: 1990 }, today))
      .toMatchObject({ inDays: 37, turning: 37 });
  });

  it("celebrates 29 Feb on the 28th in non-leap years", () => {
    const r = nextBirthday({ birthdayMonth: 2, birthdayDay: 29 }, new Date(2027, 0, 1));
    expect(r.date.getMonth()).toBe(1);
    expect(r.date.getDate()).toBe(28);
  });

  it("describes the distance", () => {
    expect([0, 1, 5].map(describeInDays)).toEqual(["today", "tomorrow", "in 5 days"]);
  });
});
