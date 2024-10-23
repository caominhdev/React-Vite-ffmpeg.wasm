import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

self.onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case "init":
      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm";
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
          workerURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.worker.js`,
            "text/javascript"
          ),
        });
        self.postMessage({ type: "ready" });
      } catch (error) {
        self.postMessage({ type: "error", payload: error.message });
      }
      break;

    case "transcode":
      try {
        const { inputFile, outputFormat } = payload;
        await ffmpeg.writeFile("input", new Uint8Array(inputFile));

        // Log progress
        ffmpeg.on("progress", (progress) => {
          self.postMessage({
            type: "progress",
            payload: progress,
          });
        });

        await ffmpeg.exec(["-i", "input", `output.${outputFormat}`]);
        const data = await ffmpeg.readFile(`output.${outputFormat}`);
        self.postMessage(
          {
            type: "complete",
            payload: data,
          },
          [data.buffer]
        );
      } catch (error) {
        self.postMessage({ type: "error", payload: error.message });
      }
      break;
  }
};
