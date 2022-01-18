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
   npm start create-project <projectName> <configFile>
   ```

   - projectName: Name of the project you wish to create.
   - configFile: Path to the configuration of project relative to the current working directory or absolute path.

### Create Multiple Projetcs

This command will create multiple project with the same configuration but different documents.  
Currently, the documents have to be stored in an S3-compliant bucket or a GCS bucket.

1. Create a config file to set all the common project configuration. Samples for GCS and S3 are available in `config/google-cloud-storage` and `config/s3-compliant`.
   Additional configs like project assignment and labelset for all projects can also be configured here.  
   Here are a couple important details about the storage configuration:
   1. `config.documents.source` => `s3` or `gcs`
   2. `stateFilePath` => full URI to a JSON file. This file will be continuosly overwritten every time the script is run. This file needs to be in the same. For GCS, example: `gs://{bucketName}/path/to/file.json`
   3. `config.assignment.path` => if source is `gcs` or `s3`, `path` should be the full URI same as `staticFilePath`.  
      if source is `local`, `path` should be relative or full path to json file
   4. `config.project.labelSetDirectory` => Optional. Relative or full path to a local folder containing labelsets csv
2. To run the command, run:

   ```console
   npm run start -- create-projects <pathToConfigJson>
   ```
