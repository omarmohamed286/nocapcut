import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutputVideoQuality } from "@/customTypes";
import { downloadBlob, toFixedAsNumber } from "@/utils";
import { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { blueColor, exportVideoDefaultName, violetColor } from "@/constants";

type Props = {
  trigger: React.ReactNode;
  exportVideoProgress: number;
  changeOutputVideoQuality: (quality: OutputVideoQuality) => void;
  addBlobToVideo: () => Promise<Blob>;
};

const ExportDialog = ({
  trigger,
  exportVideoProgress,
  changeOutputVideoQuality,
  addBlobToVideo,
}: Props) => {
  const [isExportButtonVisible, setIsExportButtonVisible] = useState(true);
  const [isExportVideoEnded, setIsExportVideoEnded] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] text-center bg-light-blue text-white border border-dark-grey">
        <VisuallyHidden.Root>
          <DialogTitle>Export Video</DialogTitle>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root>
          <DialogDescription>Export Video</DialogDescription>
        </VisuallyHidden.Root>
        <p className="text-lg font-semibold text-blue mb-4">Choose Quality</p>
        <Tabs
          defaultValue="720"
          className="max-w-[250px] w-full mx-auto"
          onValueChange={(value) =>
            changeOutputVideoQuality(value as OutputVideoQuality)
          }
        >
          <TabsList className="grid w-full grid-cols-3 bg-dark-blue rounded-md p-1">
            <TabsTrigger
              value="480"
              className="rounded-md text-sm text-white data-[state=active]:bg-violet data-[state=active]:text-white transition"
            >
              480
            </TabsTrigger>
            <TabsTrigger
              value="720"
              className="rounded-md text-sm text-white data-[state=active]:bg-violet data-[state=active]:text-white transition"
            >
              720
            </TabsTrigger>
            <TabsTrigger
              value="1080"
              className="rounded-md text-sm text-white data-[state=active]:bg-violet data-[state=active]:text-white transition"
            >
              1080
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DialogFooter className="mt-6">
          {isExportButtonVisible || isExportVideoEnded ? (
            <button
              className="bg-violet text-white px-4 py-2 rounded-md hover:bg-blue transition"
              onClick={async () => {
                setIsExportButtonVisible(false);
                setIsExportVideoEnded(false);
                const videoAsBlob = await addBlobToVideo();
                downloadBlob(videoAsBlob, exportVideoDefaultName);
                setIsExportVideoEnded(true);
              }}
            >
              Export
            </button>
          ) : (
            <ProgressBar
              completed={toFixedAsNumber(exportVideoProgress, 1) * 100}
              className="max-w-80 w-full mx-auto"
              bgColor={violetColor}
              baseBgColor={blueColor}
            ></ProgressBar>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
