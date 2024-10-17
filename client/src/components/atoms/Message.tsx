interface MessageProps {
  username: string;
  text: string;
}
export default function Message({ username, text }: MessageProps) {
  return (
    <div className="message">
      <p className="message-username">{username}</p>
      <p className="message-text">{text}</p>
    </div>
  );
}
