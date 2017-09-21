import { DocumentNode } from 'graphql';
import { Cache, DataProxy, ApolloCache, Transaction } from 'apollo-cache';
import { ApolloReducerConfig, NormalizedCache } from './types';
export declare function defaultDataIdFromObject(result: any): string | null;
export declare class InMemoryCache extends ApolloCache<NormalizedCache> {
    private data;
    private config;
    private optimistic;
    private watches;
    private addTypename;
    constructor(config?: ApolloReducerConfig);
    restore(data: NormalizedCache): ApolloCache<NormalizedCache>;
    extract(optimistic?: boolean): NormalizedCache;
    read<T>(query: Cache.ReadOptions): Cache.DiffResult<T>;
    write(write: Cache.WriteOptions): void;
    diff<T>(query: Cache.DiffOptions): Cache.DiffResult<T>;
    watch(watch: Cache.WatchOptions): () => void;
    evict(query: Cache.EvictOptions): Cache.EvictionResult;
    reset(): Promise<void>;
    removeOptimistic(id: string): void;
    performTransaction(transaction: Transaction<NormalizedCache>): void;
    recordOptimisticTransaction(transaction: Transaction<NormalizedCache>, id: string): void;
    transformDocument(document: DocumentNode): DocumentNode;
    readQuery<QueryType>(options: DataProxy.Query, optimistic?: boolean): Cache.DiffResult<QueryType>;
    readFragment<FragmentType>(options: DataProxy.Fragment, optimistic?: boolean): Cache.DiffResult<FragmentType> | null;
    writeQuery(options: DataProxy.WriteQueryOptions): void;
    writeFragment(options: DataProxy.WriteFragmentOptions): void;
    private broadcastWatches();
}
