import { expect } from "chai";
import { Observable, from, interval, map, take, zip } from "rxjs";
import { createRngStreamFromSource } from "../src/main.ts";
import "mocha";

mocha.setup("bdd");

describe("exercise_1_suite", () => {
    describe("createRngStreamFromSource", () => {
        it("is a curried function", () => {
            expect(createRngStreamFromSource).is.a("function");
            expect(createRngStreamFromSource(interval())).is.a("function");
        });
    });

    describe("createRngStream", () => {
        it("creates an Observable stream", () => {
            const createRngStream = createRngStreamFromSource(interval());

            expect(createRngStream).to.not.throw();
            expect(createRngStream()).to.be.an.instanceof(Observable);
        });

        it("returns a stream with values in the range [-1, 1]", done => {
            const inf = {
                [Symbol.iterator]: function* () {
                    while (true) yield true;
                },
            };
            const infiniteStream = from(inf);

            const createRngStream = createRngStreamFromSource(infiniteStream);
            createRngStream()
                .pipe(
                    take(500),
                    map(x => {
                        if (typeof x !== "number") {
                            throw new Error(`Expected ${x} to be a number`);
                        }
                        if (x < -1 || x > 1) {
                            throw new Error(
                                `Expected ${x} to be in range [-1, 1]`,
                            );
                        }
                        return x;
                    }),
                )
                .subscribe({
                    error: expect.fail,
                    complete: done,
                });
        });

        /** Regression test */
        it("returns a stream with with correct values", done => {
            const inf = {
                [Symbol.iterator]: function* () {
                    while (true) yield true;
                },
            };
            const infiniteStream = from(inf);

            const createRngStream = createRngStreamFromSource(infiniteStream);
            const sequence = [
                0.16461517995438313, 0.039637327678332834, 0.8298795231757126,
                0.397431135828342, 0.5061624057153997,
            ] as const;

            zip(
                // Prevents infinite stream zipping
                createRngStream(42).pipe(take(sequence.length)),
                // Zips with index
                from(sequence),
            )
                .pipe(
                    map(([x, v]) => {
                        if (x.toFixed(3) !== v.toFixed(3)) {
                            throw new Error(`Expected ${x} to equal ${v}`);
                        }
                        return x;
                    }),
                )
                .subscribe({
                    error: expect.fail,
                    complete: done,
                });
        });
    });
});
