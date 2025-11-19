import type { Profile } from "../../types/globals";


type Resolver<T> = (value: T | PromiseLike<T>) => void;

export class ProfileBuffer {
  // Bounded buffer
  private buffer: Profile[] = [];
  private readonly capacity: number;

  // Pending events
  private pendingResolvers: Resolver<Profile>[] = [];
  private pendingProducers: Resolver<null>[] = [];

  public loading = true;

  constructor(capacity: number) {
    this.capacity = capacity;
  }
/**
   * Add an item to the queue (producer).
   * Resolves immediately if space is free,
   * waits if buffer is full.
   */
  async produce(item: Profile): Promise<void> {
    // Check for full buffer
    if (this.buffer.length >= this.capacity) {
      // Wait to be resolved
      await new Promise<void>((resolve) => {
        this.pendingProducers.push(() => resolve());
      });
    }

    // If a consumer is waiting, resolve immediately
    if (this.pendingResolvers.length > 0) {
      const resolve = this.pendingResolvers.shift()!;
      resolve(item);
      return;
    }

    this.buffer.push(item);
    this.loading = false;
  }

  /**
   * Remove an item from the queue (consumer).
   * Waits if buffer is empty.
   */
  async consume(): Promise<Profile> {
    if (this.buffer.length > 0) {
      const item = this.buffer.shift()!;
      if (this.buffer.length === 0) this.loading = true;

      // Free a waiting producer if buffer dropped below capacity
      if (this.pendingProducers.length > 0) {
        const unblock = this.pendingProducers.shift()!;
        unblock(null);
      }

      return item;
    }

    // Empty → consumer waits
    this.loading = true;
    return new Promise<Profile>((resolve) => {
      this.pendingResolvers.push(resolve);
    });
  }
}