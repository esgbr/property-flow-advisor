
/**
 * Utility functions for financing calculations
 */
import { PaymentScheduleEntry } from '@/interfaces/financing';

/**
 * Calculate the monthly payment for a loan
 * 
 * @param principal The loan amount
 * @param annualInterestRate Annual interest rate as a decimal (e.g., 3.5% = 0.035)
 * @param termInYears The loan term in years
 * @returns The monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualInterestRate: number,
  termInYears: number
): number {
  // Convert annual interest rate to monthly and decimal
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termInYears * 12;
  
  // Calculate monthly payment using the loan formula
  if (monthlyInterestRate === 0) {
    // Simple division for 0% interest loans
    return principal / numberOfPayments;
  }
  
  const payment = 
    (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
  return Number(payment.toFixed(2));
}

/**
 * Generate a complete amortization/payment schedule for a loan
 * 
 * @param principal The loan amount
 * @param annualInterestRate Annual interest rate as a percentage (e.g., 3.5)
 * @param termInYears The loan term in years
 * @param startDate The date of the first payment
 * @param additionalPayments Optional array of additional payments
 * @returns Array of payment schedule entries
 */
export function generatePaymentSchedule(
  principal: number,
  annualInterestRate: number,
  termInYears: number,
  startDate: Date,
  additionalPayments: {paymentNumber: number, amount: number}[] = []
): PaymentScheduleEntry[] {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termInYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termInYears);
  
  const schedule: PaymentScheduleEntry[] = [];
  let balance = principal;
  let paymentDate = new Date(startDate);
  
  for (let paymentNumber = 1; paymentNumber <= numberOfPayments && balance > 0; paymentNumber++) {
    // Calculate interest for this period
    const interestPayment = balance * monthlyInterestRate;
    
    // Find any additional payment for this period
    const additionalPayment = additionalPayments.find(p => p.paymentNumber === paymentNumber)?.amount || 0;
    
    // Calculate principal portion of the payment
    let principalPayment = monthlyPayment - interestPayment + additionalPayment;
    
    // Adjust if we're paying more than the balance
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    
    // Update the remaining balance
    balance = balance - principalPayment;
    
    // Calculate total payment
    const totalPayment = principalPayment + interestPayment;
    
    // Add entry to schedule
    schedule.push({
      date: new Date(paymentDate).toISOString(),
      paymentNumber,
      totalPayment: Number(totalPayment.toFixed(2)),
      principalPayment: Number(principalPayment.toFixed(2)),
      interestPayment: Number(interestPayment.toFixed(2)),
      remainingBalance: Number(balance.toFixed(2)),
      additionalPayment: additionalPayment > 0 ? additionalPayment : undefined
    });
    
    // Increment date by 1 month for next payment
    paymentDate.setMonth(paymentDate.getMonth() + 1);
    
    // If balance is very small (less than 1 cent), consider it paid off
    if (balance < 0.01) {
      balance = 0;
    }
  }
  
  return schedule;
}

/**
 * Calculate the total cost of a loan over its lifetime
 * 
 * @param principal The loan amount
 * @param monthlyPayment The monthly payment amount
 * @param termInYears The loan term in years
 * @returns The total cost of the loan
 */
export function calculateTotalLoanCost(
  principal: number,
  monthlyPayment: number,
  termInYears: number
): number {
  const totalPayments = monthlyPayment * termInYears * 12;
  return Number(totalPayments.toFixed(2));
}

/**
 * Calculate the total interest paid over the life of the loan
 * 
 * @param principal The loan amount
 * @param monthlyPayment The monthly payment amount
 * @param termInYears The loan term in years
 * @returns The total interest paid
 */
export function calculateTotalInterestPaid(
  principal: number,
  monthlyPayment: number,
  termInYears: number
): number {
  const totalPayments = monthlyPayment * termInYears * 12;
  const totalInterest = totalPayments - principal;
  return Number(totalInterest.toFixed(2));
}

/**
 * Calculate loan-to-value ratio
 * 
 * @param loanAmount The loan amount
 * @param propertyValue The property value
 * @returns The loan-to-value ratio as a percentage
 */
export function calculateLoanToValueRatio(
  loanAmount: number,
  propertyValue: number
): number {
  if (propertyValue <= 0) return 0;
  return Number(((loanAmount / propertyValue) * 100).toFixed(2));
}

/**
 * Calculate the equity in a property
 * 
 * @param propertyValue Current property value
 * @param loanBalance Remaining loan balance
 * @returns The equity amount
 */
export function calculateEquity(
  propertyValue: number,
  loanBalance: number
): number {
  return Number((propertyValue - loanBalance).toFixed(2));
}

/**
 * Calculate the break-even point for a property investment
 * 
 * @param downPayment Initial investment (down payment)
 * @param annualCashFlow Annual cash flow from the property
 * @returns The number of years to break even
 */
export function calculateBreakEvenPoint(
  downPayment: number,
  annualCashFlow: number
): number | 'negative cash flow' {
  if (annualCashFlow <= 0) return 'negative cash flow';
  return Number((downPayment / annualCashFlow).toFixed(2));
}
