# Problem 2 – Fancy Currency Swap Form

## Overview

This project implements a **currency swap form UI** that allows users to simulate swapping one crypto asset for another using real-time price data.

The solution is built with **React + Vite + TypeScript** and styled using **Tailwind CSS v4**, with a strong focus on usability, visual clarity, and predictable input handling.

---

## Tech Stack

- React (Hooks)
- Vite
- TypeScript
- Tailwind CSS v4
- Fetch API

---

## Features

- Currency swap simulation (from → to)
- Real-time exchange rate calculation
- Searchable and scrollable custom token dropdown
- Controlled numeric input suitable for financial values
- Token icons loaded dynamically
- Simulated async swap confirmation
- Input validation and error handling
- Responsive, mobile-friendly UI

---

## Price Data & Exchange Logic

Token prices are fetched from: [https://interview.switcheo.com/prices.json]

Each token price represents the **USD value of one unit of that token**.

## Exchange Rate Formula

- rate = toTokenPrice / fromTokenPrice
- outputAmount = inputAmount × rate

## Assumptions

- Token prices are trusted and provided externally
- Tokens without price data are omitted
- Swap behavior is simulated only (no real transactions)
- Precision up to 6 decimal places is sufficient

## Notes

The provided static HTML/CSS template was intentionally disregarded, as permitted by the task instructions, in favor of a modern React-based architecture that better demonstrates frontend development and UI design skills.
