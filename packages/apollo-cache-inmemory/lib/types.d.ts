import { DocumentNode } from 'graphql';
import { FragmentMatcher } from 'graphql-anywhere';
import { Transaction } from 'apollo-cache';
import { StoreValue, IdValue } from 'apollo-utilities';
export declare type IdGetter = (value: Object) => string | null | undefined;
export interface NormalizedCache {
    [dataId: string]: StoreObject;
}
export declare type OptimisticStoreItem = {
    id: string;
    data: NormalizedCache;
    transaction: Transaction<NormalizedCache>;
};
export declare type ReadQueryOptions = {
    store: NormalizedCache;
    query: DocumentNode;
    fragmentMatcherFunction?: FragmentMatcher;
    variables?: Object;
    previousResult?: any;
    rootId?: string;
    config?: ApolloReducerConfig;
};
export declare type DiffQueryAgainstStoreOptions = ReadQueryOptions & {
    returnPartialData?: boolean;
};
export interface StoreObject {
    __typename?: string;
    [storeFieldKey: string]: StoreValue;
}
export declare type ApolloReducerConfig = {
    dataIdFromObject?: IdGetter;
    fragmentMatcher?: FragmentMatcher;
    addTypename?: boolean;
    customResolvers?: CustomResolverMap;
};
export declare type ReadStoreContext = {
    store: NormalizedCache;
    returnPartialData: boolean;
    hasMissingField: boolean;
    customResolvers: CustomResolverMap;
};
export interface FragmentMatcherInterface {
    match(idValue: IdValue, typeCondition: string, context: ReadStoreContext): boolean;
}
export declare type PossibleTypesMap = {
    [key: string]: string[];
};
export interface IdValueWithPreviousResult extends IdValue {
    previousResult?: any;
}
export declare type IntrospectionResultData = {
    __schema: {
        types: [{
            kind: string;
            name: string;
            possibleTypes: {
                name: string;
            }[];
        }];
    };
};
export declare type CustomResolver = (rootValue: any, args: {
    [argName: string]: any;
}) => any;
export declare type CustomResolverMap = {
    [typeName: string]: {
        [fieldName: string]: CustomResolver;
    };
};
