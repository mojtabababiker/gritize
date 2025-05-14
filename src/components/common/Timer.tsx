"use client";
import { HistoryIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
  minutes: number;
  seconds: number;
  onTimeUp?: VoidFunction;
  onChange?: (time: number) => void;
  upTimer?: boolean;
};

/**
 * A timer component that counts down or up from a specified time.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.minutes - Initial minutes to start from
 * @param {number} props.seconds - Initial seconds to start from
 * @param {() => void} props.onTimeUp - Callback function to execute when timer reaches zero (in countdown mode)
 * @param {boolean} [props.up=false] - If true, timer counts up instead of down
 *
 * @example
 * ```tsx
 * // Countdown timer for 5 minutes
 * <Timer minutes={5} seconds={0} onTimeUp={() => console.log('Time is up!')} />
 *
 * // Count up timer starting from 0
 * <Timer minutes={0} seconds={0} onTimeUp={() => {}} up={true} />
 * ```
 *
 * @returns A timer display showing minutes and seconds in a segmented format
 */
function Timer({
  minutes,
  seconds,
  onTimeUp,
  onChange,
  upTimer = false,
}: Props) {
  const [remainingTime, setRemainingTime] = useState(minutes * 60 + seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        // If counting up, increment the time
        if (upTimer) {
          onChange && onChange((prev + 1) / 60); // Call onChange with the new time in minutes
          return prev + 1;
        }
        // Countdown logic
        // If the time is up, clear the interval and call the onTimeUp function
        if (prev <= 0) {
          clearInterval(intervalRef.current!);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  /**
   * Formats the given time in seconds into an object containing minutes and seconds divided into 2 segments.
   * @param time - The time in seconds to format
   * @returns { mins: string, secs: string } - An object containing formatted minutes and seconds
   *
   * @example
   * ```tsx
   * const formattedTime = formatTime(125); // { mins: '02', secs: '05' }
   * ```
   */
  const formatTime = (time: number): { mins: string; secs: string } => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const secs = (time % 60).toString().padStart(2, "0");
    return { mins, secs };
  };

  return (
    <div className="flex items-stretch gap-2 min-w-[112px]">
      {/* minutes segments */}
      <div className="flex gap-1">
        <div className="w-[24px] h-[24px] bg-fg rounded flex items-center justify-center">
          {formatTime(remainingTime).mins[0]}
        </div>
        <div className="w-[24px] h-[24px] bg-fg rounded flex items-center justify-center">
          {formatTime(remainingTime).mins[1]}
        </div>
      </div>
      <div className="text-bg text-sm font-heading font-semibold">:</div>
      {/* seconds segments */}
      <div className="flex gap-1">
        <div className="w-[24px] h-[24px] bg-fg rounded flex items-center justify-center">
          {formatTime(remainingTime).secs[0]}
        </div>
        <div className="w-[24px] h-[24px] bg-fg rounded flex items-center justify-center">
          {formatTime(remainingTime).secs[1]}
        </div>
      </div>

      {upTimer && (
        /* reset timer */
        <HistoryIcon
          className="size-6 text-surface cursor-pointer"
          onClick={() => {
            setRemainingTime(0);
            onChange && onChange(0);
          }}
          strokeWidth={1}
        >
          <span className="sr-only">Reset Timer</span>
        </HistoryIcon>
      )}
    </div>
  );
}

export default Timer;
