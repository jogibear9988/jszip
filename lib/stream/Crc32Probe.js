import { GenericWorker } from "./GenericWorker.js";
import crc32 from "../crc32.js";

export class Crc32Probe extends GenericWorker {
    /**
     * A worker which calculate the crc32 of the data flowing through.
     * @constructor
     */
    constructor() {
        super("Crc32Probe");
        this.withStreamInfo("crc32", 0);
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
        this.push(chunk);
    }
}
