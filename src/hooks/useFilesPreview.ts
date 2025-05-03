import { FileToPreview, onMouseEventType } from "@/customTypes";
import { useEffect, useState } from "react";

const useFilesPreview = (
  files: FileToPreview[],
  setFiles: React.Dispatch<React.SetStateAction<FileToPreview[]>>,
  changeVideoInTimeline: (video: FileToPreview | undefined) => void
) => {
  const [overviewImg, setOverviewImg] = useState("");
  const [clickedFile, setClickedFile] = useState("");
  const [isDeleteMenuShown, setIsDeleteMenuShown] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (clickedFile && event.key == "Delete") {
        deleteFile(clickedFile);
      }
    });
  }, [clickedFile]);

  const onMouseEvent: onMouseEventType = (event, file) => {
    if (event == "enter") {
      setOverviewImg(file.img);
    } else {
      setOverviewImg("");
    }
  };

  const onFileClicked = (fileName: string) => {
    setClickedFile(fileName);
  };

  const deleteFile = (fileName: string) => {
    const newFiles = files.filter((file) => file.file.name !== fileName);
    setFiles(newFiles);
    setClickedFile("");
    setOverviewImg("");
    changeVideoInTimeline(undefined);
  };

  const changeDeleteMenuVisibility = (isShown: boolean) => {
    if (isShown) {
      setIsDeleteMenuShown(true);
    } else {
      setIsDeleteMenuShown(false);
    }
  };

  const changeClickedFile = (fileName: string) => {
    setClickedFile(fileName);
  };

  const onScreenClicked = () => {
    changeDeleteMenuVisibility(false);
  };

  return {
    clickedFile,
    overviewImg,
    isDeleteMenuShown,
    changeClickedFile,
    changeDeleteMenuVisibility,
    deleteFile,
    onFileClicked,
    onMouseEvent,
    onScreenClicked,
  };
};

export default useFilesPreview;
