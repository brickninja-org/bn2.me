# `@bn2me/client`

This is a client library to interact with the bn2.me API.

## Usage

```ts
import { Bn2MeClient } from '@bn2me/client';

const client = new Bn2MeClient({ client_id: '<client_id>' });
const url = client.getAuthorizationUrl({ /* ... */ });

// redirect user to url
```

## Installation

```
npm i @bn2me/client
```

## License

**@bn2me/client** is licensed under the [MIT License](./LICENSE).