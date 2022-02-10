# Robosaur

Automation tool to get us started using [Datasaur.ai](https://datasaur.ai) API and team workspace

## Quickstart

Before running any Robosaur commands, we need to [generate our OAuth credentials](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0#generate-oauth-credentials-menu) and obtain our teamId from the URL.  
Before running this quickstart, we need to open [quickstart.json](sample/config/quickstart.json) and do these two things:

1. Replace all `<TEAM_ID>` with the correct teamId
2. Replace `<DATASAUR_CLIENT_ID>` and `<DATASAUR_CLIENT_SECRET>` with the correct values

Then we can run this command to create multiple projects at once:

```bash
npm ci # install Robosaur dependencies, run once on setup

npm run start -- create-projects sample/config/quickstart.json
```

To export the newly created projects, we can run this command:

```bash
npm run start -- export-projects sample/config/quickstart.json
```

## Contents

- [Robosaur](#robosaur)
  - [Quickstart](#quickstart)
  - [Contents](#contents)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [Stateful execution](#stateful-execution)

## Requirements

Robosaur is developed using TypeScript and Node.js. We recommend using these versions:

- [Node.js](https://nodejs.org/en/) v16.13.2
- NPM v8 (should be bundled with Node.js)

## Usage

Currently Robosaur supports two command: `create-projects` & `export-projects`. Please note that `export-projects` is designed to only process projects previously created by `create-projects` command.

For the explanation in this readme, we will use the file [quickstart.json](sample/config/quickstart.json) as reference

1. `create-projects`

    ```console
    $ npm run start -- create-projects -h
    Usage: robosaur create-projects [options] <configFile>

    Create Datasaur projects based on the given config file

    Options:
    --dry-run   Simulates what the script is doing without creating the projects
    -h, --help  display help for command
    ```

    Robosaur will try to create a project for each folder inside the `documents.path` folder. In this example, there should be two folders, `Project 1` & `Project 2` each with a single file

    ```json
    {
      "documents": {
        "source": "local",
        "path": "quickstart/create/documents"
      },
    }
    ```

2. `export-projects`

    ```console
    $ npm run start -- export-projects -h
    Usage: robosaur export-projects [options] <configFile>

    Export all projects based on the given config file

    Options:
      -u --unzip  Unzips the exported projects, only storing the final version accepted by reviewers
      -h, --help  display help for command
    ```

    Robosaur will try to export each projects previously created by the `create-projects` command. Each project will be saved as a separate zipfile under the supplied directory in `export.prefix`. For example, in `quickstart.json`, this is set to be `quickstart/export` like so:

    ```json
    {
      "export": {
        "source": "local",
        "prefix": "quickstart/export",
      }
    }
    ```

    By default, Robosaur will request for a full project export - with each labelers' version of the project document included. For simpler workflows, where we only need the final version of the document, we can use the `--unzip` option. With this option set, Robosaur will only save the final version of the document to the export destination.

    Robosaur supports filtering which project to export by the project status. Overall, there are five different project statuses, from earliest to latest as follows: `CREATED`, `IN_PROGRESS`, `REVIEW_READY`, `IN_REVIEW`, `COMPLETE`
    This can be set in the `export.statusFilter` inside the config JSON. In `quickstart.json`, the filter is set to an empty array `[]`. This will cause Robosaur to export all projects, regardless of their state. On the other hand, if we want to export completed projects only, we can set it to be like this:

    ```json
    {
      "export": {
        "statusFilter": ["COMPLETE"],
      }
    }
    ```

## Stateful execution

For the `create-projects` command, Robosaur can behave smarter with the help of a state file.

When creating multiple projects with `create-projects`, the state file will keep track on what projects have been submitted to Datasaur, and for which teams.
This allows the script to be used to create projects using the same bucket structure for different teams by only changing the relevant config (for example `teamId`, `assignment` and `customScriptId`)

For project export using `export-projects`, the state file will keep track which projects have been exported from which teams. In subsequent runs, any projects that have been previously exported will only be exported again if there is a forward change in the project status.  

For example, if we run the `export-projects` command with the filter set as `[IN_PROGRESS, REVIEW_READY, IN_REVIEW]`, and project `A` is in progress, it will be exported. The IN_PROGRESS status will also be recorded like so in the statefile like so

```json
{
  "projects": {
    "projectName": "A",
    "export": {
        "statusOnLastExport": "IN_PROGRESS",
    }
  }
}
```
