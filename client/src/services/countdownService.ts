//GLOBAL COUNTDOWN SERVICE
//this service will keep a global instance of the countdown timer within the client.
//it will be responsible for fetching the timer data from the server and updating the local state
//it will also be responsible for synchronising the local timer with the server timer and handling synchronization with other clients using websockets

import { Socket } from "socket.io-client";

export default class CountdownService {
  private socket: Socket;
  private endTime: Date | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on("timer_update", (data: { endTime: string }) => {
      this.updateTimer(new Date(data.endTime));
    });
  }

  private updateTimer(newEndTime: Date): void {
    this.endTime = newEndTime;
    this.startCountdown();
  }

  private startCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      if (this.endTime) {
        const remainingTime = this.getRemainingTime();
        if (remainingTime <= 0) {
          this.stopCountdown();
        }
        // Emit an event or update UI with remaining time
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getRemainingTime(): number {
    if (!this.endTime) return 0;
    const now = new Date();
    return Math.max(0, this.endTime.getTime() - now.getTime());
  }

  public syncWithServer(): void {
    this.socket.emit("get_timer");
  }

  // ... existing code ...
}
