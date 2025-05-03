import { audioThumbnail } from "@/constants";

export const getVideoMetaData = (
  file: File
): Promise<{ thumbnail: string; videoLength: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob)
          return reject(new Error("Failed to create blob from canvas"));
        const thumbnail = URL.createObjectURL(blob);
        resolve({ thumbnail, videoLength: video.duration });
        URL.revokeObjectURL(video.src);
      }, "image/png");
    };
    video.onerror = () => {
      reject(new Error("Error loading video"));
    };
  });
};

export const getAudioMetaData = (
  file: File
): Promise<{ audioLength: number; audioThumbnail: string }> => {
  return new Promise((resolve, _) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      resolve({ audioLength: Math.round(audio.duration), audioThumbnail });
    };
  });
};

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const padZeros = (time: number) => time.toString().padStart(2, "0");

  const paddedMinutes = padZeros(m);
  const paddedSeconds = padZeros(s);

  if (h > 0) {
    return `${h}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${m}:${paddedSeconds}`;
  }
}

export function toFixedAsNumber(number: number, fractionDigits: number) {
  return Number(number.toFixed(fractionDigits));
}

export function getCurrentTimeFromPlayheadPosition(
  position: number,
  videoInTimelineWidth: number,
  videoLength?: number
) {
  return (position / videoInTimelineWidth) * (videoLength as number);
}

export function getPlayheadPositionFromCurrentTime(
  currentTime: number,
  videoInTimelineWidth?: number,
  videoLength?: number
) {
  return (
    (currentTime / (videoLength as number)) * (videoInTimelineWidth as number)
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

