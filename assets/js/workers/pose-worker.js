importScripts('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js');

const { FilesetResolver, PoseLandmarker } = self.Vision;

let poseLandmarker;
let lastTimestamp = 0;

self.addEventListener('message', async event => {
  const message = event.data;
  if (message.type === 'init') {
    try {
      const files = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
      poseLandmarker = await PoseLandmarker.createFromOptions(files, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message || 'Could not load the pose model.' });
    }
    return;
  }

  if (message.type === 'frame' && poseLandmarker) {
    const { bitmap, timestamp } = message;
    try {
      lastTimestamp = Math.max(lastTimestamp + 1, timestamp);
      const result = poseLandmarker.detectForVideo(bitmap, lastTimestamp);
      const landmarks = result.landmarks?.[0]?.map(({ x, y, z, visibility, presence }) => ({ x, y, z, visibility, presence })) || null;
      self.postMessage({ type: 'pose', landmarks });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message || 'Pose analysis failed.' });
    } finally {
      bitmap.close();
    }
  }

  if (message.type === 'close') {
    poseLandmarker?.close();
    poseLandmarker = null;
  }
});
