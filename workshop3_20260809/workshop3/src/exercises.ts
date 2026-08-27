import {
    interval,
    from,
    of,
    range,
    last,
    map,
    merge,
    mergeMap,
    concatMap,
    scan,
    take,
    toArray,
    reduce,
    repeat,
    type Observable,
    fromEvent,
} from "rxjs";

// Stub value to indicate an implementation
export type IMPLEMENT_THIS_TYPE = any;
export const IMPLEMENT_THIS: IMPLEMENT_THIS_TYPE = undefined;

const ranks = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"] as const;
const suits = ["♠", "♣", "♦", "♥"] as const;

// use typeof to define string literal types
type Rank = (typeof ranks)[number]; // 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K'
type Suit = (typeof suits)[number]; // '♠' | '♥' | '♢' | '♡'

type Card = Readonly<{
    suit: Suit;
    rank: Rank;
}>;

const deckSize = ranks.length * suits.length;

/**
 * Exercise 1: Create a deck of cards over all suits and ranks dealt as a stream.
 * /Hint/: use `from` to create streams from the arrays and `concatMap` to combine them
 */
const deck$: Observable<Card> = from(ranks).pipe(
            concatMap(
                (r: Rank) => from(suits).pipe(
                    map((s: Suit) => { return { suit: s, rank: r} as Card} )
                )
            )
)
                
/**
 * An impure random number generator for use in shuffling
 * @param n random number range is [0,n]
 * @returns a random integer in the range [0,n]
 */
function impureRandomNumberGenerator(n: number) {
    return Math.floor(Math.random() * (n + 1)); // impure!!
}

/**
 * Exercise 2: Insert an element at a random position in an array
 * Use array.slice and spread (...) to insert the element
 * and impureRandomNumberGenerator to find the insertion point.
 */
const randomInsert: <T>(a: ReadonlyArray<T>, e: T) => ReadonlyArray<T> = <T>(a: ReadonlyArray<T>, e:T) => {
    // const randomPos = impureRandomNumberGenerator(a.length);
    // return [...a.slice(0, randomPos), e, ...a.slice(randomPos)];

    return (i => [...a.slice(0, i), e, ...a.slice(i)])(impureRandomNumberGenerator(a.length)); //IIFE

}

/**
 * A specific version of randomInsert for Card
 */
const shuffleInsert = randomInsert<Card>;

/**
 * Exercise 3: Create a shuffled shoe as a stream of `deckCount` decks of cards.
 *
 * /Hint/: use range, concatMap, reduce, and shuffleInsert above.
 * The final step in the pipe will be to convert the array back into a stream.  How?
 *
 * @param deckCount number of decks to put in the shoe
 * @returns a stream of shuffled Card
 */
const shoe$: (deckCount: number) => Observable<Card> = (deckCount: number) => {
    //const shuffledDeck = deck$.pipe(concatMap(() => shuffleInsert()))
    return range(deckCount).pipe(
        concatMap<number, Observable<Card>>(() => deck$),  //concats different strings?
            reduce<Card, ReadonlyArray<Card>>(shuffleInsert, []), //((acc, card) -> shuffleInsert(acc, card), [] as ReadonlyArray<Card>)
            mergeMap<ReadonlyArray<Card>, Observable<Card>>(x => from(x)),
    );

    // return range(deckCount).pipe(
    //     concatMap(_ => deck$),
    //     scan(shuffleInsert, [] as ReadonlyArray<Card>),
    //     last(),
    //     mergeMap(from),
    // );
}

/**
 * Use the following type and initialCount below in the count$ stream computation.
 */
type Count = Readonly<{
    card?: Card; // will be undefined before any cards are dealt
    runningCount: number;
    cardsDealt: number;
    trueCount?: number; // initially undefined and undefined when all decks are exhausted
}>;

/**
 * Exercise 4: for a given card being dealt and a previous Count, compute the new Count.
 *
 * Quote (The Card Counter 2022):
 * https://www.youtube.com/watch?v=av5qcPPRo7Q
 *    What separates Blackjack from other games is that it’s based on dependent
 *    events, meaning past affects the probability in the future. The house has a
 *    1.5 percent advantage. If a player knows the nature of the cards in the shoe
 *    he can turn the house advantage to himself. To do this he has to keep track
 *    of every card that is played. The count is based on a high low system. High
 *    cards, ten, jack, queen, king have a value of minus one. If they are
 *    depleted, player’s advantage goes down. The low cards, two, three, four,
 *    five, six have a value of plus one. The seven, eight and nine have no count
 *    value. The player keeps track of every card and calculates the running count.
 *    The Dealer distributes cards from the shoe. Then the player arrives at
 *    the true count, which is the running count divided by the decks remaining.
 *    For example, if the running count is plus nine and there are four and a half
 *    decks remaining, nine over four and a half gives you a true count of plus
 *    two. As true count increases, the player’s advantage increases. The idea is
 *    to bet little when you don’t have the advantage and proportionately more when
 *    you do.
 *
 * in other words:
 * cards rank 10-A decrement the count, cards 2-6 increment the count
 * true count is Math.floor(runningCount / decksRemaining)
 * where:
 *    cardsAvailable = deckCount * deckSize
 *    decksRemaining = (cardsAvailable - cardsDealt) / deckSize
 * @param deckCount assume the cardStream contains this many decks
 * @param a the previous Count
 * @param c the current Card
 * @returns the new Count
 */
const countCard: (deckCount: number) => (a: Count, c: Card) => Count =
    deckCount => (a, card) => {
        // do something here...
        return { card, runningCount:0, cardsDealt:0, trueCount: 0 };
    };

/**
 * Exercise 5: scan over specified stream of cards to compute the count.
 * 
 * @param deckCount assume the cardStream contains this many decks
 * @param cardStream stream of Card
 * @returns  a stream of the running Count stats
 */
const count$: (
    deckCount: number,
    cardStream: Observable<Card>,
) => Observable<Count> = (deckCount, cards$) => IMPLEMENT_THIS;


/**
 * Exercise 6: Deal and count cards from a shoe of the specified size.
 * 
 * @param number of decks in the shoe
 * @returns  a stream of Counts
 */
const deal$: (n: number) => Observable<Count> = IMPLEMENT_THIS

export { Card, count$, deck$, shoe$, deal$, deckSize, Count, randomInsert, countCard };
