# Robosaur

This is a project template to start automating your labeling workflow with Datasaur.

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

### Create Multiple Projetcs

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

1. `config.documents.source` => `local`, `s3` or `gcs`  
   To enable [stateful](#stateful-execution) script execution, the script also need write access to a specific file inside the bucket.  
   Assuming we are using the same bucket for both storing the project documents as well as keeping the state file, here are the permission required

   1. For S3-compliant bucket, these are the IAM Roles required:
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

2. `state.path` => path to a JSON file.  
   For GCS and S3, this means path without protocol (`gs://` or `s3://`) and bucketName.  
   For example, a file `my-file.json` at S3 bucket `my-bucket` in folder `my-folder` accessed as `s3://my-bucket/my-folder/my-file.json` should be written as follows:

   ```json
   {
     "state": {
       "source": "s3",
       "bucketName": "my-bucket",
       "path": "my-folder/my-file.json"
     }
   }
   ```

3. `config.assignment.path` => same as `state.path` above  
   if we want to create a project without any labelers or reviewers, we can remove the `assignment` key from the JSON altogether.
4. `config.project.labelSetDirectory` => Optional. Relative or full path to a local folder containing labelsets  
   Currently, only labelsets in CSV format for token-based project are supported.  
   See [our gitbook](https://datasaurai.gitbook.io/datasaur/basics/creating-a-project/label-sets#token-based-labeling) for detailed information on the format. Sample files are also provided in the config/labelset directory
   The files in this directory will be listed and then sorted by its name in ascending order. The files will be converted to labelset in that order. To force a particular order, we could prefix the filenames with number, for example `filename.csv` -> `1.filename.csv`

To run the command, run:

```console
npm run start -- create-projects <pathToConfigJson>
```

Calling `create-projects` with a `remote` documents source is currently unsupported, and the command will fallback to creating just one project using `create-project`

### Stateful Execution

For the `create-projects` command, Robosaur can behave smarter with the help of a state file. This state file must be stored in the same `source` as the documents, meaning if we are using GCS bucket to store the documents, the state file needs to be somewhere in the same bucket as well.

The state file will keep track on what projects have been submitted to Datasaur for which teams.
This allows the script to be used to create projects using the same bucket structure for different teams by only changing the relevant config (for example `teamId`, `assignment` and `customScriptId`)

If this behavior is not wanted or needed, we can pass an emtpy string `''` to the `stateFilePath` config, and Robosaur will create a new in-memory state for each run. This will cause Robosaur to always create new projects based on the subfolders even if there are already projects with the same name in Datasaur.
