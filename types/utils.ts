export type NotOptional<Type> = {
  [Property in keyof Type]: Exclude<Type, undefined>;
};