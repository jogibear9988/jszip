import { GenericWorker } from "../stream/GenericWorker.js";

export class NodejsStreamInputAdapter extends GenericWorker {
    /**
     * A worker that use a nodejs stream as source.
     * @constructor
     * @param {String} filename the name of the file entry for this stream.
     * @param {Readable} stream the nodejs stream.
     */
    constructor(filename, stream) {
        super("Nodejs stream input adapter for " + filename);
        this._upstreamEnded = false;
        this._bindStream(stream);
    }

    /**
     * Prepare the stream and bind the callbacks on it.
     * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
     * @param {Stream} stream the nodejs stream to use.
     */
    _bindStream(stream) {
        var self = this;
        this._stream = stream;
        stream.pause();
        stream
            .on("data", function (chunk) {
                self.push({
                    data: chunk,
                    meta: {
                        percent: 0
                    }
                });
            })
            .on("error", function (e) {
                if (self.isPaused) {
                    this.generatedError = e;
                } else {
                    self.error(e);
                }
            })
            .on("end", function () {
                if (self.isPaused) {
                    self._upstreamEnded = true;
                } else {
                    self.end();
                }
            });
    };

    pause() {
        if (!GenericWorker.prototype.pause.call(this)) {
            return false;
        }
        this._stream.pause();
        return true;
    };

    resume() {
        if (!GenericWorker.prototype.resume.call(this)) {
            return false;
        }

        if (this._upstreamEnded) {
            this.end();
        } else {
            this._stream.resume();
        }

        return true;
    };
}
