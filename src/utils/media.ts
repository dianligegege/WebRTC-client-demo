export function getMedia() {
  const constraints = {
    video: true,
    audio: true,
  };
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      console.log('Got MediaStream:', stream);
    })
    .catch((error) => {
      console.error('Error accessing media devices.', error);
    });
}

export function getDevices() {
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      console.log('zl-devices', devices);
    });
}
