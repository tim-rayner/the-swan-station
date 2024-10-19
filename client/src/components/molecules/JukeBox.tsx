//TODO: Add audio player

interface JukeBoxPlayerProps {
  minuteTickAudioRef: React.RefObject<HTMLAudioElement>;
  resetAudioRef: React.RefObject<HTMLAudioElement>;
}

export default function JukeBox({
  minuteTickAudioRef,
  resetAudioRef,
}: JukeBoxPlayerProps) {
  return (
    <>
      <audio ref={minuteTickAudioRef}>
        <source src="audio/tick.mp3" type="audio/mp3" />
      </audio>
      <audio ref={resetAudioRef}>
        <source src="audio/reset.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
}
