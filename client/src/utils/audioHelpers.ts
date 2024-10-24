export function playAudio(audioRef: React.RefObject<HTMLAudioElement>) {
  try {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch(() => {
          console.warn(
            "Audio playback failed:",
            "user must interact with page before sound is enabled"
          );
        })
        .then(() => console.log("Audio played"));
    }
  } catch (error) {
    console.warn("Audio playback failed:", error);
  }
}
