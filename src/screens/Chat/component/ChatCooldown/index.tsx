import { useTimeDifference } from '@/hooks/useTimeDifference';
import { useEffect, useMemo } from 'react';
import { mutate } from 'swr';

interface IChatCooldownProps {
  expiresIn: number;
}

export const ChatCooldown = ({ expiresIn }: IChatCooldownProps) => {
  const { days, hours, minutes, seconds } = useTimeDifference(expiresIn, true);

  const isExpired =
    days === 0 && hours === 0 && +minutes === 0 && +seconds === 0;

  const refreshLimits = () => {
    mutate('/messages/limits');
  };

  useEffect(() => {
    if (isExpired) {
      refreshLimits();
    }
  }, [isExpired, refreshLimits]);

  const timeLeft = useMemo(() => {
    if (days > 0) {
      return `${days}d`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    if (+minutes > 0) {
      return `${minutes}m`;
    }

    return `${seconds}s`;
  }, [days, hours, minutes, seconds]);

  return (
    <div className="flex items-center whitespace-nowrap ml-auto text-[#C9C9E2]">
      Cooldown time left: {timeLeft}
    </div>
  );
};
