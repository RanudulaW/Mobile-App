import { Person, Expense } from '@/store/useExpenseStore';

/**
 * Calculates equal splits for a given amount among a list of person IDs.
 * Handles rounding by distributing any remainder cents to the first few people.
 */
export function calculateEqualSplits(amount: number, personIds: string[]): Record<string, number> {
  const splits: Record<string, number> = {};
  if (personIds.length === 0 || amount <= 0) return splits;

  // Convert to cents to avoid floating point precision issues
  const totalCents = Math.round(amount * 100);
  const baseShareCents = Math.floor(totalCents / personIds.length);
  let remainderCents = totalCents - (baseShareCents * personIds.length);

  personIds.forEach((id) => {
    let shareCents = baseShareCents;
    if (remainderCents > 0) {
      shareCents += 1;
      remainderCents -= 1;
    }
    splits[id] = shareCents / 100;
  });

  return splits;
}

/**
 * Calculates the net balance for each person.
 * Positive balance means they are owed money (creditor).
 * Negative balance means they owe money (debtor).
 */
export function calculateBalances(persons: Person[], expenses: Expense[]): Record<string, number> {
  const balances: Record<string, number> = {};
  
  // Initialize all to 0
  persons.forEach(p => {
    balances[p.id] = 0;
  });

  // Calculate based on expenses
  expenses.forEach(expense => {
    // The payer gets credited the full amount
    if (balances[expense.payerId] !== undefined) {
      balances[expense.payerId] += expense.amount;
    }

    // Each person involved gets debited their split
    Object.entries(expense.splits).forEach(([personId, shareAmount]) => {
      if (balances[personId] !== undefined) {
        balances[personId] -= shareAmount;
      }
    });
  });

  // Round balances to 2 decimal places to avoid floating point artifacts
  Object.keys(balances).forEach(id => {
    balances[id] = Math.round(balances[id] * 100) / 100;
  });

  return balances;
}

export type Settlement = {
  from: string; // ID of person paying
  to: string;   // ID of person receiving
  amount: number;
};

/**
 * Calculates the minimum number of transactions needed to settle all balances.
 * Uses a greedy algorithm matching the largest debtors with the largest creditors.
 */
export function calculateSettlements(balances: Record<string, number>): Settlement[] {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  // Separate into debtors and creditors
  Object.entries(balances).forEach(([id, balance]) => {
    if (balance < -0.005) {
      debtors.push({ id, amount: Math.abs(balance) });
    } else if (balance > 0.005) {
      creditors.push({ id, amount: balance });
    }
  });

  const settlements: Settlement[] = [];

  // Greedy match
  while (debtors.length > 0 && creditors.length > 0) {
    // Sort so we always pick the largest debt and largest credit
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const debtor = debtors[0];
    const creditor = creditors[0];

    // The amount to settle is the minimum of the debt and credit
    const amountToSettle = Math.min(debtor.amount, creditor.amount);

    // Round the settled amount
    const roundedAmount = Math.round(amountToSettle * 100) / 100;

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount: roundedAmount,
    });

    // Update the remaining amounts
    debtor.amount -= roundedAmount;
    creditor.amount -= roundedAmount;

    // Remove from array if fully settled (using small epsilon for floating point issues)
    if (debtor.amount < 0.005) {
      debtors.shift();
    }
    if (creditor.amount < 0.005) {
      creditors.shift();
    }
  }

  return settlements;
}
