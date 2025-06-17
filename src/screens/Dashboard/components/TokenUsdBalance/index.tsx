import { Tooltip } from '@/components/Tooltip';
import { ReactNode } from 'react';
import { formatUnits } from 'viem';

interface TooltipWrapperProps {
  amount?: bigint | string | number | null;
  price?: string | number;
  decimals?: number;
  children: ReactNode;
}

export const TooltipWrapper = ({
  amount,
  price = 0,
  decimals = 18,
  children,
}: TooltipWrapperProps) => {
  const safeAmount = amount ?? 0;
  const formattedAmount =
    typeof safeAmount === 'bigint'
      ? Number(formatUnits(safeAmount, decimals))
      : Number(safeAmount) || 0;

  const totalValue = (formattedAmount * Number(price || 0)).toFixed(5);

  return formattedAmount !== 0 ? (
    <Tooltip tooltip={`~$ ${isNaN(Number(totalValue)) ? '0.0' : totalValue}`}>
      {children}
    </Tooltip>
  ) : (
    children
  );
};
