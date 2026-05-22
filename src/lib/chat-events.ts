import { EventEmitter } from 'events';

// Create a global event emitter to share events between different Next.js API route handlers
const globalForEvents = globalThis as unknown as {
  chatEmitter: EventEmitter | undefined;
};

export const chatEmitter = globalForEvents.chatEmitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.chatEmitter = chatEmitter;
}
