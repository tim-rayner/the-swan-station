# 🧑‍🚀 LOST - DHARMA Initiative Countdown - Swan Station Interface

**Version:** 0.1

## 🎯 Objective

This project is a 1-month challenge to replicate the experience of the Swan Station computer from the LOST series, with a focus on enhanced sound design and real-time activity logging. The interface allows users to enter a sequence of numbers to reset a countdown timer, simulating the tension from the show. The experience includes immersive sound effects and real-time logging, hosted on a server and accessible from mobile-friendly devices.

## 🌍 Overview

Inspired by the iconic Swan Station from the LOST universe, this project recreates the tense experience of entering the infamous numbers (4, 8, 15, 16, 23, 42) to reset a countdown timer. Through global synchronization, users collaborate to keep the timer from reaching zero, with real-time updates and atmospheric sound effects enhancing the tension. If the countdown hits zero, an "Incident" is triggered, bringing intense sound effects, visual warnings, and more.

## 🚀 Key Features

### ⏲️ Real-Time Countdown Timer

- A globally synchronized countdown timer starting from 108 minutes (6480 seconds).
- Timer updates in real-time for all users across devices.

### 🔢 Input the Numbers

- Users must enter the sequence (4, 8, 15, 16, 23, 42) to reset the countdown.
- Incorrect sequences prompt a retry, while a correct sequence resets the timer globally.

### 🌐 Global Synchronization with Socket.IO

- Real-time updates to keep all users connected as the timer changes.
- Broadcasts user actions such as number entries and incidents to everyone.

### ⚠️ Incident Protocol

- Failure to reset the timer before zero triggers a dramatic "Incident" for all users.
- Sound effects like rumbles, alarms, and screen flickers simulate the intense Swan Station experience.

### 📱 Mobile-Friendly Design

- A fully responsive interface optimized for mobile devices, ensuring global participation.

### 📊 Persistence and Logging with MongoDB

- MongoDB stores the countdown state and logs all user actions (resets, incidents, inputs).
- Users can review past entries and actions through detailed logs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚧 Future Improvements

- Additional atmospheric enhancements.
- Customizable sound effects and incident triggers.
