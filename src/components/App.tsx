import { FileToPreview } from "@/customTypes";
import { formatDuration } from "@/utils";

import ImportFiles from "./ImportFiles";
import FilesPreview from "./FilesPreview";
import ImportButton from "./ImportButton";
import TimelinePlayhead from "./TimelinePlayhead";
import ButtonWithIcon from "./ButtonWithIcon";
import EditTextForm from "./EditTextForm";
import ResizableAndDraggableRect from "./DraggableAndResizableRect";

import useVideoEditing from "@/hooks/useVideoEditing";
import useFilesUpload from "@/hooks/useFilesUpload";
import useFilesPreview from "@/hooks/useFilesPreview";
import useVideoPlayer from "@/hooks/useVideoPlayer";
import VideoPlayer from "./VideoPlayer";
import ExportDialog from "./ExportVideoDialog";

const App = () => {
  const { files, setFiles, onDropFiles } = useFilesUpload();

  const {
    videoUrl,
    videoInTimeLine,
    videoInTimelineRef,
    videoPlayerRef,
    isVideoPlaying,
    playheadPosition,
    currentTime,
    timelineVideoStyles,
    videoContainerSize,
    videoContainerRef,
    setPlayheadPosition,
    changeCurrentTime,
    changeVideoInTimeline,
    onVideoPlaying,
    onVideoEnded,
    onPlayButtonClicked,
  } = useVideoPlayer();

  const {
    clickedFile,
    overviewImg,
    isDeleteMenuShown,
    changeClickedFile,
    changeDeleteMenuVisibility,
    deleteFile,
    onFileClicked,
    onMouseEvent,
    onScreenClicked,
  } = useFilesPreview(files, setFiles, changeVideoInTimeline);

  const {
    textContainerPosition,
    addedText,
    textContainerSize,
    textNodeRef,
    exportVideoProgress,
    changeAddedText,
    handleOnTextContainerDragStop,
    handleOnTextContainerResizeStop,
    changeOutputVideoQuality,
    addBlobToVideo,
  } = useVideoEditing(videoUrl, videoContainerSize);

  const filesPreviewProps = {
    files,
    clickedFile,
    isDeleteMenuShown,
    onMouseEvent,
    onFileClicked,
    deleteFile,
    changeDeleteMenuVisibility,
    changeClickedFile,
    changeVideoInTimeline,
  };

  const timelinePlayheadProps = {
    videoInTimeline: videoInTimeLine as FileToPreview,
    videoInTimelineWidth: videoInTimelineRef.current?.offsetWidth,
    playheadPosition,
    changeCurrentTime,
    changePlayheadPosition: setPlayheadPosition,
  };

  const resizableAndDraggableRectProps = {
    addedText,
    textContainerPosition,
    textContainerSize,
    changeAddedText,
    onDragStop: handleOnTextContainerDragStop,
    onResizeStop: handleOnTextContainerResizeStop,
  };

  const videoPlayerProps = {
    addedText,
    textNodeRef,
    currentTime,
    videoContainerSize,
    videoPlayerRef,
    videoUrl,
    isVideoPlaying,
    videoContainerRef,
    changeAddedText,
    onProgress: onVideoPlaying,
    onEnded: onVideoEnded,
  };

  const showFiles = () => {
    if (files.length == 0) {
      return <ImportFiles onDrop={onDropFiles}></ImportFiles>;
    }
    return (
      <div>
        <div className="flex items-center">
          <ImportButton onDrop={onDropFiles}></ImportButton>
          {videoInTimeLine && (
            <ButtonWithIcon
              onClick={() =>
                changeAddedText({
                  ...addedText,
                  text: "Default Text",
                  isTextAdded: true,
                })
              }
            >
              <i className="fa-solid fa-text-height"></i>
              <span>Add Text</span>
            </ButtonWithIcon>
          )}
          {addedText.isTextAdded && addedText.isSelected && (
            <EditTextForm
              addedText={addedText}
              changeAddedText={changeAddedText}
            ></EditTextForm>
          )}
          {videoInTimeLine && (
            <ExportDialog
              trigger={
                <div className="ml-auto">
                  <ButtonWithIcon>
                    <i className="fa-solid fa-file-export"></i>
                    <span>Export</span>
                  </ButtonWithIcon>
                </div>
              }
              changeOutputVideoQuality={changeOutputVideoQuality}
              addBlobToVideo={addBlobToVideo}
              exportVideoProgress={exportVideoProgress}
            ></ExportDialog>
          )}
        </div>
        <FilesPreview {...filesPreviewProps}></FilesPreview>
      </div>
    );
  };

  const showPlayVideoIcon = () => {
    if (!isVideoPlaying) {
      return <i className="fa-solid fa-play"></i>;
    }
    return <i className="fa-solid fa-pause"></i>;
  };

  return (
    <div
      className="grid grid-cols-2 gap-4 min-h-dvh grid-rows-2 bg-dark-blue p-2"
      onClick={onScreenClicked}
    >
      <div className="bg-light-blue rounded-xl text-white h-100 pb-5 overflow-y-auto overflow-x-hidden">
        {showFiles()}
      </div>
      <div className="bg-light-blue rounded-xl grid place-content-center text-white relative">
        {videoInTimeLine && (
          <div>
            <p className="absolute bottom-5 left-5">
              {formatDuration(currentTime)}
            </p>
            <p className="absolute bottom-5 left-20">
              {formatDuration(videoInTimeLine?.length as number)}
            </p>
            <button
              className="absolute bottom-5 left-1/2"
              onClick={onPlayButtonClicked}
            >
              {showPlayVideoIcon()}
            </button>
          </div>
        )}
        {videoInTimeLine && !overviewImg && (
          <VideoPlayer {...videoPlayerProps}></VideoPlayer>
        )}
        {overviewImg && (
          <img src={overviewImg} className="max-w-150 h-50 w-full" />
        )}
      </div>
      <div
        className="bg-light-blue rounded-xl col-span-2 flex flex-col justify-center overflow-auto relative"
        onDragStart={(e) => e.preventDefault()}
      >
        <TimelinePlayhead {...timelinePlayheadProps}></TimelinePlayhead>
        {addedText.isTextAdded && (
          <div
            className="relative -top-12"
            style={{
              maxWidth: timelineVideoStyles.width,
              width: "100%",
            }}
          >
            <ResizableAndDraggableRect
              {...resizableAndDraggableRectProps}
            ></ResizableAndDraggableRect>
          </div>
        )}
        {videoInTimeLine && (
          <div
            ref={videoInTimelineRef}
            className="h-25 bg-gray-900 bg-repeat-x bg-size-[100px] bg-center"
            style={timelineVideoStyles}
          ></div>
        )}
      </div>
    </div>
  );
};

export default App;
