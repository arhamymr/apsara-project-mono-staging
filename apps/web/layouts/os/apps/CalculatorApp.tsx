import { Button } from '@workspace/ui/components/button';
import { useState } from 'react';

// Single-source styled components
const CalcButton = ({
  variant = 'default' as const,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  variant?: 'default' | 'destructive' | 'secondary';
}) => (
  <Button variant={variant} size="lg" {...props}>
    {children}
  </Button>
);

const CalcDisplay = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg bg-black/40 p-4 text-right">{children}</div>
);

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setNewNumber(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <CalcDisplay>
        <div className="text-sm text-white/50">
          {operation ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="text-3xl font-bold text-white">{display}</div>
      </CalcDisplay>

      <div className="grid flex-1 grid-cols-4 gap-2">
        <CalcButton onClick={handleClear} variant="destructive">
          C
        </CalcButton>
        <CalcButton onClick={() => handleOperation('÷')} variant="secondary">
          ÷
        </CalcButton>
        <CalcButton onClick={() => handleOperation('×')} variant="secondary">
          ×
        </CalcButton>
        <CalcButton onClick={() => handleOperation('-')} variant="secondary">
          -
        </CalcButton>

        <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
        <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
        <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
        <CalcButton onClick={() => handleOperation('+')} variant="secondary">
          +
        </CalcButton>

        <CalcButton onClick={() => handleNumber('4')}>4</CalcButton>
        <CalcButton onClick={() => handleNumber('5')}>5</CalcButton>
        <CalcButton onClick={() => handleNumber('6')}>6</CalcButton>

        <CalcButton onClick={() => handleNumber('1')}>1</CalcButton>
        <CalcButton onClick={() => handleNumber('2')}>2</CalcButton>
        <CalcButton onClick={() => handleNumber('3')}>3</CalcButton>
        <CalcButton onClick={handleEquals}>=</CalcButton>

        <CalcButton onClick={() => handleNumber('0')}>0</CalcButton>
        <CalcButton onClick={handleDecimal}>.</CalcButton>
      </div>
    </div>
  );
}
