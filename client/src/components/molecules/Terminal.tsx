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
    <div
      className="terminal bg-black text-green-700 p-4 border-solid border-green-700 border-4 rounded-sm w-[90%] md:w-[600px] h-[200px] md:h-[400px] mx-auto my-6 overflow-y-auto "
      onClick={handleTerminalClick}
    >
      <div className="terminal-log whitespace-pre-wrap mb-3 overflow-y-auto max-h-[90%]">
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
          className="terminal-line-cursor-effect bg-black text-green-700 border-none outline-none text-"
        />
      </div>
    </div>
  );
}
