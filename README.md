# Node-Emulator
An experimental, work in progress, Ragnarok Online emulator written with Node.js

> **Note:** This project is for learning purposes only. For now, there is no intent to build a fully featured Ragnarok emulator.

## Technology stack
- Node.js
- Redis
- MongoDB

## Features
##### Single server setup
Unlike eAthena based emulators, I decided to try a single TCP/IP server instead of 3 (char, login and map). The main idea is to improve performance, code maintainability and reduce network traffic by eliminating inter-server packet exchange.

##### Multi-thread support
Node-Emulator uses Node.js cluster module to provide multi-thread support, taking advantage of multi-core systems to improve performance and a better use of system resources.
