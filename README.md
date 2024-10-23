I'll help you create a React + Vite setup for ffmpeg.wasm with proper Web Worker integration.

This setup provides a complete React application with FFmpeg.wasm integration. Here's a breakdown of the key components:

1. **Vite Configuration**:

   - Configured for React
   - Sets required CORS headers
   - Handles Web Worker and WebAssembly properly

2. **FFmpeg Worker**:

   - Handles initialization and transcoding
   - Reports progress during conversion
   - Uses transferable objects for efficient data passing

3. **Custom Hook (useFFmpeg)**:

   - Manages worker lifecycle
   - Handles state and progress
   - Provides easy-to-use transcode function

4. **React Component**:
   - File input handling
   - Progress display
   - Video preview and download

To use this setup:

1. Install dependencies:

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util react react-dom
npm install -D @vitejs/plugin-react vite
```

2. Create the files as shown in the artifact

3. Add the VideoConverter component to your app:

```jsx
import VideoConverter from "./components/VideoConverter";

function App() {
  return (
    <div>
      <h1>Video Converter</h1>
      <VideoConverter />
    </div>
  );
}
```

4. Start the development server:

```bash
npm run dev
```

The setup includes:

- Progress tracking during conversion
- Error handling
- Preview of converted video
- Download option for the converted file
- Clean separation of concerns using custom hooks

Would you like me to explain any part in more detail or add additional features like:

- Support for more output formats
- Custom FFmpeg command options
- Multiple file processing
- Thumbnail generation
