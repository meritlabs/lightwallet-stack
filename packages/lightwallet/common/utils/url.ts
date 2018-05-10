
export function parseQuery(): object {
    var query = location.search.substr(1);
    var result = {};

    return query
        .split('&')
        .reduce((res, pair) => {
            const q = pair.split('=');
            return { ...res, [q[0]]: q[1]};
        }, {});
}

export function getQueryParam(key: string): string {
    return parseQuery()[key] || '';
}
