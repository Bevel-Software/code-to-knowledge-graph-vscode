import { EventEmitter } from "events";

export interface BatchProcessorOptions<T, R> {
    /**
     * Array of input items to process
     */
    input: T[];
    
    /**
     * Maximum number of concurrent operations
     */
    batchSize?: number;
    
    /**
     * Function to process a single item
     */
    processItemAsync: (item: T, index: number) => Promise<R>;
    
    /**
     * Optional error handler
     */
    onError?: (error: any, item: T, index: number) => void;
}

export class BatchProcessor<T, R> {
    private currentIndex: number;
    private bus: EventEmitter;
    private promises: Promise<void>[];
    private results: R[];
    private options: BatchProcessorOptions<T, R>;

    constructor(options: BatchProcessorOptions<T, R>) {
        this.options = {
            batchSize: 100, // Default batch size
            ...options
        };
        this.currentIndex = Math.min(this.options.input.length, this.options.batchSize!) - 1;
        this.bus = new EventEmitter();
        this.promises = [];
        this.results = Array(this.options.input.length);
    }

    private async processNext(index: number): Promise<void> {
        try {
            const result = await this.options.processItemAsync(this.options.input[index], index);
            if(index % 25 === 0) console.log('[BatchProcessor] Processed item at index', index);
            this.results[index] = result;
            this.onItemProcessed();
        } catch (error) {
            this.options.onError?.(error, this.options.input[index], index);
            this.results[index] = undefined as R;
        }
    }

    private onItemProcessed() {
        if (this.currentIndex >= this.options.input.length - 1) return;
        this.currentIndex++;
        this.promises.push(this.processNext(this.currentIndex));
        this.bus.emit('unlocked');
    }

    public async process(): Promise<R[]> {
        // Initialize first batch of promises
        const initialBatchSize = Math.min(this.options.input.length, this.options.batchSize!);
        for (let i = 0; i < initialBatchSize; i++) {
            this.promises.push(this.processNext(i));
        }

        // Wait for all items to complete while respecting batch size
        for (let i = 0; i < this.options.input.length; i++) {
            if (i > this.currentIndex) {
                await new Promise(resolve => this.bus.once('unlocked', resolve));
            }
            await this.promises[i];
        }

        return this.results;
    }
}
