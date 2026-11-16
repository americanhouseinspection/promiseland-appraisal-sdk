#!/usr/bin/env node

import { createAppraisalClient } from "../index.js";

const [command, ...args] = process.argv.slice(2);
const usage = `Usage: promiseland-appraisal <command>

Commands:
  health                    Check API availability
  business                  Read the public business profile
  services                  List residential appraisal services
  areas                     List service-area guidance
  request-info              Read contact requirements
  guides                    List public guides
  guide <slug>              Read one public guide
  search <question>         Search guides with a general question
`;

const commands = {
  health: (client) => client.getHealth(),
  business: (client) => client.getBusinessProfile(),
  services: (client) => client.listAppraisalServices(),
  areas: (client) => client.listServiceAreas(),
  "request-info": (client) => client.getRequestInformation(),
  guides: (client) => client.listGuides(),
  guide: (client) => client.getGuide(args[0]),
  search: (client) => client.searchGuides(args.join(" ")),
};

if (command === "--help" || command === "-h" || command === undefined) {
  process.stdout.write(usage);
} else if (!Object.hasOwn(commands, command) || ((command === "guide" || command === "search") && args.length === 0)) {
  process.stderr.write(usage);
  process.exitCode = 2;
} else {
  try {
    const client = createAppraisalClient();
    const result = await commands[command](client);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.name}: ${error.message}\n`);
    if (error.code && error.code !== "HTTP_ERROR") process.stderr.write(`Code: ${error.code}\n`);
    if (error.resolution) process.stderr.write(`Next step: ${error.resolution}\n`);
    process.exitCode = 1;
  }
}
