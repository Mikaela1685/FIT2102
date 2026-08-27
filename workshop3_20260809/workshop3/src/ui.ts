import {
    concatMap,
    fromEvent,
    interval,
    map,
    mergeMap,
    reduce,
    scan,
    switchMap,
    tap,
    zip,
    zipWith,
    type Observable,
} from "rxjs";
import {
    Card,
    deal$,
    shoe$,
    deckSize,
    Count,
    IMPLEMENT_THIS,
} from "./exercises";

const button = document.getElementById("hit-me-button")!,
    cardDisplay = document.getElementById("card-display")!,
    countDisplay = document.getElementById("count-display")!,
    shoeSize = 5;

/**
 * Exercise 6: for the given stream of Count,
 * emit one every 500 milliseconds,
 * triggered by a button press.
 * /Hint/
 * there's more than one way to do it, but the following might be useful:
 *  fromEvent - create a stream of events, e.g. fromEvent(button, 'click')
 *  switchMap - like mergeMap (producing a flat stream), but each new substream ends and replaces the previous stream
 *  interval - emit a count at specified intervals (in milliseconds)
 *  zipWith - an operator to merge the stream of a with another stream of b, returning pairs [a,b]
 */
const hitme$: (_: Observable<Count>) => Observable<Count> = IMPLEMENT_THIS;

/*
 * Count the cards as they're dealt!
 * Display the deal and the count info
 */
hitme$(deal$(shoeSize)).subscribe(count => {
    if (count.card) {
        const cardColour = "♦♥".includes(count.card.suit) ? "red" : "black";
        cardDisplay.innerHTML = `Card dealt: ${count.cardsDealt}<br><span id="cardspan" style="color:${cardColour}">${count.card.suit}${count.card.rank}</span>`;
    }
    console.log(count.cardsDealt);
    if (count.cardsDealt === shoeSize * deckSize) return; // count is not sensible (NaN) when all cards are dealt

    const countColour = !count.trueCount
        ? "antiquewhite"
        : count.trueCount < 0
          ? "#93c5df"
          : "#f4a581"; // > 0
    countDisplay.innerHTML = `True count = <span style="color:${countColour}">${count.trueCount}</span>`;
    addBar(count, countColour);
});

/**
 * Adds a bar to the SVG chart for the given Count
 * Creates the SVG if this is the first card dealt
 * @param count
 * @param colour colour to use
 */
function addBar(count: Count, colour: string) {
    const chart = getSVG(count.cardsDealt === 1),
        chartBounds = chart.getBoundingClientRect(),
        bar = document.createElementNS(chart.namespaceURI, "rect"),
        height = count.trueCount ? 1 + Math.abs(count.trueCount) * 2 : 1,
        width = chartBounds.width / (shoeSize * deckSize),
        x = count.cardsDealt * width,
        yMid = chartBounds.height / 2,
        y = !count.trueCount
            ? yMid - 0.5
            : count.trueCount < 0
              ? yMid
              : yMid - height; // >0
    Object.entries({
        x: String(x),
        y: String(y),
        width: String(width),
        height: String(height),
        fill: colour,
    }).forEach(kv => bar.setAttribute(...kv));
    chart.appendChild(bar);
}

/**
 * replaces the old SVG with a new one.
 *
 * Exercise: what are the side effects of this function?
 * Write them here...
 *
 * @returns a new SVG replacing the old one
 */
function getSVG(refresh: boolean): SVGSVGElement {
    const existingSVG = document.getElementById("chart"),
        body = document.getElementsByTagName("body")[0];
    if (existingSVG) {
        if (refresh) {
            body.removeChild(existingSVG);
        } else {
            return (<unknown>existingSVG) as SVGSVGElement;
        }
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "chart");
    body.appendChild(svg);
    return svg;
}
