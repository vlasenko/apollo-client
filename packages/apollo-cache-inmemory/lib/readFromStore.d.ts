import { IdValue } from 'apollo-utilities';
import { Cache } from 'apollo-cache';
import { ReadQueryOptions, DiffQueryAgainstStoreOptions } from './types';
export declare const ID_KEY: string | symbol;
export declare function readQueryFromStore<QueryType>(options: ReadQueryOptions): Cache.DiffResult<QueryType>;
export declare function diffQueryAgainstStore<T>({store, query, variables, previousResult, returnPartialData, rootId, fragmentMatcherFunction, config}: DiffQueryAgainstStoreOptions): Cache.DiffResult<T>;
export declare function assertIdValue(idValue: IdValue): void;
