import { FileToPreview, onMouseEventType } from "@/customTypes";
import { formatDuration } from "@/utils";
import clsx from "clsx";
import { useState } from "react";

type Props = {
  files: FileToPreview[];
  clickedFile: string;
  isDeleteMenuShown: boolean;
  onMouseEvent: onMouseEventType;
  onFileClicked: (fileName: string) => void;
  deleteFile: (fileName: string) => void;
  changeDeleteMenuVisibility: (isShown: boolean) => void;
  changeClickedFile: (fileName: string) => void;
  changeVideoInTimeline: (video: FileToPreview) => void;
};

const FilesPreview = ({
  onFileClicked,
  onMouseEvent,
  deleteFile,
  changeDeleteMenuVisibility,
  changeClickedFile,
  changeVideoInTimeline,
  files,
  clickedFile,
  isDeleteMenuShown,
}: Props) => {
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 mt-10 relative">
      {files.map((file) => (
        <div
          key={file.file.name}
          className={clsx(
            "w-30 aspect-square bg-cover bg-center rounded shadow text-white text-sm flex flex-col p-2",
            clickedFile == file.file.name && "border-1 border-gray-400"
          )}
          style={{ backgroundImage: `url(${file.img})` }}
          onMouseEnter={() => onMouseEvent("enter", file)}
          onMouseLeave={() => onMouseEvent("leave", file)}
          onClick={() => onFileClicked(file.file.name)}
          onContextMenu={(e) => {
            e.preventDefault();
            changeClickedFile(file.file.name);
            setClickCoordinates({ x: e.clientX, y: e.clientY });
            changeDeleteMenuVisibility(true);
          }}
        >
          {isDeleteMenuShown && (
            <div
              className="bg-white p-10 text-black rounded-lg absolute"
              style={{
                top: clickCoordinates.y - 100,
                left: clickCoordinates.x,
              }}
            >
              <button
                className="cursor-pointer"
                onClick={() => {
                  deleteFile(clickedFile);
                  changeDeleteMenuVisibility(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
          {file.length && (
            <p className="ml-auto">{formatDuration(file.length as number)}</p>
          )}
          <button
            className="ml-auto mt-auto text-2xl cursor-pointer"
            onClick={() => {
              changeVideoInTimeline(file);
            }}
          >
            <i className="fa-solid fa-circle-plus"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilesPreview;
