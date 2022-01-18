# Robosaur

This is a project template to start automating your labeling workflow with Datasaur.

## Requirements

- NodeJS 12.16.0 or newer
- NPM 6 or newer

## Installation

```bash
npm ci
```

## Usage

Obtain Oauth Credentials from this guide: <https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0>

### Create Project

1. Create a config based on the sample file provided in config folder.
   See src/config/interfaces.ts for the whole schema and description of the config file.
2. Run the script below:

   ```
   npm start create-project <projectName> <configFile>
   ```

   - projectName: Name of the project you wish to create.
   - configFile: Path to the configuration of project relative to the current working directory or absolute path.
