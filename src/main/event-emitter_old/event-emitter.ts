import EventEmitter from 'events';

const eventEmitter = new EventEmitter();
export default eventEmitter;

// type EventMap = Partial<Record<string, unknown>>;

// type EventKey<T extends EventMap> = string & keyof T;
// type EventReceiver<T> = (params: T) => void;

// interface Emitter<T extends EventMap> {
//   on<K extends EventKey<T>>(eventName: K, func: EventReceiver<T[K]>): void;
//   off<K extends EventKey<T>>(eventName: K, func: EventReceiver<T[K]>): void;
//   emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
// }

// factory function
// function createEmitter<T extends EventMap>(): Emitter<T> {
//   return new EventEmitter();
// }
// const e = createEmitter<{ test: 'hi' }>();

// class TaskEmitter<T extends EventMap> implements Emitter<T> {
//   private readonly emitter;

//   constructor() {
//     this.emitter = new EventEmitter();
//   }

//   on<K extends EventKey<T>>(eventName: K, func: EventReceiver<T[K]>) {
//     this.emitter.on(eventName, func);
//   }

//   off<K extends EventKey<T>>(eventName: K, func: EventReceiver<T[K]>) {
//     this.emitter.off(eventName, func);
//   }

//   emit<K extends EventKey<T>>(eventName: K, params?: T[K]) {
//     this.emitter.emit(eventName, params);
//     this.emitter.emit('events');
//   }
// }

// type Default = {
//   events: void;
//   error: string;
// };

// type Http = {
//   httpGet: string;
// };

// type Store = {
//   store: void;
// };

// type All = Default & Store;

// const task = new TaskEmitter<Default & Store & Http>();
