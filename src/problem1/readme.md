# Problem 1 – Summation to N

## Problem

Implement a function that returns the summation of integers from 1 to `n`.

## Implementations

### 1. Iterative Loop (sum_to_n_a)

A straightforward approach using a for-loop to accumulate the sum.

- Time Complexity: O(n)
- Space Complexity: O(1)

### 2. Array + Reduce (sum_to_n_b)

Uses JavaScript array utilities to demonstrate a functional approach.

- Time Complexity: O(n)
- Space Complexity: O(n)
- Trade-off: Less memory efficient but expressive.

### 3. Mathematical Formula (sum_to_n_b)

I used the knowledge of the arithmetic series.

- Time Complexity: O(1)
- Space Complexity: O(1)
- Trade-off: Most efficient but relies on mathematical insight/knowledge.

## Assumptions

- `n` is a positive integer.
- The result will always be within `Number.MAX_SAFE_INTEGER`, as stated in the problem.
