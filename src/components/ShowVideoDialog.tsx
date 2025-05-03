import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { VisuallyHidden } from "radix-ui";

type Props = {
  trigger: React.ReactNode;
  videoPath: string;
};

const ShowVideoDialog = ({ trigger, videoPath }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-0 [&>button:last-child]:hidden">
        <VisuallyHidden.Root>
          <DialogTitle>Video Editing</DialogTitle>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root>
          <DialogDescription>Video Editing</DialogDescription>
        </VisuallyHidden.Root>
        <video src={videoPath} controls autoPlay></video>
        <DialogFooter className="mx-auto">
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowVideoDialog;
