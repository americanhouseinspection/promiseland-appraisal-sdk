# Promise Land Appraisal Node.js client and CLI

Read public business, residential appraisal service, service-area, and guide information from Node.js or the command line.

The API is public and read-only. It needs no account or API key. It does not accept appraisal requests, confirm address-level coverage, estimate property values or fees, book work, or take payment. This source repository is public, but the npm package remains private and has not been published.

## Run from source

```sh
git clone https://github.com/americanhouseinspection/promiseland-appraisal-sdk.git
cd promiseland-appraisal-sdk
```

Requires Node.js 18 or later. No dependencies need to be installed.

## Use from Node.js

```js
import { createAppraisalClient } from "./index.js";

const appraisals = createAppraisalClient();
const { business } = await appraisals.getBusinessProfile();
console.log(business.name, business.serviceArea);
```

The client also provides `listAppraisalServices`, `listServiceAreas`, `getRequestInformation`, `listGuides`, `getGuide`, and `searchGuides`.

## Use from the command line

```sh
node ./bin/promiseland-appraisal.js business
node ./bin/promiseland-appraisal.js services
node ./bin/promiseland-appraisal.js guide pricing
node ./bin/promiseland-appraisal.js search "How are appraisal fees quoted?"
```

Guide search accepts a general question only. Do not include a property address, phone number, or email address.

## Documentation

- API reference: <https://promiselandappraisals.com/api/>
- OpenAPI contract: <https://promiselandappraisals.com/openapi.json>
- MCP server guide: <https://promiselandappraisals.com/mcp/>
- Agent guide: <https://promiselandappraisals.com/agent.md>
