export default function getMedia() {
  console.log('getMedia');
  const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    const fun = await navigator.mediaDevices.getUserMedia(constraints);
    return fun;
  };
  try {
    const stream = openMediaDevices({ video: true, audio: true });
    console.log('Got MediaStream:', stream);
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}
