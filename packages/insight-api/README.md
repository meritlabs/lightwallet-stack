# Insight API

A Merit blockchain REST and web socket API service for [Merit Node](https://github.com/meritlabs/lightwallet-stack/tree/master/packages/merit-node).

This is a backend-only service. If you're looking for the web frontend application, take a look at https://github.com/meritlabs/lightwallet-stack/tree/master/packages/insight-ui.

## Getting Started

```
make start-stack
```

The API endpoints will be available by default at: `http://localhost:3001/insight-api/`

## Prerequisites

**Note:** You can use an existing Merit data directory, however `txindex`, `addressindex`, `timestampindex` and `spentindex` needs to be set to true in `merit.conf`, as well as a few other additional fields.

## Contributing

Please, check out our [Contribution guide](https://github.com/meritlabs/lightwallet-stack/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/meritlabs/lightwallet-stack/blob/master/CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](https://github.com/meritlabs/lightwallet-stack/blob/master/LICENSE).**

Copyright (C) 2013 - 2017 BitPay, Inc.
Copyright (C) 2017 - 2018 The Merit Foundation.
