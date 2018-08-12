export function safeCall(fn: Function, args?: any[], exception?: any, scope?: any): void {
  if (typeof fn === 'function') {
    scope = scope || fn;
    args = args || [];
    fn.apply(scope, args);
    return;
  }

  if (exception) {
    throw exception;
  }
}
