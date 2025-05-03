import { supportedFiles } from "@/constants";
import { onDropType } from "@/customTypes";
import Dropzone, { DropzoneState } from "shadcn-dropzone";

type Props = {
  onDrop: onDropType;
};

const ImportFiles = ({ onDrop }: Props) => {
  return (
    <div className="grid place-content-center h-full">
      <Dropzone
        accept={supportedFiles}
        onDrop={onDrop}
        dropZoneClassName="hover:bg-transparent"
      >
        {(dropzone: DropzoneState) =>
          !dropzone.isDragActive ? (
            <div className="text-center border border-dashed border-gray-500 p-5 rounded-md hover:bg-violet hover:text-white">
              <div className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-upload"></i>
                <p>Import or Drop Files</p>
              </div>
              <p>Supported: videos,photos,audios</p>
            </div>
          ) : (
            <p>Drop Files Here!</p>
          )
        }
      </Dropzone>
    </div>
  );
};

export default ImportFiles;
