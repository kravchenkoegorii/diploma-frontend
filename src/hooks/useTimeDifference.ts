import { useEffect, useState } from 'react';

export const addLeadingZero = (value: number): string =>
  value.toString().padStart(2, '0');

export const useTimeDifference = (
  targetTimestamp: number,
  isCountdown = false
) => {
  const timeValue = 60;

  const now = new Date();
  const UTCTimestamp = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  );

  const [timeDifference, setTimeDifference] = useState(
    targetTimestamp - UTCTimestamp
  );

  useEffect(() => {
    const now = new Date();
    const UTCTimestamp = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    setTimeDifference(targetTimestamp - UTCTimestamp);
  }, [targetTimestamp]);

  useEffect(() => {
    if (!isCountdown) return;

    const timer = setTimeout(() => {
      setTimeDifference(timeDifference - 1000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isCountdown, timeDifference]);

  let daysLeft = Math.floor(
    timeDifference / (1000 * timeValue * timeValue * 24)
  );
  let hoursLeft = Math.floor(
    (timeDifference % (1000 * timeValue * timeValue * 24)) /
      (1000 * timeValue * timeValue)
  );
  let minutesLeft = Math.floor(
    (timeDifference % (1000 * timeValue * timeValue)) / (1000 * timeValue)
  );
  let secondsLeft = Math.floor((timeDifference % (1000 * timeValue)) / 1000);

  daysLeft = daysLeft < 0 ? 0 : daysLeft;
  hoursLeft = hoursLeft < 0 ? 0 : hoursLeft;
  minutesLeft = minutesLeft < 0 ? 0 : minutesLeft;
  secondsLeft = secondsLeft < 0 ? 0 : secondsLeft;

  const formattedData = {
    days: daysLeft,
    hours: hoursLeft,
    minutes: addLeadingZero(minutesLeft),
    seconds: addLeadingZero(secondsLeft),
  };
  return formattedData;
};
