/**
 * Documentation for the Calculator App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const calculatorDocs: AppDocumentation = {
  id: 'calculator',
  name: 'Calculator',
  icon: '🔢',
  description: 'A simple calculator for basic arithmetic operations.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Calculator',
          slug: 'introduction',
          content: `Calculator is a simple, easy-to-use application for performing basic arithmetic operations.

## Key Features

- **Basic Operations**: Addition, subtraction, multiplication, and division
- **Decimal Support**: Work with decimal numbers
- **Clear Display**: See your current calculation and result
- **Operation History**: View the previous value and current operation

## Interface

The Calculator has two main areas:

1. **Display**: Shows the current number and operation
2. **Keypad**: Buttons for numbers and operations

## Getting Started

Click the 🔢 icon in your dock to open Calculator. Start entering numbers and operations to perform calculations.
`,
        },
      ],
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      order: 2,
      entries: [
        {
          id: 'basic-operations',
          title: 'Basic Operations',
          slug: 'basic-operations',
          content: `Learn how to perform calculations with the Calculator app.

## Performing Calculations

### Addition
1. Enter the first number
2. Click **+**
3. Enter the second number
4. Click **=** to see the result

### Subtraction
1. Enter the first number
2. Click **-**
3. Enter the second number
4. Click **=**

### Multiplication
1. Enter the first number
2. Click **×**
3. Enter the second number
4. Click **=**

### Division
1. Enter the first number
2. Click **÷**
3. Enter the second number
4. Click **=**

## Example Calculation

To calculate \`25 + 17\`:

\`\`\`
1. Click: 2, 5
2. Click: +
3. Click: 1, 7
4. Click: =
5. Result: 42
\`\`\`

## Using Decimals

Click the **.** button to add a decimal point:

\`\`\`
3.14 × 2 = 6.28
\`\`\`

## Clearing the Display

Click **C** to clear the calculator and start fresh.
`,
        },
      ],
    },
    {
      id: 'features',
      name: 'Features',
      order: 3,
      entries: [
        {
          id: 'display-features',
          title: 'Display Features',
          slug: 'display-features',
          content: `Understanding the Calculator display.

## Display Areas

### Operation Indicator
The top line shows:
- The previous value
- The current operation

Example: \`25 +\` means you entered 25 and pressed addition.

### Current Value
The main display shows:
- The number you're currently entering
- Or the result after pressing =

## Chained Calculations

You can chain multiple operations:

\`\`\`
10 + 5 = 15
15 × 2 = 30
30 - 10 = 20
\`\`\`

Each time you press an operation, the previous calculation is completed.

## Tips

- The display updates in real-time as you type
- Division by zero returns 0
- Large numbers are displayed in full
`,
        },
      ],
    },
  ],
};
