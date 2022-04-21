# Robosaur

This is a project template to start automating your labeling workflow with Datasaur.

## Contents

- [Robosaur](#robosaur)
  - [Contents](#contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Create Project](#create-project)
    - [Create Multiple Projects](#create-multiple-projects)
    - [Export Multiple Projects](#export-multiple-projects)
  - [Stateful Execution](#stateful-execution)

## Requirements

- NodeJS v16.13.2 or newer
- NPM 8 or newer

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

   ```console
   npm run start -- create-project <projectName> <configFile>
   ```

   - projectName: Name of the project you wish to create.
   - configFile: Path to the configuration of project relative to the current working directory or absolute path.

---

### Create Multiple Projects

```console
npm run start -- create-projects <pathToConfigJson>
```

This command will create multiple project with the same configuration but different documents.  
Currently, the documents have to be stored in an S3-compliant bucket, a GCS bucket or in a local folder.  
The general structure for the folder should match this:

```txt
bucketName
|__prefix
|   |____A
|   | |____<project documents here>
|   | |____...
|   |____B
|   | |____...
|   |____C
|   | |____...

path
|____A
| |____<project documents here>
| |____...
|____B
| |____...
|____C
| |____...
```

In the above example, each subfolders, [`A`, `B`, `C`] will be created into a separate project in Datasaur. The subfolders' name will become the project name.

Create a config file to set all the common project configuration.  
Sample config files for GCS and S3 are available in `config/google-cloud-storage` and `config/s3-compliant`.
Additional configs like project assignment and labelset for all projects can also be configured here.  
Here are a couple important details about the storage configuration:

1. `config.credentials` => a JSON object with two possible keys: `s3` or `gcs`  
   For `s3`, we need to provide five values: `s3Endpoint`, `s3Port`, `s3AccessKey`, `s3SecretKey`, and `s3UseSSL`.  
   Typical AWS S3 config would be as follows:

   ```json
   {
     "s3Endpoint": "s3.amazonaws.com",
     "s3Port": 443,
     "s3AccessKey": "<accessKey>",
     "s3SecretKey": "<secretKey>",
     "s3UseSSL": true
   }
   ```

   For GCS, there is only one value, `gcsCredentialJSON` which should be a local file path pointing to a JSON file similar to the one available in `config/google-cloud-storage/credential.json`.

2. `config.files.source` => `local`, `s3` or `gcs`  
   To enable [stateful](#stateful-execution) script execution, the script also need write access to a specific file inside the bucket.  
   Assuming we are using the same bucket for both storing the project documents as well as keeping the state file, here are the permission required

   1. For S3 bucket, these are the IAM Roles required:
      1. s3:GetObject
      2. s3:GetObjectAcl
      3. s3:PutObject
      4. s3:PutObjectAcl
      5. s3:DeleteObject
   2. For GCS bucket, we can use the `Storage Object Admin` role. The specific IAM permissions required are as follows:
      1. storage.objects.list
      2. storage.objects.get
      3. storage.objects.create
      4. storage.objects.delete - used with storage.objects.create to update the statefile

3. `config.projectState.path` => path to a JSON file.  
   For GCS and S3, this means path without protocol (`gs://` or `s3://`) and bucketName.  
   For example, a file `my-file.json` at S3 bucket `my-bucket` in folder `my-folder` accessed as `s3://my-bucket/my-folder/my-file.json` should be written as follows:

   ```json
   {
     "projectState": {
       "source": "s3",
       "bucketName": "my-bucket",
       "path": "my-folder/my-file.json"
     }
   }
   ```

4. `config.assignment.path` => same as `projectState.path` above  
   if we want to create a project without any labelers or reviewers, we can remove the `assignment` key from the JSON altogether.
5. `config.project.labelSetDirectory` => Optional. Relative or full path to a local folder containing labelsets  
   Currently, only labelsets in CSV format for token-based project are supported.  
   See [our gitbook](https://datasaurai.gitbook.io/datasaur/basics/creating-a-project/label-sets#token-based-labeling) for detailed information on the format. Sample files are also provided in the config/labelset directory
   The files in this directory will be listed and then sorted by its name in ascending order. The files will be converted to labelset in that order. To force a particular order, we could prefix the filenames with number, for example `filename.csv` -> `1 filename.csv`. The leading number will be removed using `String.replace` with this RegEx pattern: `/^(\d*)/`

Calling `create-projects` with a `remote` files source is currently unsupported, and the command will fallback to creating just one project using `create-project`

### Export Multiple Projects

```console
npm run start -- export-projects <pathToConfigJson> [--unzip]
```

This command will export all projects matching the `config.export.statusFilter` specified. The optional `--unzip` option is used to extract the export results, and only save the documents from the `REVIEW` cabinet. This is useful if what we need is the final version of the project's document.  
This command is intended to be used in combination with the stateful `create-projects` command, as this command will only export projects that are already listed in the statefile.  
For in-depth project export config details, please refer to `config/interfaces.ts`, especially the `ExportConfig` interface.  
Some notable ones are:

1. `statusFilter` => used to filter which projects will be exported by Robosaur  
   The filter are applied using logical OR operation, for example specifying `["IN_PROGRESS", "COMPLETE"]` as the filter means all projects that is either IN_PROGRESS or COMPLETE will be exported.  
   A common example would be to do the export when the project has been marked completed by the labeler. To do this, we would apply the `["REVIEW_READY", "IN_REVIEW"]` filter. If we also want to export reviewed projects, we can add `"COMPLETE"` to the filter.
2. `format` => what export format to export the project with  
   Please note that not all types of project can be exported to all export format. For more complete details, please refer to Datasaur's GitBook [here](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/export-project#export-all-files)
3. `customScriptId` => which custom export script to use
   This field is only used when the `format` field is set to `CUSTOM`.  
   The ID itself can be obtained from the custom script URL in this format: `https://app.datasaur.ai/teams/{teamId}/custom-scripts/{custom-script-id}`.  
   For more details in creating and / or using your own custom export script, please refer to Datasaur GitBook [here](https://datasaurai.gitbook.io/datasaur/basics/workforce-management/custom-scripts)
4. `source`, `prefix` => where the export results should be saved.  
   `source` can be either `local`, `s3` or `gcs`. For `s3` and `gcs`, we will also need to specify `bucketName` and `config.credentials` to give Robosaur access to the bucket.  
   `prefix` sets the folder that will contain the export results. If we want Robosaur to save in the root directory (for example to the root directory of S3 bucket) we can set `prefix` to an empty string `""`.

## Stateful Execution

For the `create-projects` command, Robosaur can behave smarter with the help of a state file.

In case of project creation using `create-projects`, the state file will keep track on what projects have been submitted to Datasaur, and for which teams.
This allows the script to be used to create projects using the same bucket structure for different teams by only changing the relevant config (for example `teamId`, `assignment` and `customScriptId`)

For project export using `export-projects`, the state file will keep track which projects have been exported from which teams. In subsequent runs, any projects that have been previously exported will only be exported again if there is a change in the project status.

For example, if we run the `export-projects` command with the filter set as `[IN_PROGRESS, REVIEW_READY, IN_REVIEW]`, and project `A` is in progress, it will be exported. The IN_PROGRESS status will also be recorded like so in the statefile.

```json
"projects": {
   "projectName": "A",
   "export": {
      "statusOnLastExport": "IN_PROGRESS",
   }
}
```

The next time we run the script again, if project `A` is still IN_PROGRESS, it will not be exported again. However, should the status move forward into `REVIEW_READY` (labeler has marked the project as complete, but no reviewer has opened the project yet) or `IN_REVIEW` (any reviewer has opened the project at least once), Project `A` will be exported again.  
If project `A` was marked as complete by the reviewer, the status will update to `COMPLETE`. In this case, the project will not be exported because `COMPLETE` was not specified in the filter.

If these behaviors are not wanted or needed, we can pass an emtpy string `''` to the `config.projectState.path` field or setting `config.projectState` to `{}`, and Robosaur will create a new in-memory state for each run.
This will cause Robosaur to always create new projects based on the subfolders even if there are already projects with the same name in Datasaur.
