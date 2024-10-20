type Func<TArgs extends any[] = any[], TReturn = any> = (
  ...args: TArgs
) => TReturn;

function runOnce<TArgs extends any[], TReturn>(
  fn: Func<TArgs, TReturn>
): Func<TArgs, TReturn> & { once: Func<TArgs, TReturn> } {
  let hasRun = false;
  let result: TReturn;

  function runOnceWrapper(this: any, ...args: TArgs): TReturn {
    if (!hasRun) {
      hasRun = true;
      result = fn.apply(this, args);
    }
    return result;
  }

  runOnceWrapper.once = function (this: any, ...args: TArgs): TReturn {
    return runOnceWrapper.apply(this, args);
  };

  return runOnceWrapper as Func<TArgs, TReturn> & {
    once: Func<TArgs, TReturn>;
  };
}

export default runOnce;
