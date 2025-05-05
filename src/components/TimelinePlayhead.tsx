import { FileToPreview } from "@/customTypes";
import { getCurrentTimeFromPlayheadPosition, toFixedAsNumber } from "@/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  videoInTimeline: FileToPreview;
  videoInTimelineWidth: number | undefined;
  playheadPosition: number;
  changeCurrentTime: (duration: number) => void;
  changePlayheadPosition: (position: number) => void;
};

const TimelinePlayhead = ({
  videoInTimelineWidth,
  videoInTimeline,
  playheadPosition,
  changeCurrentTime,
  changePlayheadPosition,
}: Props) => {
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  useEffect(() => {
    const onPlayheadMove = (e: MouseEvent | TouchEvent) => {
      const x = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      if (videoInTimelineWidth && x > videoInTimelineWidth) return;
      if (isDraggingPlayhead && videoInTimeline && videoInTimelineWidth) {
        const currentTime = getCurrentTimeFromPlayheadPosition(
          x,
          videoInTimelineWidth,
          videoInTimeline.length
        );
        changePlayheadPosition(x);
        changeCurrentTime(toFixedAsNumber(currentTime, 2));
      }
    };
    const handlePointerUp = () => {
      setIsDraggingPlayhead(false);
    };
    document.addEventListener("mousemove", onPlayheadMove);
    document.addEventListener("touchmove", onPlayheadMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("mousemove", onPlayheadMove);
      document.removeEventListener("touchmove", onPlayheadMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingPlayhead]);

  return (
    <div
      className="bg-gray-900 text-gray-900 h-full w-1 flex justify-center absolute z-10 cursor-col-resize"
      onPointerDown={() => setIsDraggingPlayhead(true)}
      style={{ transform: `translateX(${playheadPosition}px)` }}
    >
      <i
        className={clsx(
          "fa-solid fa-caret-down text-5xl h-10 w-8",
          isDraggingPlayhead && "text-white"
        )}
      ></i>
    </div>
  );
};

export default TimelinePlayhead;
