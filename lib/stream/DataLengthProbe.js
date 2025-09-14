import { GenericWorker } from "./GenericWorker.js";

export class DataLengthProbe extends GenericWorker {
    /**
     * A worker which calculate the total length of the data flowing through.
     * @constructor
     * @param {String} propName the name used to expose the length
     */
    constructor(propName) {
        super("DataLengthProbe for " + propName);
        this.propName = propName;
        this.withStreamInfo(propName, 0);
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        if (chunk) {
            var length = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = length + chunk.data.length;
        }
        GenericWorker.prototype.processChunk.call(this, chunk);
    };
}
