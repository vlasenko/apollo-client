"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_cache_1 = require("apollo-cache");
var apollo_utilities_1 = require("apollo-utilities");
var fragmentMatcher_1 = require("./fragmentMatcher");
var writeToStore_1 = require("./writeToStore");
var readFromStore_1 = require("./readFromStore");
var defaultConfig = {
    fragmentMatcher: new fragmentMatcher_1.HeuristicFragmentMatcher().match,
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
};
function defaultDataIdFromObject(result) {
    if (result.__typename) {
        if (result.id !== undefined) {
            return result.__typename + ":" + result.id;
        }
        if (result._id !== undefined) {
            return result.__typename + ":" + result._id;
        }
    }
    return null;
}
exports.defaultDataIdFromObject = defaultDataIdFromObject;
var InMemoryCache = (function (_super) {
    __extends(InMemoryCache, _super);
    function InMemoryCache(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.data = {};
        _this.optimistic = [];
        _this.watches = [];
        _this.config = __assign({}, defaultConfig, config);
        _this.addTypename = _this.config.addTypename ? true : false;
        return _this;
    }
    InMemoryCache.prototype.restore = function (data) {
        this.data = data;
        return this;
    };
    InMemoryCache.prototype.extract = function (optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        if (optimistic && this.optimistic.length > 0) {
            var patches = this.optimistic.map(function (opt) { return opt.data; });
            return Object.assign.apply(Object, [{}, this.data].concat(patches));
        }
        return this.data;
    };
    InMemoryCache.prototype.read = function (query) {
        if (query.rootId && typeof this.data[query.rootId] === 'undefined') {
            return null;
        }
        return readFromStore_1.readQueryFromStore({
            store: this.extract(query.optimistic),
            query: this.transformDocument(query.query),
            variables: query.variables,
            rootId: query.rootId,
            fragmentMatcherFunction: this.config.fragmentMatcher,
            previousResult: query.previousResult,
            config: this.config,
        });
    };
    InMemoryCache.prototype.write = function (write) {
        writeToStore_1.writeResultToStore({
            dataId: write.dataId,
            result: write.result,
            variables: write.variables,
            document: this.transformDocument(write.query),
            store: this.data,
            dataIdFromObject: this.config.dataIdFromObject,
            fragmentMatcherFunction: this.config.fragmentMatcher,
        });
        this.broadcastWatches();
    };
    InMemoryCache.prototype.diff = function (query) {
        return readFromStore_1.diffQueryAgainstStore({
            store: this.extract(query.optimistic),
            query: this.transformDocument(query.query),
            variables: query.variables,
            returnPartialData: query.returnPartialData,
            previousResult: query.previousResult,
            fragmentMatcherFunction: this.config.fragmentMatcher,
            config: this.config,
        });
    };
    InMemoryCache.prototype.watch = function (watch) {
        var _this = this;
        this.watches.push(watch);
        return function () {
            _this.watches = _this.watches.filter(function (c) { return c !== watch; });
        };
    };
    InMemoryCache.prototype.evict = function (query) {
        throw new Error("eviction is not implemented on InMemory Cache");
    };
    InMemoryCache.prototype.reset = function () {
        this.data = {};
        this.broadcastWatches();
        return Promise.resolve();
    };
    InMemoryCache.prototype.removeOptimistic = function (id) {
        var _this = this;
        var toPerform = this.optimistic.filter(function (item) { return item.id !== id; });
        this.optimistic = [];
        toPerform.forEach(function (change) {
            _this.recordOptimisticTransaction(change.transaction, change.id);
        });
        this.broadcastWatches();
    };
    InMemoryCache.prototype.performTransaction = function (transaction) {
        transaction(this);
    };
    InMemoryCache.prototype.recordOptimisticTransaction = function (transaction, id) {
        var before = this.extract(true);
        var orig = this.data;
        this.data = __assign({}, before);
        transaction(this);
        var after = this.data;
        this.data = orig;
        var patch = {};
        Object.keys(after).forEach(function (key) {
            if (after[key] !== before[key]) {
                patch[key] = after[key];
            }
        });
        this.optimistic.push({
            id: id,
            transaction: transaction,
            data: patch,
        });
        this.broadcastWatches();
    };
    InMemoryCache.prototype.transformDocument = function (document) {
        if (this.addTypename)
            return apollo_utilities_1.addTypenameToDocument(document);
        return document;
    };
    InMemoryCache.prototype.readQuery = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.read({
            query: options.query,
            variables: options.variables,
            optimistic: optimistic,
        });
    };
    InMemoryCache.prototype.readFragment = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.read({
            query: this.transformDocument(apollo_utilities_1.getFragmentQueryDocument(options.fragment, options.fragmentName)),
            variables: options.variables,
            rootId: options.id,
            optimistic: optimistic,
        });
    };
    InMemoryCache.prototype.writeQuery = function (options) {
        this.write({
            dataId: 'ROOT_QUERY',
            result: options.data,
            query: this.transformDocument(options.query),
            variables: options.variables,
        });
    };
    InMemoryCache.prototype.writeFragment = function (options) {
        this.write({
            dataId: options.id,
            result: options.data,
            query: this.transformDocument(apollo_utilities_1.getFragmentQueryDocument(options.fragment, options.fragmentName)),
            variables: options.variables,
        });
    };
    InMemoryCache.prototype.broadcastWatches = function () {
        var _this = this;
        this.watches.forEach(function (c) {
            var newData = _this.diff({
                query: c.query,
                variables: c.variables,
                previousResult: c.previousResult(),
                optimistic: c.optimistic,
            });
            c.callback(newData);
        });
    };
    return InMemoryCache;
}(apollo_cache_1.ApolloCache));
exports.InMemoryCache = InMemoryCache;
//# sourceMappingURL=inMemoryCache.js.map