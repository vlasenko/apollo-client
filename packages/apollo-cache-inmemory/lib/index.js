"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var inMemoryCache_1 = require("./inMemoryCache");
exports.defaultDataIdFromObject = inMemoryCache_1.defaultDataIdFromObject;
__export(require("./readFromStore"));
__export(require("./writeToStore"));
__export(require("./fragmentMatcher"));
exports.default = inMemoryCache_1.InMemoryCache;
//# sourceMappingURL=index.js.map