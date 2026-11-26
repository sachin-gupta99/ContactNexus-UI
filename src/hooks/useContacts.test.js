import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { applyFavoriteOptimistically, contactKeys, restoreSnapshot } from "./useContacts";

const USER = 7;
const ann = { id: 1, firstName: "Ann", favorite: false };
const bob = { id: 2, firstName: "Bob", favorite: true };

const allKey = contactKeys.list(USER, { q: "", page: 0, size: 12, sort: "firstName,asc", favorite: false });
const favKey = contactKeys.list(USER, { q: "", page: 0, size: 12, sort: "firstName,asc", favorite: true });
const statsKey = contactKeys.stats(USER);

let qc;
beforeEach(() => {
  qc = new QueryClient();
  qc.setQueryData(allKey, { content: [ann, bob], totalElements: 2, totalPages: 1 });
  qc.setQueryData(favKey, { content: [bob], totalElements: 1, totalPages: 1 });
  qc.setQueryData(statsKey, { total: 2, favorites: 1, addedThisWeek: 2 });
});

describe("applyFavoriteOptimistically", () => {
  it("stars a contact in every list and bumps the favourites count", () => {
    applyFavoriteOptimistically(qc, USER, ann.id, true);
    expect(qc.getQueryData(allKey).content.find((c) => c.id === 1).favorite).toBe(true);
    expect(qc.getQueryData(statsKey).favorites).toBe(2);
    // Not added to the favourites list here; the refetch after the request does that.
    expect(qc.getQueryData(favKey).content).toEqual([bob]);
  });

  it("removes an unstarred contact from favourites-only lists and fixes the total", () => {
    applyFavoriteOptimistically(qc, USER, bob.id, false);
    expect(qc.getQueryData(favKey)).toMatchObject({ content: [], totalElements: 0 });
    expect(qc.getQueryData(allKey).content.find((c) => c.id === 2).favorite).toBe(false);
    expect(qc.getQueryData(allKey).totalElements).toBe(2);
    expect(qc.getQueryData(statsKey).favorites).toBe(0);
  });

  it("restores every list and the stats from the snapshot", () => {
    const before = { all: qc.getQueryData(allKey), fav: qc.getQueryData(favKey), stats: qc.getQueryData(statsKey) };
    const snapshot = applyFavoriteOptimistically(qc, USER, bob.id, false);
    restoreSnapshot(qc, USER, snapshot);
    expect(qc.getQueryData(allKey)).toEqual(before.all);
    expect(qc.getQueryData(favKey)).toEqual(before.fav);
    expect(qc.getQueryData(statsKey)).toEqual(before.stats);
  });

  it("leaves other users' cache entries alone", () => {
    const otherKey = contactKeys.list(99, { favorite: false });
    qc.setQueryData(otherKey, { content: [{ ...ann }], totalElements: 1 });
    applyFavoriteOptimistically(qc, USER, ann.id, true);
    expect(qc.getQueryData(otherKey).content[0].favorite).toBe(false);
  });

  it("is a no-op when the contact already has that state", () => {
    const before = qc.getQueryData(allKey);
    applyFavoriteOptimistically(qc, USER, bob.id, true);
    expect(qc.getQueryData(allKey)).toBe(before);
    expect(qc.getQueryData(statsKey).favorites).toBe(1);
  });
});
