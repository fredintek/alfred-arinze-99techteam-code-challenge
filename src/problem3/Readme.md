# Problem 3: Messy React Refactoring

## Overview

This file outlines the identification of computational inefficiencies, logical bugs, and React anti-patterns found in the provided React + TypeScript code snippet, followed by a refactored, optimized version of the component.

## Identified Issues & Anti-Patterns

### 1. Insecure Typing (`any`)

- **Issue:** The `getPriority` function used `any` for the `blockchain` parameter.
- **Impact:** Defeats the purpose of TypeScript, allows invalid values, and removes type safety.
- **Fix:** Replaced with a strict `Blockchain` union type and a mapping object.

### 2. Function Re-creation

- **Issue:** `getPriority` was defined inside the component body.
- **Impact:** The function is recreated on every render, preventing effective memoization and causing unnecessary overhead.
- **Fix:** Moved the function outside the component to ensure it is referentially stable.

### 3. Logic Errors & Undefined Variables

- **Issue:** The filter logic referenced `lhsPriority`, which was never defined in the original scope.
- **Impact:** This will actually cause immediate runtime crash.

### 4. Incorrect Filter Logic

- **Issue:** The original logic `if (balance.amount <= 0) return true;` included zero and negative balances.
- **Impact:** Displays empty or negative wallets, which is usually unintended for a user interface.
- **Fix:** Explicitly filtered for `balance.amount > 0`.

### 5. State Mutation via `.sort()`

- **Issue:** The code called `.sort()` directly on the `balances` array.
- **Impact:** In JavaScript, `sort()` mutates the original array. Mutating React state or props directly leads to unpredictable UI behavior and breaks the principle of immutability.
- **Fix:** Cloned the array using the spread operator `[...balances]` before sorting.

### 6. Suboptimal `useMemo` Dependencies

- **Issue:** The dependency array included `prices`, but `prices` was not used inside the memoized block (in the original code).
- **Fix:** Aligned dependencies with actual variable usage and ensured derived values (like USD value) are calculated inside the memo.

### 7. Fragile React Keys

- **Issue:** Used `key={index}` for rendering list items.
- **Impact:** Breaks React’s reconciliation process during list reordering or filtering, leading to potential performance hits and state bugs.
- **Fix:** Used `balance.currency` as a stable, unique key.

## Refactored Solution

The following implementation resolves the issues above by consolidating transformations, enforcing type safety, and ensuring referential stability.

```tsx
import React, { useMemo } from "react";

// --- Types ---

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

// --- Constants & Helpers ---

const PRIORITY_MAP: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: Blockchain): number => {
  return PRIORITY_MAP[blockchain] ?? -99;
};

// --- Component ---

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return [...balances]
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
        usdValue: (prices[balance.currency] || 0) * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          key={balance.currency}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
```
