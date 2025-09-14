
import { Readable } from "readable-stream";
//var Readable = require("readable-stream").Readable;

import utils from "../utils.js";
utils.inherits(NodejsStreamOutputAdapter, Readable);

export class NodejsStreamOutputAdapter extends Readable {
    /**
    * A nodejs stream using a worker as source.
    * @see the SourceWrapper in http://nodejs.org/api/stream.html
    * @constructor
    * @param {StreamHelper} helper the helper wrapping the worker
    * @param {Object} options the nodejs stream options
    * @param {Function} updateCb the update callback.
    */
    constructor(helper, options, updateCb) {
        Readable.call(this, options);
        this._helper = helper;

        var self = this;
        helper.on("data", function (data, meta) {
            if (!self.push(data)) {
                self._helper.pause();
            }
            if (updateCb) {
                updateCb(meta);
            }
        })
            .on("error", function (e) {
                self.emit("error", e);
            })
            .on("end", function () {
                self.push(null);
            });
    }


    _read() {
        this._helper.resume();
    };
}
