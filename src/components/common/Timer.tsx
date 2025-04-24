"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
  minutes: number;
  seconds: number;
  onTimeUp: VoidFunction;
};

/**
 * A countdown timer component that displays minutes and seconds in a segmented format.
 *
 * @component
 * @param {Object} props - The component props
 * @param {number} props.minutes - Initial minutes to start countdown from
 * @param {number} props.seconds - Initial seconds to start countdown from
 * @param {VoidFunction} props.onTimeUp - Callback function executed when timer reaches zero
 *
 * @returns A timer display with separated digit segments for minutes and seconds
 *
 * @example
 * ```tsx
 * <Timer minutes={5} seconds={30} onTimeUp={() => console.log('Time is up!')} />
 * ```
 */
function Timer({ minutes, seconds, onTimeUp }: Props) {
  const [remainingTime, setRemainingTime] = useState(minutes * 60 + seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current!);
          onTimeUp();
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
        <div className="w-[24px] h-[24px] bg-fg rounded-2xl flex items-center justify-center">
          {formatTime(remainingTime).mins[0]}
        </div>
        <div className="w-[24px] h-[24px] bg-fg rounded-2xl flex items-center justify-center">
          {formatTime(remainingTime).mins[1]}
        </div>
      </div>
      <div className="text-bg text-sm font-heading font-semibold">:</div>
      {/* seconds segments */}
      <div className="flex gap-1">
        <div className="w-[24px] h-[24px] bg-fg rounded-2xl flex items-center justify-center">
          {formatTime(remainingTime).secs[0]}
        </div>
        <div className="w-[24px] h-[24px] bg-fg rounded-2xl flex items-center justify-center">
          {formatTime(remainingTime).secs[1]}
        </div>
      </div>
    </div>
  );
}

export default Timer;
