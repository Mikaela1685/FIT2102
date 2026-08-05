const stripComments = src =>
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

const usesArrayMethods = fn => {
    const src = stripComments(fn.toString());
    return [".map", ".filter", ".reduce"].some(method => src.includes(method));
};

const usesLoop = fn => {
    const src = stripComments(fn.toString());
    return /\b(for|while|do)\s*[({]/.test(src);
};

describe("exercise_1_suite", function () {
    describe("firstConst", function () {
        it("Create an un-reassignable variable called firstConst and initialise its value to 1.", function () {
            expect(firstConst).to.equal(1);
        });
        it("Since firstConst is immutable it will throw an error at runtime if I try to change it.", function () {
            try {
                firstConst = 3;
            } catch (e) {
                console.log(e.message);
                expect(e.name).to.equal("TypeError");
            }
            expect(firstConst).to.equal(1);
        });
    });
    describe("secondConst", function () {
        it("Then create another un-reassignable variable called secondConst and initialise its value to firstConst + 1.", function () {
            expect(secondConst).to.equal(firstConst + 1);
        });
        it("Since secondConst is immutable it will throw an error at runtime if I try to change it.", function () {
            try {
                secondConst = 3;
            } catch (e) {
                console.log(e.message);
                expect(e.name).to.equal("TypeError");
            }
            expect(secondConst).to.equal(firstConst + 1);
        });
    });
});

describe("exercise_2_suite", function () {
    describe("aFunction", function () {
        it("aFunction exists and is a function", function () {
            expect(aFunction).is.a("function");
        });
        it("aFunction is declared with the function keyword", function () {
            expect(aFunction.toString()).to.match(/^function\s+aFunction/);
        });
        it("invoking aFunction should return the value of 4", function () {
            expect(aFunction()).to.equal(4);
        });
    });
    describe("anonymousFunction", function () {
        it("anonymousFunction exists and is a function", function () {
            expect(anonymousFunction).is.a("function");
        });
        it("anonymousFunction is declared using an anonymous function expression", function () {
            expect(anonymousFunction.toString()).to.match(/^function\s*\(/);
        });
        it("invoking anonymousFunction should return the value of 4", function () {
            expect(anonymousFunction()).to.equal(4);
        });
    });
    describe("arrowFunction", function () {
        it("arrowFunction exists and is a function", function () {
            expect(arrowFunction).is.a("function");
        });
        it("arrowFunction is an arrow function", function () {
            expect(arrowFunction.toString()).to.include("=>");
            expect(arrowFunction.toString()).to.not.match(/^function\b/);
        });
        it("invoking arrowFunction should return the value of 4", function () {
            expect(arrowFunction()).to.equal(4);
        });
    });
});

describe("exercise_3_suite", function () {
    describe("constraints", function () {
        it("uses no loops and no built-in base conversion", function () {
            const src = stripComments(
                decimalToBinaryAcc.toString() + decimalToBinary.toString(),
            );
            expect(
                usesLoop(decimalToBinaryAcc) || usesLoop(decimalToBinary),
                "no loops allowed",
            ).to.equal(false);
            expect(
                src.includes(".toString"),
                "convert manually, not via toString(2)",
            ).to.equal(false);
        });
        it("decimalToBinary delegates to decimalToBinaryAcc", function () {
            expect(decimalToBinary.toString()).to.include("decimalToBinaryAcc");
        });
        it("handles powers of two (catches append-instead-of-prepend bugs)", function () {
            expect(decimalToBinary(8)).to.equal("1000");
            expect(decimalToBinaryAcc(6, "")).to.equal("110");
        });
    });

    describe("`decimalToBinaryAcc`", function () {
        it("exists", function () {
            expect(decimalToBinaryAcc).is.a("function");
        });
        it("returns accumulator when n is 0", function () {
            expect(decimalToBinaryAcc(0, "101")).to.equal("101");
        });
        it("builds binary correctly", function () {
            expect(decimalToBinaryAcc(1, "")).to.equal("1");
            expect(decimalToBinaryAcc(2, "")).to.equal("10");
            expect(decimalToBinaryAcc(5, "")).to.equal("101");
        });
    });

    describe("`decimalToBinary`", function () {
        it("exists", function () {
            expect(decimalToBinary).is.a("function");
        });
        it("handles zero correctly", function () {
            expect(decimalToBinary(0)).to.equal("0");
        });
        it("converts small numbers correctly", function () {
            expect(decimalToBinary(1)).to.equal("1");
            expect(decimalToBinary(2)).to.equal("10");
            expect(decimalToBinary(3)).to.equal("11");
            expect(decimalToBinary(5)).to.equal("101");
            expect(decimalToBinary(11)).to.equal("1011");
        });
        it("converts larger numbers correctly", function () {
            expect(decimalToBinary(16)).to.equal("10000");
            expect(decimalToBinary(31)).to.equal("11111");
            expect(decimalToBinary(1000)).to.equal("1111101000");
        });
    });
});
describe("exercise_4_suite", function () {
    describe("Function `printArray`", function () {
        it("exists", function () {
            expect(printArray).is.a("function");
        });
        it("prints each element with console.log", function () {
            const logged = [];
            const original = console.log;
            console.log = (...args) => logged.push(args[0]);
            try {
                printArray([7, 8, 9]);
            } finally {
                console.log = original;
            }
            expect(logged).to.deep.equal([7, 8, 9]);
        });
        it("returns undefined", function () {
            expect(printArray([])).to.be.undefined;
            expect(printArray([1, 2, 3])).to.be.undefined;
            expect(printArray([5])).to.be.undefined;
        });
    });

    describe("Function `addOne`", function () {
        it("exists", function () {
            expect(addOne).is.a("function");
        });
        it("adds one to the input", function () {
            const data = [
                [1, 2, 3],
                [1],
                [],
                [-1, 0, 1],
                [5, 5, 5, 5, 5, 5, 5],
            ];
            expect(data.map(addOne)).to.deep.equal([
                [2, 3, 4],
                [2],
                [],
                [0, 1, 2],
                [6, 6, 6, 6, 6, 6, 6],
            ]);
        });
    });

    describe("Function `removeOnes`", function () {
        it("exists", function () {
            expect(removeOnes).is.a("function");
        });
        it("removes ones", function () {
            expect(removeOnes([1, 2, 3, 1, 1, 2])).to.deep.equal([2, 3, 2]);
        });
        it("ignores non-ones", function () {
            expect(removeOnes([2, 3, 4, 5])).to.deep.equal([2, 3, 4, 5]);
        });
        it("removeOnes handles empty and all-ones arrays", function () {
            expect(removeOnes([])).to.deep.equal([]);
            expect(removeOnes([1, 1, 1])).to.deep.equal([]);
        });
    });

    describe("Function `sumArray`", function () {
        it("exists", function () {
            expect(sumArray).is.a("function");
        });
        it("sums arrays", function () {
            const data = [
                [1, 2, 3],
                [1],
                [],
                [-1, 0, 1],
                [5, 5, 5, 5, 5, 5, 5],
            ];
            expect(data.map(sumArray)).to.deep.equal([6, 1, 0, 0, 35]);
        });
    });
});

describe("exercise_5_suite", function () {
    describe("Function `multiplyArray`", function () {
        it("exists", function () {
            expect(multiplyArray).is.a("function");
        });

        it("uses array methods and not for loop", function () {
            expect(usesArrayMethods(multiplyArray)).to.equal(true);
            expect(usesLoop(multiplyArray)).to.equal(false);
        });

        it("multiplies each element in the array by the given number", function () {
            expect(multiplyArray(2, [1, 2, 3])).to.deep.equal([2, 4, 6]);
            expect(multiplyArray(0, [1, 2, 3])).to.deep.equal([0, 0, 0]);
            expect(multiplyArray(-1, [1, -2, 3])).to.deep.equal([-1, 2, -3]);
        });
    });

    describe("Function `filterEvenNumbers`", function () {
        it("exists", function () {
            expect(filterEvenNumbers).is.a("function");
        });

        it("uses array methods and not for loop", function () {
            expect(usesArrayMethods(filterEvenNumbers)).to.equal(true);
            expect(usesLoop(filterEvenNumbers)).to.equal(false);
        });

        it("filters out odd numbers and keeps even numbers", function () {
            expect(filterEvenNumbers([1, 2, 3, 4])).to.deep.equal([2, 4]);
            expect(filterEvenNumbers([1, 3, 5, 7])).to.deep.equal([]);
            expect(filterEvenNumbers([2, 4, 6, 8])).to.deep.equal([2, 4, 6, 8]);
        });
    });

    describe("Function `findMax`", function () {
        it("exists", function () {
            expect(findMax).is.a("function");
        });

        it("uses array methods and not for loop", function () {
            expect(usesArrayMethods(findMax)).to.equal(true);
            expect(usesLoop(findMax)).to.equal(false);
        });

        it("finds the maximum value in the array", function () {
            expect(findMax([1, 2, 3, 4])).to.equal(4);
            expect(findMax([-1, -2, -3, -4])).to.equal(-1);
            expect(findMax([100, 200, 300, 400])).to.equal(400);
        });
    });

    describe("Function `tripleAndFilterOdds`", function () {
        it("exists", function () {
            expect(tripleAndFilterOdds).is.a("function");
        });

        it("uses array methods and not for loop", function () {
            expect(usesArrayMethods(tripleAndFilterOdds)).to.equal(true);
            expect(usesLoop(tripleAndFilterOdds)).to.equal(false);
        });

        it("triples each element and filters out even results", function () {
            expect(tripleAndFilterOdds([1, 2, 3, 4])).to.deep.equal([3, 9]);
            expect(tripleAndFilterOdds([1, 3, 5])).to.deep.equal([3, 9, 15]);
            expect(tripleAndFilterOdds([2, 4, 6])).to.deep.equal([]);
        });
    });

    describe("Function `countOddNumbers`", function () {
        it("exists", function () {
            expect(countOddNumbers).is.a("function");
        });

        it("uses array methods and not for loop", function () {
            expect(usesArrayMethods(countOddNumbers)).to.equal(true);
            expect(usesLoop(countOddNumbers)).to.equal(false);
        });

        it("counts the number of odd numbers in the array", function () {
            expect(countOddNumbers([1, 2, 3, 4, 5])).to.equal(3);
            expect(countOddNumbers([2, 4, 6, 8, 10])).to.equal(0);
            expect(countOddNumbers([1, 3, 5, 7, 9])).to.equal(5);
            expect(countOddNumbers([])).to.equal(0);
            expect(countOddNumbers([0, 1, 2, 3, 4, 5])).to.equal(3);
            expect(countOddNumbers([11, 22, 33, 44, 55])).to.equal(3);
        });
    });
});

describe("exercise_6_suite", function () {
    describe("constraints", function () {
        it("uses array methods, not loops", function () {
            expect(usesLoop(range)).to.equal(false);
            expect(usesLoop(projectEulerProblem1)).to.equal(false);
        });
    });

    describe("Function `range`", function () {
        it("exists", function () {
            expect(range).is.a("function");
        });
        it("produces the correct array", function () {
            const r = range(5);
            expect(r).to.eql([0, 1, 2, 3, 4]);
        });
        it("handles the zero case", function () {
            const r = range(0);
            expect(r).to.eql([]);
        });
        it("handles n = 1", function () {
            expect(range(1)).to.eql([0]);
        });
    });

    describe("Project Euler Problem 1 function `projectEulerProblem1`", function () {
        it("exists", function () {
            expect(projectEulerProblem1).is.a("function");
        });
        it("produces the correct value", function () {
            const r = projectEulerProblem1();
            expect(r).to.equal(233168);
        });
    });
});

describe("exercise_7_suite", function () {
    const list = () => cons(1, cons(2, cons(3, cons(4, cons(5, null)))));
    const f = (h, r) => (r ? [h, ...r(f)] : [h]);

    describe("function `cons`", function () {
        it("exists", function () {
            expect(cons).is.a("function");
        });
        it("creates a list", function () {
            expect(list).to.not.throw();
            const data = list()(f);
            expect(data).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("stores values correctly", function () {
            expect(
                cons(1, null),
                "expected cons(1, null) to return a selector function",
            ).is.a("function");
            cons(
                1,
                2,
            )((head, rest) => {
                expect(
                    head,
                    "cons isn't properly storing the head in the closure",
                ).to.equal(1);
                expect(
                    rest,
                    "cons isn't properly storing the rest in the closure",
                ).to.equal(2);
            });
        });
    });

    describe("function `head`", function () {
        it("exists", function () {
            expect(head).is.a("function");
        });
        it("extracts the value of the cons list", function () {
            expect(head(list())).to.equal(1);
        });
        it("extracts the value of a single-node list", function () {
            expect(head(cons(42, null))).to.equal(42);
        });
    });

    describe("function `rest`", function () {
        it("exists", function () {
            expect(rest).is.a("function");
        });
        it("extracts the rest of the cons list", function () {
            expect(rest(cons(1, null))).is.equal(null);
            expect(
                head(rest(list())),
                "Expected head of list returned by rest to be 2",
            ).to.equal(2);
            expect(head(rest(rest(list())))).to.equal(3);
        });
    });
});

describe("exercise_8_suite", function () {
    const list = () => cons(1, cons(2, cons(3, cons(4, null))));
    const f = (h, r) => (r ? [h, ...r(f)] : [h]);

    describe("function `map`", function () {
        it("exists", function () {
            expect(map).is.a("function");
        });
        it("can be used to add one", function () {
            expect(map(x => x + 1, list())(f)).to.deep.equal(
                list()(f).map(x => x + 1),
            );
        });
        it("preserves list length and order", function () {
            expect(map(x => x * 10, list())(f)).to.deep.equal([10, 20, 30, 40]);
        });
    });

    describe("function `reduce`", function () {
        it("exists", function () {
            expect(reduce).is.a("function");
        });
        it("can be used to calculate a sum", function () {
            expect(reduce((acc, x) => acc + x, 0, list())).to.equal(10);
        });
        it("reduces in the correct order from left to right", function () {
            expect(reduce((acc, x) => x - acc, 0, list())).to.equal(2);
        });
    });

    describe("function `filter`", function () {
        it("exists", function () {
            expect(filter).is.a("function");
        });

        it("can be used to remove odd numbers", function () {
            expect(filter(x => x % 2 === 0, list())(f)).to.deep.equal(
                list()(f).filter(x => x % 2 === 0),
            );
        });
        it("returns null when every value is rejected", function () {
            expect(filter(x => x > 100, list())).to.equal(null);
        });
        it("keeps everything when every value is accepted", function () {
            expect(filter(() => true, list())(f)).to.deep.equal([1, 2, 3, 4]);
        });
    });
});
