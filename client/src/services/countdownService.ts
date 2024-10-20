//GLOBAL COUNTDOWN SERVICE
//this service will keep a global instance of the countdown timer within the client.
//it will be responsible for fetching the timer data from the server and updating the local state
//it will also be responsible for synchronising the local timer with the server timer and handling synchronization with other clients using websockets

import { socket } from "@/socket";

export function resetTimer(
  callback: (newStartTime: Date, duration: number) => void
) {}
