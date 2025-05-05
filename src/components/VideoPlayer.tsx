import { AddedText } from "@/customTypes";
import React from "react";
import DraggableAndResizableText from "./DraggableAndResizableText";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import Konva from "konva";

type Props = {
  addedText: AddedText;
  textNodeRef: React.RefObject<Konva.Text | null>;
  currentTime: number;
  videoContainerSize: { width: number; height: number };
  videoPlayerRef: React.RefObject<ReactPlayer | null>;
  videoUrl: string;
  isVideoPlaying: boolean;
  videoContainerRef: (node: HTMLDivElement | null) => void;
  changeAddedText: (addedText: AddedText) => void;
  onProgress: (e: OnProgressProps) => void;
  onEnded: () => void;
};

const VideoPlayer = ({
  addedText,
  textNodeRef,
  currentTime,
  videoContainerSize,
  videoPlayerRef,
  videoUrl,
  isVideoPlaying,
  videoContainerRef,
  changeAddedText,
  onProgress,
  onEnded,
}: Props) => {
  const showTextOnVideo = (): React.ReactNode => {
    const isTextShownOnVideo =
      addedText.text &&
      currentTime >= addedText.timelineStart &&
      currentTime <= addedText.timelineEnd;
    if (isTextShownOnVideo) {
      return (
        <div className="absolute z-10">
          <DraggableAndResizableText
            stageSize={{
              width: videoContainerSize.width,
              height: videoContainerSize.height,
            }}
            addedText={addedText}
            changeAddedText={changeAddedText}
            textNodeRef={textNodeRef}
          ></DraggableAndResizableText>
        </div>
      );
    }
  };

  return (
    <div
      className="aspect-video max-w-100 relative"
      ref={videoContainerRef}
      onMouseDown={() => changeAddedText({ ...addedText, isSelected: true })}
      onClick={() => changeAddedText({ ...addedText, isSelected: true })}
    >
      {showTextOnVideo()}
      <ReactPlayer
        ref={videoPlayerRef}
        width="100%"
        height="100%"
        url={videoUrl}
        playing={isVideoPlaying ? true : false}
        progressInterval={10}
        onProgress={onProgress}
        onEnded={onEnded}
      ></ReactPlayer>
    </div>
  );
};

export default VideoPlayer;
