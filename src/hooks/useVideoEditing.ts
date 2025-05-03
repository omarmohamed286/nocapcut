import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Rnd, RndResizeCallback } from "react-rnd";
import { timelineElementWidthScale } from "@/constants";
import { getCurrentTimeFromPlayheadPosition } from "@/utils";
import { DraggableEventHandler } from "react-draggable";
import {
  AddedText,
  OutputVideoQuality,
  TextContainerPosition,
  TextContainerSize,
  VideoContainerSize,
} from "@/customTypes";

const useVideoEditing = (
  videoUrl: string,
  videoContainerSize: VideoContainerSize
) => {
  const [addedText, setAddedText] = useState<AddedText>({
    text: "",
    isTextAdded: false,
    fontSize: 30,
    inVideoX: 0,
    inVideoY: 0,
    timelineStart: 0,
    timelineEnd: 5,
    isSelected: true,
    ref: useRef<Rnd>(null),
  });

  const [textContainerPosition, setTextContainerPosition] =
    useState<TextContainerPosition>({
      x: 0,
      y: 0,
    });

  const [textContainerSize, setTextContainerSize] = useState<TextContainerSize>(
    {
      width:
        (addedText.timelineEnd - addedText.timelineStart) *
        timelineElementWidthScale,
      height: 40,
    }
  );

  const [outputVideoQuality, setOutputVideoQuality] =
    useState<OutputVideoQuality>("720");

  const [exportVideoProgress, setExportVideoProgress] = useState(0);

  const textNodeRef = useRef<Konva.Text>(null);

  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    const handleOnClick = (e: MouseEvent) => {
      const ref = addedText.ref.current?.getSelfElement();
      if (ref && !ref.contains(e.target as HTMLElement)) {
        setAddedText({ ...addedText, isSelected: false });
      }
    };

    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      document.addEventListener("click", handleOnClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleOnClick);
    };
  });

  const changeAddedText = (addedText: AddedText) => {
    setAddedText(addedText);
  };

  const handleOnTextContainerDragStop: DraggableEventHandler = (_e, d) => {
    const textContainerNode = d.node;
    const duration = addedText.timelineEnd - addedText.timelineStart;
    const startTime = getCurrentTimeFromPlayheadPosition(
      d.x,
      textContainerNode.offsetWidth,
      duration
    );
    const endTime = startTime + duration;
    setTextContainerPosition({ x: d.x, y: d.y });
    setAddedText({
      ...addedText,
      timelineStart: startTime,
      timelineEnd: endTime,
    });
  };

  const handleOnTextContainerResizeStop: RndResizeCallback = (
    _e,
    direction,
    ref,
    _d,
    pos
  ) => {
    setTextContainerSize({
      ...textContainerSize,
      width: ref.offsetWidth,
    });
    setTextContainerPosition({ ...textContainerPosition, x: pos.x });
    if (direction == "right") {
      setAddedText({
        ...addedText,
        timelineEnd:
          (ref.offsetWidth +
            addedText.timelineStart * timelineElementWidthScale) /
          timelineElementWidthScale,
      });
    } else {
      setAddedText({
        ...addedText,
        timelineStart: getCurrentTimeFromPlayheadPosition(
          pos.x,
          ref.offsetWidth,
          addedText.timelineEnd - addedText.timelineStart
        ),
      });
    }
  };

  const changeOutputVideoQuality = (quality: OutputVideoQuality) => {
    setOutputVideoQuality(quality);
  };

  async function addBlobToVideo() {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("progress", ({ progress }) => {
        setExportVideoProgress(progress);
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
    };

    const transcode = async () => {
      const videoWidthMap = { 480: 854, 720: 1280, 1080: 1920 };
      const videoWidth = videoWidthMap[outputVideoQuality];
      const pixelRatio = videoWidth / videoContainerSize.width;
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile("video.mp4", await fetchFile(videoUrl));
      await ffmpeg.writeFile(
        "blob.png",
        await fetchFile(textNodeRef.current?.toDataURL({ pixelRatio }))
      );
      await ffmpeg.writeFile(
        "arial.ttf",
        await fetchFile(
          "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf"
        )
      );
      await ffmpeg.exec([
        "-i",
        "video.mp4",
        "-i",
        "blob.png",
        "-filter_complex",
        `[0:v]scale=${videoWidth}:${outputVideoQuality}[scaled];[scaled][1:v]overlay=${
          addedText.inVideoX * pixelRatio
        }:${addedText.inVideoY * pixelRatio}:enable='between(t,${
          addedText.timelineStart
        },${addedText.timelineEnd})'`,
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-c:a",
        "copy",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      return new Blob([data], { type: "video/mp4" });
    };
    await load();
    const dataAsBlob = await transcode();
    setExportVideoProgress(0);
    return dataAsBlob;
  }

  return {
    textContainerPosition,
    addedText,
    textContainerSize,
    textNodeRef,
    exportVideoProgress,
    changeAddedText,
    setTextContainerPosition,
    setTextContainerSize,
    handleOnTextContainerDragStop,
    handleOnTextContainerResizeStop,
    addBlobToVideo,
    changeOutputVideoQuality,
  };
};

export default useVideoEditing;
