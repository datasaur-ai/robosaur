# Robosaur

Automation tool to get us started using [Datasaur.ai](https://datasaur.ai) API and team workspace.

## Quickstart

Before running any Robosaur commands, we need to [generate our OAuth credentials](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0#generate-oauth-credentials-menu) and obtain our teamId from the URL.

Before running this quickstart, we need to open [config.json](quickstart/token-based/config/config.json) and do these two things:

1. Replace all `<TEAM_ID>` with the correct teamId
2. Replace `<DATASAUR_CLIENT_ID>` and `<DATASAUR_CLIENT_SECRET>` with the correct values

Then we can run this command to create multiple projects at once:

```bash
npm ci # install Robosaur dependencies, run once on setup

npm run start -- create-projects quickstart/token-based/config/config.json
```

To export the newly created projects, we can run this command:

```bash
npm run start -- export-projects quickstart/token-based/config/config.json
```

[config.json](quickstart/token-based/config/config.json) is a sample configuration file for creating `"TOKEN_BASED"` projects.  
To create `"ROW_BASED"` projects, we need a slightly different configuration file, an example is provided in [config.json](quickstart/row-based/config/config.json).  
You can try to create row-based projects using the same commands as above just by changing the configuration files:

```bash
npm run start -- create-projects quickstart/row-based/config/config.json
```

For more in-depth breakdown, please refer to [row-based.md](row-based.md)

## Contents

- [Robosaur](#robosaur)
  - [Quickstart](#quickstart)
  - [Contents](#contents)
  - [Requirements](#requirements)
  - [Usage](#usage)
    - [`create-projects`](#create-projects)
    - [`export-projects`](#export-projects)
  - [Execution Modes](#execution-modes)
    - [Stateful Project Creation & Export](#stateful-project-creation--export)
    - [Stateless project export](#stateless-project-export)
  - [Configuration](#configuration)
    - [Script-wide configuration](#script-wide-configuration)
    - [Per-command configuration](#per-command-configuration)
    - [Storage configuration](#storage-configuration)
  - [Using PCW Payload](#using-pcw-payload)
    - [Providing Documents](#providing-documents)
    - [Providing Labeler and Reviewer Assigments through PCW Payload](#providing-labeler-and-reviewer-assigments-through-pcw-payload)

## Requirements

Robosaur is developed using TypeScript and Node.js. We recommend using these versions:

- [Node.js](https://nodejs.org/en/) v16.13.2
- NPM v8 (should be bundled with Node.js)

## Usage

Currently Robosaur supports two command: `create-projects` & `export-projects`. Please note that `export-projects` is designed to only process projects previously created by `create-projects` command.

For the explanation in this readme, we will use the file [config.json](quickstart/token-based/config/config.json) as reference

### `create-projects`

```console
$ npm run start -- create-projects -h
Usage: robosaur create-projects [options] <configFile>

Create Datasaur projects based on the given config file

Options:
--dry-run   Simulates what the script is doing without creating the projects
-h, --help  display help for command
```

Robosaur will try to create a project for each folder inside the `create.files.path` folder.

```json
{
  "files": {
    "source": "local",
    "path": "quickstart/token-based/documents"
  }
}
```

In this example, there should be two folders, `Project 1` & `Project 2`, each with a single file

```console
$ ls -lR quickstart/token-based/documents
total 0
drwxr-xr-x  3 user  group  Project 1
drwxr-xr-x  3 user  group  Project 2

quickstart/token-based/documents/Project 1:
total 8
-rw-r--r--  1 user  group  lorem.txt

quickstart/token-based/documents/Project 2:
total 8
-rw-r--r--  1 user  group  little prince.txt
```

### `export-projects`

```console
$ npm run start -- export-projects -h
Usage: robosaur export-projects [options] <configFile>

Export all projects based on the given config file

Options:
  -u --unzip  Unzips the exported projects, only storing the final version accepted by reviewers
  -h, --help  display help for command
```

Robosaur will try to export each projects previously created by the `create-projects` command. Each project will be saved as a separate zipfile under the supplied directory in `export.prefix`. For example, in `config.json`, this is set to be `quickstart/token-based/export` like so:

```json
{
  "export": {
    "source": "local",
    "prefix": "quickstart/token-based/export"
  }
}
```

By default, Robosaur will request for a full project export - with each labelers' version of the project document included. For simpler workflows, where we only need the final version of the document, we can use the `--unzip` option. With this option set, Robosaur will only save the final version of the document to the export destination.

Robosaur supports filtering which project to export by the project status. Overall, there are five different project statuses, from earliest to latest as follows: `CREATED`, `IN_PROGRESS`, `REVIEW_READY`, `IN_REVIEW`, `COMPLETE`
This can be set in the `export.statusFilter` inside the config JSON. In `quickstart.json`, the filter is set to an empty array `[]`. This will cause Robosaur to export all projects, regardless of their state. On the other hand, if we want to export completed projects only, we can set it to be like this:

```json
{
  "export": {
    "statusFilter": ["COMPLETE"]
  }
}
```

### `apply-tags`

```console
$ npm run start -- apply-tags -h
Usage: robosaur apply-tags [options] <configFile>

Applies tags to projects based on the given config file

Options:
  --method <method>   Update method between PUT and PATCH (default: "PUT")
  -h, --help          display help for command
```

Robosaur will try to apply tags to projects specified in the config file's payload, or from a separate csv file. The csv file can be from local or one of our supported Cloud Services.

With the default method, apply tags will replace all of the project tags with the input, just like PUT method on REST API. The same goes for PATCH, whereas it will only add new tags to a project. See the example below.

- Project A has Tag1.
- PUT ["Tag2"]: Project A will have only Tag2.
- PATCH ["Tag2"]: Project A will have Tag1 and Tag2.

If the tag in the config file is not present in the team, Robosaur will create the tag and apply it to the project automatically.

Example config format:

```json
{
  "applyTags": {
    "teamId": "<TEAM_ID>",
    "source": "inline",
    "payload": [
      {
        "projectId": "<PROJECT_ID_1>",
        "tags": ["<TAG_1>", "<TAG_2>"]
      },
      {
        "projectId": "<PROJECT_ID_2>",
        "tags": ["<TAG_3>"]
      }
    ]
  }
}
```

Example csv format:

```csv
tags,projectId
"<TAG_1>,<TAG_4>",<PROJECT_ID_1>
<TAG_2>,<PROJECT_ID_1>
<TAG_3>,<PROJECT_ID_2>
```

## Execution Modes

### Stateful Project Creation & Export

For both commands, Robosaur can behave a bit smarter with the help of a JSON statefile.

In multiple project creation using the `create-projects` command, the statefile can help keeping track which projects have been created previously, and Robosaur will not create the project again if it had been successfully created before.

In project export using `export-projects`, the JSON statefile is treated as source of truth. Only projects found in the statefile will be checked against the `statusFilter` and exported.  
Robosaur will also record the project state when it was last exported, and subsequent runs will only export the project if there had been a forward change in the project status

### Stateless project export

Robosaur now supports exporting project not created by Robosaur (stateless). To do this add the following options to the configuration file:

1. `"executionMode"`

   Specifies whether the projects to be exported is created with Robosaur or not. Fill with `"stateless"` for projects created outside Robosaur and `"stateful"` for projects created with Robosaur. The default value is `"stateful"`.

2. `"projectFilter"`

   Specifies which projects to be exported. Contains the following value:

   - `"kind"` (required)

     `TOKEN_BASED`, `ROW_BASED`, or `DOCUMENT_BASED`

   - `"date"`

     - `"newestDate"` (required)

       Ignores all projects created after this date.

     - `"oldestDate"`

       Ignores all projects created before this date.

   - `"tags"`

     Filter projects by its tag names.

Example:

```json
...
"export": {
  "source": "local",
  "prefix": "quickstart/token-based/export",
  "teamId": "1",
  "statusFilter": [],
  "executionMode": "stateless",
  "projectFilter": {
    "kind": "TOKEN_BASED",
    "date": {
      "newestDate": "2022-03-11",
      "oldestDate": "2022-03-07"
    },
    "tags": ["OCR"]
  },
  "format": "JSON_ADVANCED",
  "fileTransformerId": null
},
...
```

## Configuration

In this part we will explain each part of the Robosaur config file. We will use `config.json` as an example. An in-depth breakdown is also available as a TypeScript file in `src/config/interfaces.ts` [here](src/config/interfaces.ts)

### Script-wide configuration

1. `"datasaur"`  
   Contains our OAuth `clientId` and `clientSecret`. These credentials are only enabled for Growth and Enterprise plans. For more information, please reach out to [Datasaur](https://datasaur.ai)
2. `"projectState"`  
   Where we want our statefile to be saved. `projectState.path` can be a full or a relative path to a JSON file. For now, keep `source` as `local` for all `source`s.

### Per-command configuration

1. Project creation (`create-projects`)

   1. `"files"`  
      Where our project folders are located. A bit different from `projectState.path`, `create.files.path` should be a folder path - relative or full.
   2. `"assignment"`  
      Where our assignment file is located. `create.assignment.path` is similar to `projectState.path`, it should be a full or relative path pointing to a JSON file.  
      `assignment.strategy` accepts one of two options: `"ALL"` or `"AUTO"`

      - `"ALL"`: each labeler will receive a copy of all documents
      - `"AUTO"`: Datasaur will assign documents in a round-robin way, with each labeler receiving at least 1 copy of a document.

      For example, if we have a project with 3 different documents - `#1`, `#2`, `#3` - and 2 labeler, `Alice` and `Bob`, using

      1. `"ALL"` means both `Alice` and `Bob` will get those 3 documents.
      2. `"AUTO"` means `Alice` will get #1, `Bob` will get #2, and we then loop-back to `Alice` who will get #3  
         So, with `"AUTO"` -> `Alice` gets 2 documents, and `Bob` gets 1 document

   3. `"project"`  
      This is the Datasaur project configuration.  
      More options can be seen by creating a project via the web UI, and then clicking the `View Script` button.  
      In general, we want to keep these mostly unchanged, except for `project.teamId` and `project.fileTransformerId`
      1. `docFileOptions` - Configuration specific for `ROW_BASED` configs. Refer to [`row-based.md`](row-based.md) for more information.
      2. `splitDocumentOption` - Allows splitting each document to several parts, based on the `strategy` and `number` option. For more information, see <https://datasaurai.gitbook.io/datasaur/basics/workforce-management/split-files>

2. Project export (`export-projects`)
   1. `"export"`  
      This changes Robosaur's export behavior.  
      `export.prefix` is the folder path where Robosaur will save the export result - make sure Robosaur has write permission to the folder.  
      `export.format` & `export.fileTransformerId` affects how Datasaur will export our projects. See this [gitbook link](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/export-project#export-all-files) for more details.

### Storage configuration

There are numerous `"source": "local"` in many places, and we said to keep them as-is. For most use cases, creating and exporting projects to and from local storage is the simplest approach. However, Robosaur also supports project creation from files located in S3 buckets, GCS buckets, and Azure Blob Storage containers! All we need to do is set the correct credentials, and change the `source` to `s3`, `gcs`, or `azure`.

Here are the examples for credentials and other configs:

1. Google Cloud Storage - `config/google-cloud-storage/config.json`

   ```json
   {
     "credentials": {
       "gcs": { "gcsCredentialJson": "config/google-cloud-storage/credential.json" }
     },
     "files": {
       "source": "gcs",
       "bucketName": "my-bucket",
       "prefix": "projects"
     }
   }
   ```

   To fully use Robosaur with a GCS bucket, we can use the `Storage Object Admin` role.  
   The specific IAM permissions required are as follows:

   - storage.objects.list
   - storage.objects.get
   - storage.objects.create - to save export results to GCS bucket
   - storage.objects.delete - used with storage.objects.create to update the statefile

2. Amazon S3 Buckets - `config/s3/config.json`

   ```json
   {
     "credentials": {
       "s3": {
         "s3Endpoint": "s3.amazonaws.com",
         "s3Port": 443,
         "s3AccessKey": "accesskey",
         "s3SecretKey": "secretkey",
         "s3UseSSL": true,
         "s3Region": "bucket-region-or-null"
       }
     },
     "projectState": {
       "source": "s3",
       "bucketName": "my-bucket",
       "path": "path/to/stateFile.json"
     }
   }
   ```

   `s3Region` is an optional parameter, indicating where your S3 bucket is located.  
   However, we have encountered some cases where we got `S3: Access Denied` error when it is not defined.  
   We recommend setting this property whenever possible.  
   Usually, these are identified by access keys starting with `ASIA...`

   To fully use Robosaur with S3 buckets, these are the IAM Roles required:

   - s3:GetObject
   - s3:GetObjectAcl
   - s3:PutObject
   - s3:PutObjectAcl
   - s3:DeleteObject

3. Azure Blob Storage - `config/azure-blob-storage/config.json`

   ```json
   {
     "credentials": {
       "azure": {
         "connectionString": "my-connection-string",
         "containerName": "my-azure-container"
       }
     },
     "projectState": {
       "source": "azure",
       "bucketName": "my-azure-container",
       "path": "path/to/stateFile.json"
     }
   }
   ```

   Both `connectionString` and `containerName` are required.

   You can obtain your `connectionString` by copying one of the connection strings from your Azure Storage Account.

   The `containerName` is where you would upload your projects, inside a `projects` folder.

## Using PCW Payload

Robosaur's config file uses a different format compared to the **View Script** option during Project Creation Wizard (PCW). To use the script generated from PCW use the option `--use-pcw` on `create-projects` command.

```bash
npm run start -- create-projects <path-to-config-file> --use-pcw
```

When using `--use-pcw` option, provide both `pcwPayloadSource` and `pcwPayload` inside `project` in the config file.

`pcwPayloadSource` supports these values:

- `"inline"`: copy and paste the script from PCW directly inside `pcwPayload`

Example:

```json
{
  ...
  "project": {
    ...
    "pcwPayloadSource": {
      "source": "inline"
    },
    "pcwPayload": {
      <pasted from PCW>
    }
    ...
  }
  ...
}
```

- `"local"`: store the PCW script in a local file. `pcwPayload` should be a `string` containing path to the script file.

Example:

```json
{
  ...
  "project": {
    ...
    "pcwPayloadSource": {
      "source": "local"
    },
    "pcwPayload": "path/to/script/file.json"
    ...
  }
  ...
}
```

- `"gcs"`, `"s3"`, or `"azure"`: store the PCW script in an object cloud storage. `pcwPayloadSource` should contain another value called `bucketName` and `pcwPayload` should be a `string` containing a path to the file in the object cloud storage. Don't forget to provide credentials to the chosen cloud provider (refer [here](#storage-configuration)).

Example:

```json
{
  ...
  "credentials": {
    "gcs": { "gcsCredentialJson": "config/google-cloud-storage/credential.json" }
  },
  "project": {
    ...
    "pcwPayloadSource": {
      "source": "gcs",
      "bucketName": "my-bucket-name"
    },
    "pcwPayload": "path/to/script/file.json"
    ...
  }
  ...
}
```

### Providing Documents

Robosaur **does not** support providing documents through PCW payload. The `documents` option inside `pcwPayload` is still required to get the `question sets` and/or the `docFileOptions`, but all documents provided will be ignored. Instead, documents should be provided through the usual Robosaur method (refer [here](#create-projects)).

### Providing Labeler and Reviewer Assigments through PCW Payload

```json
{
  ...
  "assignment": { // use this only if you want to distribute by projects
    ...
  },
  "project": {
    ...
    "pcwPayloadSource": {
      "source": "inline",
    },
    "pcwAssignmentStrategy": "AUTO", // remove this if you want to distribute by projects
    "pcwPayload": {
      ...
      "documentAssignments": [
        {
          "teamMemberId": "1",
          "documents": [ // this will be ignored
            {
              "fileName": "lorem.txt",
              "part": 0
            }
          ],
          "role": "LABELER_AND_REVIEWER"
        },
        {
          "teamMemberId": "2",
          "documents": [  // this will be ignored
            {
              "fileName": "lorem.txt",
              "part": 0
            }
          ],
          "role": "LABELER"
        }
      ],
      ...
    }
    ...
  }
  ...
}
```

Robosaur supports using PCW's labeler and reviewer assignment settings, but note that `assignment` option **should not** be provided. Also, `documents` option used for assigning specific documents for each labelers will be ignored. Instead, use `pcwAssignmentStrategy` option to specify `AUTO` or `ALL` assignment method.
