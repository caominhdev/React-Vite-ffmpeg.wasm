import { useState } from "react";
import { useFFmpeg } from "../hooks/useFFmpeg";

export default function VideoConverter() {
  const { transcode, isReady, progress, error } = useFFmpeg();
  const [outputUrl, setOutputUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsConverting(true);
      const transcoded = await transcode(file, "mp4");
      const blob = new Blob([transcoded], { type: "video/mp4" });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Transcoding error:", err);
    } finally {
      setIsConverting(false);
    }
  };

  if (!isReady) {
    return <div>Loading FFmpeg...</div>;
  }

  return (
    <div className="p-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isConverting}
        className="mb-4"
      />

      {isConverting && (
        <div className="mb-4">Converting: {Math.round(progress * 100)}%</div>
      )}

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {outputUrl && (
        <div className="mt-4">
          <video src={outputUrl} controls className="max-w-full" />
          <a
            href={outputUrl}
            download="converted-video.mp4"
            className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download Converted Video
          </a>
        </div>
      )}
    </div>
  );
}
