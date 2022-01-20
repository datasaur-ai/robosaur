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

   ```console
   npm run start -- create-project <projectName> <configFile>
   ```

   - projectName: Name of the project you wish to create.
   - configFile: Path to the configuration of project relative to the current working directory or absolute path.

### Create Multiple Projetcs

This command will create multiple project with the same configuration but different documents.  
Currently, the documents have to be stored in an S3-compliant bucket or a GCS bucket.
Create a config file to set all the common project configuration.  
Sample config files for GCS and S3 are available in `config/google-cloud-storage` and `config/s3-compliant`.
Additional configs like project assignment and labelset for all projects can also be configured here.  
Here are a couple important details about the storage configuration:

1. `config.documents.source` => `s3` or `gcs`  
   To enable stateful script execution, the script also need write access to a specific file inside the bucket.  
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

2. `stateFilePath` => full URI to a JSON file.  
   For GCS bucket, an example URI would be: `gs://{bucketName}/path/to/file.json`  
   This file will be continuously overwritten every time the script is run.
3. `config.assignment.path` => if source is `gcs` or `s3`, `path` should be the full URI same as `staticFilePath`.  
   if source is `config.assignment.local`, `path` should be relative or full path to json file
4. `config.project.labelSetDirectory` => Optional. Relative or full path to a local folder containing labelsets csv  
   The files in this directory will be listed and then sorted by its name in ascending order. The files will be converted to labelset in that order. To force a particular order, we could prefix the filenames with number, for example `filename.csv` -> `1.filename.csv`

To run the command, run:

```console
npm run start -- create-projects <pathToConfigJson>
```

Calling `create-projects` with a `remote` or `local` documents source is currently unsupported, and the command will fallback to creating just one project using `create-project`
