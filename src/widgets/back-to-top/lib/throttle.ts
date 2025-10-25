type ThrottleFunction<T extends (...args: any[]) => void> = (this: ThisParameterType<T>, ...args: Parameters<T>) => void;

export const throttle = <T extends (...args: any[]) => void>(func: T, delay: number): ThrottleFunction<T> => {
    let lastCall = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T>;
    let lastThis: ThisParameterType<T>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);
        lastArgs = args;
        lastThis = this;

        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCall = now;
            func.apply(lastThis, lastArgs);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                lastCall = Date.now();
                timeout = null;
                func.apply(lastThis, lastArgs);
            }, remaining);
        }
    } as ThrottleFunction<T>;
};
