interface Array<T> {
    groupBy(keyFn: (item: T) => string): { [key: string]: T[] };
    groupBy(key: string): { [key: string]: T[] };
}

if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T>(key: ((x: any) => string) | string) {
        if (typeof key === 'function') {
            return this.reduce(function (rv, x) {
                let k = key(x);
                (rv[k] = rv[k] || []).push(x);
                return rv;
            }, {});
        }

        if (typeof key === 'string') {
            return this.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

    }
}