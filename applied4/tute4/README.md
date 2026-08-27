---
title: Week 4 Exercises
---

This week will consist of creating a random number stream and developing a single interactive simulation: a jumping dot game,
where you'll apply what you've learned about RxJS to handle user input,
state updates, randomness, and rendering.

## Random Number Stream

In this exercise, you'll create a stream of random numbers in the range [-1, 1].
We already provided helper functions to produce pseudo-random numbers (via a hash), including a helper function `scale` which will help you with scaling down the generated random numbers.
The `scale` function takes in a hashed value using `hash` and scales it
to the range [-1, 1].

## Jumping Dot

In this exercise, you'll build a simple physics-based game where a dot jumps
when the spacebar is pressed. The jump is affected by gravity and randomized
strength. You'll use observable streams to manage user input, physics updates,
and game state in a reactive way.

We’ve provided a skeleton project and several utility functions to help you
focus on building the core RxJS pipelines.
