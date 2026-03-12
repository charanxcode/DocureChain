
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model BlockchainEvent
 * 
 */
export type BlockchainEvent = $Result.DefaultSelection<Prisma.$BlockchainEventPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more BlockchainEvents
 * const blockchainEvents = await prisma.blockchainEvent.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more BlockchainEvents
   * const blockchainEvents = await prisma.blockchainEvent.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.blockchainEvent`: Exposes CRUD operations for the **BlockchainEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BlockchainEvents
    * const blockchainEvents = await prisma.blockchainEvent.findMany()
    * ```
    */
  get blockchainEvent(): Prisma.BlockchainEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    BlockchainEvent: 'BlockchainEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "blockchainEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      BlockchainEvent: {
        payload: Prisma.$BlockchainEventPayload<ExtArgs>
        fields: Prisma.BlockchainEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlockchainEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlockchainEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          findFirst: {
            args: Prisma.BlockchainEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlockchainEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          findMany: {
            args: Prisma.BlockchainEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>[]
          }
          create: {
            args: Prisma.BlockchainEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          createMany: {
            args: Prisma.BlockchainEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BlockchainEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>[]
          }
          delete: {
            args: Prisma.BlockchainEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          update: {
            args: Prisma.BlockchainEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          deleteMany: {
            args: Prisma.BlockchainEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlockchainEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlockchainEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlockchainEventPayload>
          }
          aggregate: {
            args: Prisma.BlockchainEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlockchainEvent>
          }
          groupBy: {
            args: Prisma.BlockchainEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlockchainEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlockchainEventCountArgs<ExtArgs>
            result: $Utils.Optional<BlockchainEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model BlockchainEvent
   */

  export type AggregateBlockchainEvent = {
    _count: BlockchainEventCountAggregateOutputType | null
    _avg: BlockchainEventAvgAggregateOutputType | null
    _sum: BlockchainEventSumAggregateOutputType | null
    _min: BlockchainEventMinAggregateOutputType | null
    _max: BlockchainEventMaxAggregateOutputType | null
  }

  export type BlockchainEventAvgAggregateOutputType = {
    blockNumber: number | null
  }

  export type BlockchainEventSumAggregateOutputType = {
    blockNumber: number | null
  }

  export type BlockchainEventMinAggregateOutputType = {
    id: string | null
    txHash: string | null
    blockNumber: number | null
    eventName: string | null
    processedAt: Date | null
  }

  export type BlockchainEventMaxAggregateOutputType = {
    id: string | null
    txHash: string | null
    blockNumber: number | null
    eventName: string | null
    processedAt: Date | null
  }

  export type BlockchainEventCountAggregateOutputType = {
    id: number
    txHash: number
    blockNumber: number
    eventName: number
    payload: number
    processedAt: number
    _all: number
  }


  export type BlockchainEventAvgAggregateInputType = {
    blockNumber?: true
  }

  export type BlockchainEventSumAggregateInputType = {
    blockNumber?: true
  }

  export type BlockchainEventMinAggregateInputType = {
    id?: true
    txHash?: true
    blockNumber?: true
    eventName?: true
    processedAt?: true
  }

  export type BlockchainEventMaxAggregateInputType = {
    id?: true
    txHash?: true
    blockNumber?: true
    eventName?: true
    processedAt?: true
  }

  export type BlockchainEventCountAggregateInputType = {
    id?: true
    txHash?: true
    blockNumber?: true
    eventName?: true
    payload?: true
    processedAt?: true
    _all?: true
  }

  export type BlockchainEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlockchainEvent to aggregate.
     */
    where?: BlockchainEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlockchainEvents to fetch.
     */
    orderBy?: BlockchainEventOrderByWithRelationInput | BlockchainEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BlockchainEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlockchainEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlockchainEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BlockchainEvents
    **/
    _count?: true | BlockchainEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BlockchainEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BlockchainEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlockchainEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlockchainEventMaxAggregateInputType
  }

  export type GetBlockchainEventAggregateType<T extends BlockchainEventAggregateArgs> = {
        [P in keyof T & keyof AggregateBlockchainEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlockchainEvent[P]>
      : GetScalarType<T[P], AggregateBlockchainEvent[P]>
  }




  export type BlockchainEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlockchainEventWhereInput
    orderBy?: BlockchainEventOrderByWithAggregationInput | BlockchainEventOrderByWithAggregationInput[]
    by: BlockchainEventScalarFieldEnum[] | BlockchainEventScalarFieldEnum
    having?: BlockchainEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlockchainEventCountAggregateInputType | true
    _avg?: BlockchainEventAvgAggregateInputType
    _sum?: BlockchainEventSumAggregateInputType
    _min?: BlockchainEventMinAggregateInputType
    _max?: BlockchainEventMaxAggregateInputType
  }

  export type BlockchainEventGroupByOutputType = {
    id: string
    txHash: string
    blockNumber: number
    eventName: string
    payload: JsonValue
    processedAt: Date
    _count: BlockchainEventCountAggregateOutputType | null
    _avg: BlockchainEventAvgAggregateOutputType | null
    _sum: BlockchainEventSumAggregateOutputType | null
    _min: BlockchainEventMinAggregateOutputType | null
    _max: BlockchainEventMaxAggregateOutputType | null
  }

  type GetBlockchainEventGroupByPayload<T extends BlockchainEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlockchainEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlockchainEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlockchainEventGroupByOutputType[P]>
            : GetScalarType<T[P], BlockchainEventGroupByOutputType[P]>
        }
      >
    >


  export type BlockchainEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    blockNumber?: boolean
    eventName?: boolean
    payload?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["blockchainEvent"]>

  export type BlockchainEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    blockNumber?: boolean
    eventName?: boolean
    payload?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["blockchainEvent"]>

  export type BlockchainEventSelectScalar = {
    id?: boolean
    txHash?: boolean
    blockNumber?: boolean
    eventName?: boolean
    payload?: boolean
    processedAt?: boolean
  }


  export type $BlockchainEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BlockchainEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      txHash: string
      blockNumber: number
      eventName: string
      payload: Prisma.JsonValue
      processedAt: Date
    }, ExtArgs["result"]["blockchainEvent"]>
    composites: {}
  }

  type BlockchainEventGetPayload<S extends boolean | null | undefined | BlockchainEventDefaultArgs> = $Result.GetResult<Prisma.$BlockchainEventPayload, S>

  type BlockchainEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BlockchainEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BlockchainEventCountAggregateInputType | true
    }

  export interface BlockchainEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlockchainEvent'], meta: { name: 'BlockchainEvent' } }
    /**
     * Find zero or one BlockchainEvent that matches the filter.
     * @param {BlockchainEventFindUniqueArgs} args - Arguments to find a BlockchainEvent
     * @example
     * // Get one BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlockchainEventFindUniqueArgs>(args: SelectSubset<T, BlockchainEventFindUniqueArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BlockchainEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BlockchainEventFindUniqueOrThrowArgs} args - Arguments to find a BlockchainEvent
     * @example
     * // Get one BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlockchainEventFindUniqueOrThrowArgs>(args: SelectSubset<T, BlockchainEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BlockchainEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventFindFirstArgs} args - Arguments to find a BlockchainEvent
     * @example
     * // Get one BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlockchainEventFindFirstArgs>(args?: SelectSubset<T, BlockchainEventFindFirstArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BlockchainEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventFindFirstOrThrowArgs} args - Arguments to find a BlockchainEvent
     * @example
     * // Get one BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlockchainEventFindFirstOrThrowArgs>(args?: SelectSubset<T, BlockchainEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BlockchainEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlockchainEvents
     * const blockchainEvents = await prisma.blockchainEvent.findMany()
     * 
     * // Get first 10 BlockchainEvents
     * const blockchainEvents = await prisma.blockchainEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blockchainEventWithIdOnly = await prisma.blockchainEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BlockchainEventFindManyArgs>(args?: SelectSubset<T, BlockchainEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BlockchainEvent.
     * @param {BlockchainEventCreateArgs} args - Arguments to create a BlockchainEvent.
     * @example
     * // Create one BlockchainEvent
     * const BlockchainEvent = await prisma.blockchainEvent.create({
     *   data: {
     *     // ... data to create a BlockchainEvent
     *   }
     * })
     * 
     */
    create<T extends BlockchainEventCreateArgs>(args: SelectSubset<T, BlockchainEventCreateArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BlockchainEvents.
     * @param {BlockchainEventCreateManyArgs} args - Arguments to create many BlockchainEvents.
     * @example
     * // Create many BlockchainEvents
     * const blockchainEvent = await prisma.blockchainEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BlockchainEventCreateManyArgs>(args?: SelectSubset<T, BlockchainEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BlockchainEvents and returns the data saved in the database.
     * @param {BlockchainEventCreateManyAndReturnArgs} args - Arguments to create many BlockchainEvents.
     * @example
     * // Create many BlockchainEvents
     * const blockchainEvent = await prisma.blockchainEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BlockchainEvents and only return the `id`
     * const blockchainEventWithIdOnly = await prisma.blockchainEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BlockchainEventCreateManyAndReturnArgs>(args?: SelectSubset<T, BlockchainEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BlockchainEvent.
     * @param {BlockchainEventDeleteArgs} args - Arguments to delete one BlockchainEvent.
     * @example
     * // Delete one BlockchainEvent
     * const BlockchainEvent = await prisma.blockchainEvent.delete({
     *   where: {
     *     // ... filter to delete one BlockchainEvent
     *   }
     * })
     * 
     */
    delete<T extends BlockchainEventDeleteArgs>(args: SelectSubset<T, BlockchainEventDeleteArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BlockchainEvent.
     * @param {BlockchainEventUpdateArgs} args - Arguments to update one BlockchainEvent.
     * @example
     * // Update one BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BlockchainEventUpdateArgs>(args: SelectSubset<T, BlockchainEventUpdateArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BlockchainEvents.
     * @param {BlockchainEventDeleteManyArgs} args - Arguments to filter BlockchainEvents to delete.
     * @example
     * // Delete a few BlockchainEvents
     * const { count } = await prisma.blockchainEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BlockchainEventDeleteManyArgs>(args?: SelectSubset<T, BlockchainEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlockchainEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlockchainEvents
     * const blockchainEvent = await prisma.blockchainEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BlockchainEventUpdateManyArgs>(args: SelectSubset<T, BlockchainEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlockchainEvent.
     * @param {BlockchainEventUpsertArgs} args - Arguments to update or create a BlockchainEvent.
     * @example
     * // Update or create a BlockchainEvent
     * const blockchainEvent = await prisma.blockchainEvent.upsert({
     *   create: {
     *     // ... data to create a BlockchainEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlockchainEvent we want to update
     *   }
     * })
     */
    upsert<T extends BlockchainEventUpsertArgs>(args: SelectSubset<T, BlockchainEventUpsertArgs<ExtArgs>>): Prisma__BlockchainEventClient<$Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BlockchainEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventCountArgs} args - Arguments to filter BlockchainEvents to count.
     * @example
     * // Count the number of BlockchainEvents
     * const count = await prisma.blockchainEvent.count({
     *   where: {
     *     // ... the filter for the BlockchainEvents we want to count
     *   }
     * })
    **/
    count<T extends BlockchainEventCountArgs>(
      args?: Subset<T, BlockchainEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlockchainEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlockchainEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BlockchainEventAggregateArgs>(args: Subset<T, BlockchainEventAggregateArgs>): Prisma.PrismaPromise<GetBlockchainEventAggregateType<T>>

    /**
     * Group by BlockchainEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlockchainEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BlockchainEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlockchainEventGroupByArgs['orderBy'] }
        : { orderBy?: BlockchainEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BlockchainEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlockchainEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BlockchainEvent model
   */
  readonly fields: BlockchainEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlockchainEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlockchainEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BlockchainEvent model
   */ 
  interface BlockchainEventFieldRefs {
    readonly id: FieldRef<"BlockchainEvent", 'String'>
    readonly txHash: FieldRef<"BlockchainEvent", 'String'>
    readonly blockNumber: FieldRef<"BlockchainEvent", 'Int'>
    readonly eventName: FieldRef<"BlockchainEvent", 'String'>
    readonly payload: FieldRef<"BlockchainEvent", 'Json'>
    readonly processedAt: FieldRef<"BlockchainEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BlockchainEvent findUnique
   */
  export type BlockchainEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter, which BlockchainEvent to fetch.
     */
    where: BlockchainEventWhereUniqueInput
  }

  /**
   * BlockchainEvent findUniqueOrThrow
   */
  export type BlockchainEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter, which BlockchainEvent to fetch.
     */
    where: BlockchainEventWhereUniqueInput
  }

  /**
   * BlockchainEvent findFirst
   */
  export type BlockchainEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter, which BlockchainEvent to fetch.
     */
    where?: BlockchainEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlockchainEvents to fetch.
     */
    orderBy?: BlockchainEventOrderByWithRelationInput | BlockchainEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlockchainEvents.
     */
    cursor?: BlockchainEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlockchainEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlockchainEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlockchainEvents.
     */
    distinct?: BlockchainEventScalarFieldEnum | BlockchainEventScalarFieldEnum[]
  }

  /**
   * BlockchainEvent findFirstOrThrow
   */
  export type BlockchainEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter, which BlockchainEvent to fetch.
     */
    where?: BlockchainEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlockchainEvents to fetch.
     */
    orderBy?: BlockchainEventOrderByWithRelationInput | BlockchainEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlockchainEvents.
     */
    cursor?: BlockchainEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlockchainEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlockchainEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlockchainEvents.
     */
    distinct?: BlockchainEventScalarFieldEnum | BlockchainEventScalarFieldEnum[]
  }

  /**
   * BlockchainEvent findMany
   */
  export type BlockchainEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter, which BlockchainEvents to fetch.
     */
    where?: BlockchainEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlockchainEvents to fetch.
     */
    orderBy?: BlockchainEventOrderByWithRelationInput | BlockchainEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BlockchainEvents.
     */
    cursor?: BlockchainEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlockchainEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlockchainEvents.
     */
    skip?: number
    distinct?: BlockchainEventScalarFieldEnum | BlockchainEventScalarFieldEnum[]
  }

  /**
   * BlockchainEvent create
   */
  export type BlockchainEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * The data needed to create a BlockchainEvent.
     */
    data: XOR<BlockchainEventCreateInput, BlockchainEventUncheckedCreateInput>
  }

  /**
   * BlockchainEvent createMany
   */
  export type BlockchainEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BlockchainEvents.
     */
    data: BlockchainEventCreateManyInput | BlockchainEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlockchainEvent createManyAndReturn
   */
  export type BlockchainEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BlockchainEvents.
     */
    data: BlockchainEventCreateManyInput | BlockchainEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlockchainEvent update
   */
  export type BlockchainEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * The data needed to update a BlockchainEvent.
     */
    data: XOR<BlockchainEventUpdateInput, BlockchainEventUncheckedUpdateInput>
    /**
     * Choose, which BlockchainEvent to update.
     */
    where: BlockchainEventWhereUniqueInput
  }

  /**
   * BlockchainEvent updateMany
   */
  export type BlockchainEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BlockchainEvents.
     */
    data: XOR<BlockchainEventUpdateManyMutationInput, BlockchainEventUncheckedUpdateManyInput>
    /**
     * Filter which BlockchainEvents to update
     */
    where?: BlockchainEventWhereInput
  }

  /**
   * BlockchainEvent upsert
   */
  export type BlockchainEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * The filter to search for the BlockchainEvent to update in case it exists.
     */
    where: BlockchainEventWhereUniqueInput
    /**
     * In case the BlockchainEvent found by the `where` argument doesn't exist, create a new BlockchainEvent with this data.
     */
    create: XOR<BlockchainEventCreateInput, BlockchainEventUncheckedCreateInput>
    /**
     * In case the BlockchainEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlockchainEventUpdateInput, BlockchainEventUncheckedUpdateInput>
  }

  /**
   * BlockchainEvent delete
   */
  export type BlockchainEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
    /**
     * Filter which BlockchainEvent to delete.
     */
    where: BlockchainEventWhereUniqueInput
  }

  /**
   * BlockchainEvent deleteMany
   */
  export type BlockchainEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlockchainEvents to delete
     */
    where?: BlockchainEventWhereInput
  }

  /**
   * BlockchainEvent without action
   */
  export type BlockchainEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlockchainEvent
     */
    select?: BlockchainEventSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BlockchainEventScalarFieldEnum: {
    id: 'id',
    txHash: 'txHash',
    blockNumber: 'blockNumber',
    eventName: 'eventName',
    payload: 'payload',
    processedAt: 'processedAt'
  };

  export type BlockchainEventScalarFieldEnum = (typeof BlockchainEventScalarFieldEnum)[keyof typeof BlockchainEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type BlockchainEventWhereInput = {
    AND?: BlockchainEventWhereInput | BlockchainEventWhereInput[]
    OR?: BlockchainEventWhereInput[]
    NOT?: BlockchainEventWhereInput | BlockchainEventWhereInput[]
    id?: StringFilter<"BlockchainEvent"> | string
    txHash?: StringFilter<"BlockchainEvent"> | string
    blockNumber?: IntFilter<"BlockchainEvent"> | number
    eventName?: StringFilter<"BlockchainEvent"> | string
    payload?: JsonFilter<"BlockchainEvent">
    processedAt?: DateTimeFilter<"BlockchainEvent"> | Date | string
  }

  export type BlockchainEventOrderByWithRelationInput = {
    id?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    eventName?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
  }

  export type BlockchainEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    txHash?: string
    AND?: BlockchainEventWhereInput | BlockchainEventWhereInput[]
    OR?: BlockchainEventWhereInput[]
    NOT?: BlockchainEventWhereInput | BlockchainEventWhereInput[]
    blockNumber?: IntFilter<"BlockchainEvent"> | number
    eventName?: StringFilter<"BlockchainEvent"> | string
    payload?: JsonFilter<"BlockchainEvent">
    processedAt?: DateTimeFilter<"BlockchainEvent"> | Date | string
  }, "id" | "txHash">

  export type BlockchainEventOrderByWithAggregationInput = {
    id?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    eventName?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    _count?: BlockchainEventCountOrderByAggregateInput
    _avg?: BlockchainEventAvgOrderByAggregateInput
    _max?: BlockchainEventMaxOrderByAggregateInput
    _min?: BlockchainEventMinOrderByAggregateInput
    _sum?: BlockchainEventSumOrderByAggregateInput
  }

  export type BlockchainEventScalarWhereWithAggregatesInput = {
    AND?: BlockchainEventScalarWhereWithAggregatesInput | BlockchainEventScalarWhereWithAggregatesInput[]
    OR?: BlockchainEventScalarWhereWithAggregatesInput[]
    NOT?: BlockchainEventScalarWhereWithAggregatesInput | BlockchainEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BlockchainEvent"> | string
    txHash?: StringWithAggregatesFilter<"BlockchainEvent"> | string
    blockNumber?: IntWithAggregatesFilter<"BlockchainEvent"> | number
    eventName?: StringWithAggregatesFilter<"BlockchainEvent"> | string
    payload?: JsonWithAggregatesFilter<"BlockchainEvent">
    processedAt?: DateTimeWithAggregatesFilter<"BlockchainEvent"> | Date | string
  }

  export type BlockchainEventCreateInput = {
    id?: string
    txHash: string
    blockNumber: number
    eventName: string
    payload: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string
  }

  export type BlockchainEventUncheckedCreateInput = {
    id?: string
    txHash: string
    blockNumber: number
    eventName: string
    payload: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string
  }

  export type BlockchainEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockNumber?: IntFieldUpdateOperationsInput | number
    eventName?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlockchainEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockNumber?: IntFieldUpdateOperationsInput | number
    eventName?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlockchainEventCreateManyInput = {
    id?: string
    txHash: string
    blockNumber: number
    eventName: string
    payload: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string
  }

  export type BlockchainEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockNumber?: IntFieldUpdateOperationsInput | number
    eventName?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlockchainEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockNumber?: IntFieldUpdateOperationsInput | number
    eventName?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BlockchainEventCountOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    eventName?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
  }

  export type BlockchainEventAvgOrderByAggregateInput = {
    blockNumber?: SortOrder
  }

  export type BlockchainEventMaxOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    eventName?: SortOrder
    processedAt?: SortOrder
  }

  export type BlockchainEventMinOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    eventName?: SortOrder
    processedAt?: SortOrder
  }

  export type BlockchainEventSumOrderByAggregateInput = {
    blockNumber?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use BlockchainEventDefaultArgs instead
     */
    export type BlockchainEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BlockchainEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}