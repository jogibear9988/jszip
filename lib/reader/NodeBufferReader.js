import { Uint8ArrayReader } from "./Uint8ArrayReader.js";

export class NodeBufferReader extends Uint8ArrayReader {
    constructor(data) {
        super(data);
    }

    /**
     * @see DataReader.readData
     */
    readData(size) {
        this.checkOffset(size);
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
    }
}
