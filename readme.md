# Robosaur

Automation tool to get us started using [Datasaur.ai](https://datasaur.ai) API and team workspace

## Quickstart

Before running any Robosaur commands, we need to [generate our OAuth credentials](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0#generate-oauth-credentials-menu) and obtain our teamId from the URL.  
Before running this quickstart, we need to open [quickstart.json](sample/config/quickstart.json) and do these two things:

1. Replace all `<TEAM_ID>` with the correct teamId
2. Replace `<DATASAUR_CLIENT_ID>` and `<DATASAUR_CLIENT_SECRET>` with the correct values

Then we can run this command to create two projects at once:

```bash
npm ci # install Robosaur dependencies, run once on setup

npm run start -- create-projects sample/config/quickstart.json
```

## Requirements

Robosaur is developed using TypeScript and Node.js. We recommend using these versions:

- [Node.js](https://nodejs.org/en/) v16.13.2
- TypeScript
