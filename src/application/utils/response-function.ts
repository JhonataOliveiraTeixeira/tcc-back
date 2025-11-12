export interface ResponseFunciton<T = object> {
  ok: boolean;
  data: T;
  error: Error | null;
}