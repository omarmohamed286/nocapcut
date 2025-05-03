import { FileToPreview } from "@/customTypes";
import { getAudioMetaData, getVideoMetaData } from "@/utils";
import { useCallback, useState } from "react";

const useFilesUpload = () => {
  const [files, setFiles] = useState<FileToPreview[]>([]);

  const onDropFiles = useCallback(
    async (acceptedFiles: File[]) => {
      const filesNames = files.map((file) => file.file.name);
      const uniqueFiles = acceptedFiles.flatMap((file) => {
        if (!filesNames.includes(file.name)) {
          return file;
        }
        return [];
      });
      const filesToPreview = await Promise.all(
        uniqueFiles.map(async (file) => {
          const fileType = file.type.split("/")[0];
          const fileToPreview: FileToPreview = {
            file,
            type: fileType,
            img: "",
          };
          if (fileType == "video") {
            const { thumbnail, videoLength } = await getVideoMetaData(file);
            fileToPreview.img = thumbnail;
            fileToPreview.length = videoLength;
          } else if (fileType == "audio") {
            const { audioLength, audioThumbnail } = await getAudioMetaData(
              file
            );
            fileToPreview.img = audioThumbnail;
            fileToPreview.length = audioLength;
          } else {
            fileToPreview.img = URL.createObjectURL(file);
          }
          return fileToPreview;
        })
      );
      if (!files) {
        return setFiles(filesToPreview);
      }
      setFiles((prev) => [...prev, ...filesToPreview]);
    },
    [files]
  );

  return { files, onDropFiles, setFiles };
};

export default useFilesUpload;
