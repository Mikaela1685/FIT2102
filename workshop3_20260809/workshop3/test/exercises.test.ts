import { beforeAll, describe, expect, it } from "vitest";
import { toArray, reduce, from, zip, lastValueFrom, range } from "rxjs";
import { deck$, deckSize, shoe$, count$, randomInsert, deal$, Card, countCard, Count } from "../src/exercises";
import { testShoeCount } from "./practiceDeck";

describe("Exercise 1: deck$", () => {
    const count = reduce(n => n + 1, 0);
    it("Deck has 52 cards", async () => {
        const r = await lastValueFrom(deck$.pipe(count));
        expect(r).toBe(deckSize);
    });
});

describe("Exercise 2: randomInsert", () => {
    const size = 1000;
    async function getResults() {
        const array = await lastValueFrom(range(size).pipe(toArray()));
        const shuffled = array.reduce(randomInsert<number>, []);
        const posns = array
            .map(_ => randomInsert([1, 2], 3))
            .map(t => t.indexOf(3))
            .reduce((s, e) => s.add(e), new Set());
        return { array, shuffled, posns };
    }
    it("shuffled array is different to input array", async () => {
        const { array, shuffled } = await getResults();
        expect(shuffled).to.not.deep.equal(array);
    });
    it("sorted shuffled array is same as input array", async () => {
        const { array, shuffled } = await getResults();
        expect(shuffled.slice().sort((a, b) => a - b)).to.deep.equal(array);
    });
    it("random inserts into every position", async () => {
        const { posns } = await getResults();
        expect(posns.size).to.equal(3);
    });
});

describe("Exercise 3: shoe$", () => {
    const count = reduce(n => n + 1, 0);
    it("Shoe has deckCount*52 cards", async () => {
        const deckCount = 6;
        const r = await lastValueFrom(shoe$(deckCount).pipe(count));
        expect(r).toBe(deckCount * deckSize);
    });
});

describe("Exercise 4: countCard", () => {
    const count = countCard(1), init:Count = { runningCount:3, cardsDealt: 6 },
        low:Card = { suit: "♠", rank: "2" },
        med:Card =  { suit: "♦", rank: "8" },
        high:Card = { suit: "♣", rank: "K" };
    it("low card increments count", () => {
        expect(count(init, low).runningCount).toBe(init.runningCount + 1);
        expect(count(init, low).trueCount).toBe(4);
        expect(count(init, low).cardsDealt).toBe(init.cardsDealt + 1);
        expect(count(init, low).card).toBe(low);
    });
    it("medium card doesn't change count", () => 
        expect(count(init, med).runningCount).toBe(init.runningCount));
    it("high card decrements count", () => 
        expect(count(init, high).runningCount).toBe(init.runningCount - 1));
    it("when no decks remaining trueCount is undefined", () => {
        const empty = countCard(0);
        expect(empty(init, high).trueCount).toBe(undefined);
    })
});

describe("Exercise 5: count$", () => 
    it("Count works as expected on baseline deck", async () => {
        const r = await lastValueFrom(
            zip(
                count$(
                    Math.floor(testShoeCount.length / 52),
                    from(testShoeCount.map(c => c.card)),
                ),
                from(testShoeCount.map(c => c.trueCount)),
            ).pipe(toArray()),
        );
        r.forEach(([r, e]) => expect(r.trueCount).toBe(e));
    }));

describe("Exercise 6: deal$", () => {
    const deckCount = 4;
    async function getResults() {
        const all = await lastValueFrom(deal$(deckCount).pipe(toArray()));
        const lastCount = all[all.length - 1];
        return { all, lastCount };
    }
    it("emits n*deckSize counts and ends with runningCount 0 and trueCount undefined", async () => {
        const { all } = await getResults();
        expect(all.length).to.equal(deckCount * deckSize);
    })
    it("final Count.cardsDealt includes all cards", async () => {
        const { lastCount } = await getResults();
        expect(lastCount.cardsDealt).to.equal(deckCount * deckSize);
    })
    it("final Count.runningCount is 0", async () => {
        const { lastCount } = await getResults();
        expect(lastCount.runningCount).to.equal(0);
    })
    it("final trueCount is undefined", async () => {
        const { lastCount } = await getResults();
        expect(lastCount.trueCount).to.be.undefined;
    })
});