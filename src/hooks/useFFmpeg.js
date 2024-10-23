import { useCallback, useEffect, useState } from "react";

export function useFFmpeg() {
  const [worker, setWorker] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ffmpegWorker = new Worker(
      new URL("../workers/ffmpeg.worker.js", import.meta.url),
      { type: "module" }
    );

    ffmpegWorker.onmessage = ({ data }) => {
      switch (data.type) {
        case "ready":
          setIsReady(true);
          break;
        case "progress":
          setProgress(data.payload.progress);
          break;
        case "error":
          setError(data.payload);
          break;
      }
    };

    setWorker(ffmpegWorker);

    // Initialize FFmpeg
    ffmpegWorker.postMessage({ type: "init" });

    return () => ffmpegWorker.terminate();
  }, []);

  const transcode = useCallback(
    async (file, outputFormat) => {
      if (!worker || !isReady) return;

      return new Promise((resolve, reject) => {
        const handleMessage = ({ data }) => {
          if (data.type === "complete") {
            worker.removeEventListener("message", handleMessage);
            resolve(data.payload);
          } else if (data.type === "error") {
            worker.removeEventListener("message", handleMessage);
            reject(new Error(data.payload));
          }
        };

        worker.addEventListener("message", handleMessage);

        file.arrayBuffer().then((arrayBuffer) => {
          worker.postMessage(
            {
              type: "transcode",
              payload: {
                inputFile: arrayBuffer,
                outputFormat,
              },
            },
            [arrayBuffer]
          );
        });
      });
    },
    [worker, isReady]
  );

  return { transcode, isReady, progress, error };
}
