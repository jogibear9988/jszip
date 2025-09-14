import { GenericWorker } from "./GenericWorker.js";
import utils from "../utils.js";

export class ConvertWorker extends GenericWorker {
    /**
     * A worker which convert chunks to a specified type.
     * @constructor
     * @param {String} destType the destination type.
     */
    constructor(destType) {
        super("ConvertWorker to " + destType);
        this.destType = destType;
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        this.push({
            data: utils.transformTo(this.destType, chunk.data),
            meta: chunk.meta
        });
    }
}
