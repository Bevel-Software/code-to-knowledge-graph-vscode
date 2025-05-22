import express from 'express';
import { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Disposable } from 'vscode';
import commandRouter from './CommandRoute';
import vscode from 'vscode';
import * as net from 'net';

export class RestServer implements Disposable {
    private app: Express;
    private server: HttpServer | null = null;
    port: number;

    constructor() {
        this.port = 0;
        this.app = express();
        this.setupMiddleware();
        this.app.use("/api", commandRouter);
    }

    private setupMiddleware() {
        this.app.use(express.json());
        //this.app.use(express.urlencoded({ extended: true }));
    }

    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.server = this.app.listen(0, () => {
                    console.log(`Server is running on port ${this.port}`);
                    this.port = (this.server?.address() as net.AddressInfo).port
                    resolve();
                });
            } catch (error) {
                reject(error);
                console.error('Server error:', error);
            }
        });
    }

    public dispose() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }
}