import { timelineElementWidthScale } from "@/constants";
import { FileToPreview, VideoContainerSize } from "@/customTypes";
import { getPlayheadPositionFromCurrentTime, toFixedAsNumber } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

const useVideoPlayer = () => {
  const videoInTimelineRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<ReactPlayer>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [videoInTimeLine, setVideoInTimeline] = useState<
    FileToPreview | undefined
  >(undefined);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");

  const [videoContainerSize, setVideoContainerSize] =
    useState<VideoContainerSize>({
      width: 0,
      height: 0,
    });

  const videoContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setVideoContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      resizeObserver.observe(node);
    }
  }, []);

  useEffect(() => {
    if (videoInTimeLine?.file) {
      setVideoUrl(URL.createObjectURL(videoInTimeLine.file));
    }
  }, [videoInTimeLine]);

  useEffect(() => {
    if (!isVideoPlaying && videoPlayerRef) {
      videoPlayerRef.current?.seekTo(currentTime);
    }
  }, [playheadPosition]);

  const changeCurrentTime = (currentTime: number) => {
    setCurrentTime(currentTime);
  };

  const changeVideoInTimeline = (video: FileToPreview | undefined) => {
    setVideoInTimeline(video);
  };

  const onVideoPlaying = (e: OnProgressProps) => {
    const videoTime = toFixedAsNumber(e.playedSeconds, 2);
    const currentPosition = getPlayheadPositionFromCurrentTime(
      currentTime,
      videoInTimelineRef.current?.offsetWidth,
      videoInTimeLine?.length
    );
    setCurrentTime(videoTime);
    setPlayheadPosition(currentPosition);
  };

  const onVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  const onPlayButtonClicked = () => {
    setIsVideoPlaying((prev) => !prev);
  };

  const timelineVideoStyles = {
    backgroundImage: `url(${videoInTimeLine?.img})`,
    width:
      (videoInTimeLine?.length as number) * timelineElementWidthScale + "px",
  };

  return {
    videoUrl,
    videoInTimeLine,
    videoInTimelineRef,
    currentTime,
    videoPlayerRef,
    isVideoPlaying,
    playheadPosition,
    timelineVideoStyles,
    videoContainerSize,
    changeCurrentTime,
    changeVideoInTimeline,
    setIsVideoPlaying,
    setPlayheadPosition,
    onVideoPlaying,
    onVideoEnded,
    onPlayButtonClicked,
    videoContainerRef,
  };
};

export default useVideoPlayer;
