import { Rnd } from "react-rnd";

type FileToPreview = {
  file: File;
  img: string;
  type: string;
  length?: number;
};

type onMouseEventType = (event: "enter" | "leave", file: FileToPreview) => void;

type onDropType = (acceptedFiles: File[]) => Promise<void>;

type AddedText = {
  text: string;
  isTextAdded?: boolean;
  fontSize: number;
  inVideoX: number;
  inVideoY: number;
  timelineStart: number;
  timelineEnd: number;
  isSelected: boolean;
  ref: React.RefObject<Rnd | null>;
};

type TextContainerSize = {
  width: number;
  height: number;
};

type TextContainerPosition = {
  x: number;
  y: number;
};

type OutputVideoQuality = "480" | "720" | "1080";

type VideoContainerSize = TextContainerSize;

export {
  type FileToPreview,
  type onMouseEventType,
  type onDropType,
  type AddedText,
  type TextContainerSize,
  type TextContainerPosition,
  type OutputVideoQuality,
  type VideoContainerSize,
};
