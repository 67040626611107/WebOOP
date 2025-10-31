// Abstract State Manager - Abstraction Pattern
export abstract class BaseStateManager<T> {
  protected state: T;
  protected listeners: Set<(state: T) => void>;

  constructor(initialState: T) {
    this.state = initialState;
    this.listeners = new Set();
  }

  // Encapsulation - getter
  getState(): T {
    return { ...this.state };
  }

  // Abstract methods
  abstract setState(newState: Partial<T>): void;
  abstract reset(): void;

  // Observer pattern - subscribe to state changes
  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  protected notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}
