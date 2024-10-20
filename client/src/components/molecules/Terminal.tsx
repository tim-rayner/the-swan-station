import { socket } from "../../socket";
import { KeyboardEvent, useRef, useState } from "react";

interface TerminalProps {
  secsRemaining?: number;
  resetTimer: () => void;
}

export default function Terminal({ secsRemaining, resetTimer }: TerminalProps) {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([
    "Welcome to the Dharma Initiative. You are currently located in The Swan Station.",
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleTerminalClick() {
    inputRef.current?.focus();
  }

  function handleInput(inputEvent: KeyboardEvent<HTMLInputElement>) {
    if (inputEvent.key === "Enter") {
      processCommand(input);
      setInput("");
    }
  }

  function processCommand(cmd: string) {
    let newLog = [];

    newLog.push(` ${cmd}`);

    //if command starts with msg:
    if (cmd.startsWith("msg:")) {
      const message = cmd.slice(4);
      sendMessage(message);
      newLog.push(`Message sent: ${message}`);
      return;
    }

    // Basic command response simulation
    switch (cmd.toLowerCase()) {
      case "help":
        newLog.push("Available commands: HELP, CLEAR");
        break;
      case "clear":
        clearLog();
        newLog = [];
        break;
      case "4 8 15 16 23 42":
        correctSequence(newLog);
        break;
      default:
        newLog.push("Unknown command. Type HELP for available commands.");
        break;
    }

    setLog(newLog);
  }

  function sendMessage(messageText: string) {
    if (messageText === "") {
      return;
    }

    socket.emit("sendMessage", { text: messageText, username: "Desmond" });
  }

  function clearLog() {
    setLog([]);
  }

  function correctSequence(log: string[]) {
    resetTimer();
    log.push("Correct sequence. Countdown resetting... ");

    setTimeout(() => {
      clearLog();
    }, 3000);
  }

  return (
    <div className="terminal  relative h-full" onClick={handleTerminalClick}>
      <div className="terminal-log whitespace-pre-wrap overflow-y-auto max-h-[90%]">
        {log.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
      <div className="terminal-input flex items-center">
        <span>&gt;:</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInput}
          autoFocus
          ref={inputRef}
          className="terminal-line-cursor-effect bg-[#031e11] text-green-700 border-none outline-none text-"
        />
      </div>
    </div>
  );
}
