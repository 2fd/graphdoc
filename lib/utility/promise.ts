/**
 * toPromise execution a Node function as Promise
 */
export function toPromise(func: Function, args: any[] = []): Promise<any> {

    function execution(resolve, reject): void {

        (execution as any).args
            .push((err: Error, result: any) => err ? reject(err) : resolve(result));

        (execution as any).func(...args);
    }

    (execution as any).args = args;
    (execution as any).func = func;

    return new Promise(execution);
}