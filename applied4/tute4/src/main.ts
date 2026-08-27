import "./style.css";

import {
    filter,
    fromEvent,
    interval,
    map,
    merge,
    scan,
    startWith,
    switchAll,
    switchMap,
    type Observable,
} from "rxjs";

/**
 * Constants defining game physics and RNG seed
 */
const Constants = {
    GRAVITY: 1,
    GROUND: 378.5,
    SEED: 1234,
};

// Stub value to indicate an implementation
const IMPLEMENT_THIS: any = []; // this is an array so that merge(IMPLEMENT_THIS) doesn't make the test cases look weird on firefox
type IMPLEMENT_THIS = any;

/**
 * A random number generator which provides two pure functions
 * `hash` and `scale`. Call `hash` repeatedly to generate the
 * sequence of hashes.
 */
abstract class RNG {
    private static m = 0x80000000; // 2^31
    private static a = 1103515245;
    private static c = 12345;

    public static hash = (seed: number): number =>
        (RNG.a * seed + RNG.c) % RNG.m;

    public static scale = (hash: number): number =>
        (2 * hash) / (RNG.m - 1) - 1; // in [-1, 1]
}

/*****************************************************************
 * Exercise 1
 *
 * Create rng helper functions using the functions in RNG. We at least want a function that
 * creates an observable stream that represents a stream of random
 * numbers. The numbers in the range [-1, 1].
 *
 * /Hint/: An RNG stream will need to accumulate state to produce a stream of random values.
 *
 * /Hint 2/: VXNlIHNjYW4=
 *
 * /Challenge/: Implement this using a lazy sequence of random numbers.
 * It is interesting and more generally useful than just a stream.
 * Ask your tutor if you're not sure where to start.
 */

/**
 * Converts values in a stream to random numbers in the range [-1, 1]
 *
 * This usually would be implemented as an RxJS operator, but that is currently
 * beyond the scope of this course.
 *
 * @param source$ The source Observable, elements of this are replaced with random numbers
 * @param seed The seed for the random number generator
 */
export function createRngStreamFromSource<T>(source$: Observable<T>) {
    return function createRngStream(
        seed: number = 0,
    ): Observable<number> {
        const randomNumberStream = source$.pipe(scan((acc: number, _) : number => acc = RNG.hash(acc), seed),
                                                map(hash => RNG.scale(hash))); 
        //pseudo randomness formula -> Xn+1 = (aXn+b) mod m
        return randomNumberStream;
    };
}

const main = () => {
    // The state of the game should include at least:
    // - vertical position of dot
    // - vertical velocity of dot
    // - number of bounces
    type State = {verticalPosition: number, verticalVelocity: number, bounces: number};

    const initialState: State = {verticalPosition: 0, verticalVelocity: 0, bounces: 0};

    /*****************************************************************
     * Exercise 2 — Create the jump stream
     *
     * Use `fromEvent(document, 'keydown')` to listen for Space key presses.
     * Filter the stream so only the Space key triggers jumps.
     *
     * For now, each jump should emit a **fixed** velocity upward (e.g. -10),
     *
     * This should produce a stream of (state) => newState functions.
     *****************************************************************/
    /*
    const jump$: Observable<(s: State) => State> = fromEvent<KeyboardEvent>(
        document,
        "keydown",
    ).pipe(filter(({ code }) => code === "Space"), map((_: any) => (s: State) : State => {return {...s, verticalVelocity: - 10}}));
    */

    const spaceKey$ = fromEvent<KeyboardEvent>(
        document,
        "keydown"
    ).pipe(filter(({ code }) => code === "Space"));


    const jump$: Observable<(s: State) => State> = createRngStreamFromSource(spaceKey$) (Constants.SEED)
    .pipe(map((rndmNum: number) => (s: State) : State => {return {...s, verticalVelocity: ((rndmNum * 4)-16)}})) //range [-32, -12] for [-12,-6] use *3)-9
 


    /*****************************************************************
     * Exercise 3 — Create the tick stream
     *
     * Use `interval(20)` to simulate time passing (50fps). 
     * On each tick:
     * - Add gravity to vertical velocity
     * - Update vertical position, ensuring the dot does not fall below the ground. 
     * - Update the counter for number of bounces
     *
     * Output should be a function: (state) => newState
     *****************************************************************/
    const tick$: Observable<(s: State) => State> = interval(20).pipe(
        map(_ => (s: State) : State => 
            {   const newVelocity = s.verticalVelocity + Constants.GRAVITY;
                const newPosition = s.verticalPosition + s.verticalVelocity;
                const newBounce = newPosition >= Constants.GROUND;   

                return {    verticalPosition: newPosition < Constants.GROUND ? newPosition : Constants.GROUND,
                            verticalVelocity: newBounce ? -newVelocity *0.7 : newVelocity,
                            bounces: newBounce ? s.bounces + 1 : s.bounces}}), 
    ); 

    /***************************************************** ************
     * Exercise 4 — Create the game state stream
     *
     * Combine the `jump$` and `tick$` streams using `merge`.
     * Use `scan` to apply each state transformer function to the state.
     * Start from `initialState`.
     * 
     * This stream will represent the full evolution of game state over time.
     *****************************************************************/
    /*
    const state$: Observable<State> = merge(jump$, tick$).pipe(
        scan((state: State, reducerFn: ((s: State) => State)) => reducerFn(state), initialState)
    );
    */

    const state$ = fromEvent<KeyboardEvent>(
        document,
        "keydown"
    ).pipe(
        filter(({ code }) => code === "KeyR"), 
        startWith(null),
        switchMap(() => merge(jump$, tick$)
            .pipe(
                    scan((state: State, reducerFn: ((s: State) => State)) => 
                    reducerFn(state), initialState)
            )
        )
    );
    /*****************************************************************
     * Exercise 5 — Render to the DOM
     *
     * On each new state
     *    - update the dot's `style.top` to match the y position of the dot
     *    - update the bounce counter
     * This is the only part of your code that should perform side effects.
     *****************************************************************/
    const dot = document.getElementById("dot") as HTMLElement;
    const bounceCounter = document.getElementById("numBounces") as HTMLElement;

    state$.subscribe((state: State) => {
        dot.style.top = `${state.verticalPosition}px`;
        bounceCounter.textContent = String(state.bounces);
    });

    /*****************************************************************
     * Exercise 6 — Add Random Jump Strength
     *
     * Replace the fixed jump velocity with a random one using a stream of
     * random numbers generated each time the dot jumps.
     *
     * Tips:
     * - Convert the number in [-1, 1] to a jump strength (e.g. in [-12, -6])
     * - Edits should be done throughout the code.
     *****************************************************************/

    /*****************************************************************
     * Exercise 7 — Full game restart using `switchMap`
     *
     * Use `switchMap` to reset the entire game logic whenever the "R" key is pressed.
     *
     *
     * Tips:
     * - Create a `restart$` stream from "keydown" events filtered for "KeyR"
     * - Make sure you restart the bounce counter!
     * - Use `startWith(null)` to trigger the game loop on first load
     * - Edits should be done throughout the code.
     *****************************************************************/
};
if (typeof window !== "undefined") {
    window.addEventListener("load", main);
}
