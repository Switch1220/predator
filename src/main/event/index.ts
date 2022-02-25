import EventEmitter from 'events';

class TypedEvent<T> extends EventEmitter {
  on(eventName: string | symbol, listener: (args: T) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: string | symbol, args: T): boolean {
    return super.emit(eventName, args);
  }
}

// const task = new TypedEvent<string>();
const task = new EventEmitter();

export default task;
