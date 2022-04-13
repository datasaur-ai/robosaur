# Kontext

This build is created specifically for Kontext's use case

## How it Works

//

## Getting Started

1. Prepare the input zip files with the following structure.

```
input/
   Client1/
      Project1.zip
      Project2.zip
      ...
   Client2/
      ProjectA.zip
      ...
   ...
```

2. Use the sample config from `quickstart/kontext/config/config.json` or create a new one based on it.

3. Important options to specify inside `documents.kontext`

   - `inputPath`, the local path to the `input` folder speficied in step 1.
   - `containingFolder`, use this option if the images inside the zip file is contained in another folder. Note that the folder structure inside all zip files should be the same. e.g.

   ```
   (inside zip file)
   Image/
      image1.jpg
      image2.jpg
      image3.png
      ...
   ```

   - `uploadPath`, specifies where to store the extraction results in the chosen cloud storage.
   - `source`, specifies what cloud storage option to choose (only `s3` and `gcs` are currently supported)
   - `bucketName`, the bucket name used to store the extraction results

4. Important option to specify inside `documents`

   - `document.path`, this is where the resulting `csv` file will be put.

5. Important option to specify inside `project.documentSettings`

   - Add the following value

   ```json
   ...
   "documentSettings": {
      ...
      "viewer": "URL",
      "viewerConfig": {
        "urlColumnNames": ["url"]
      },
      ...
   },
   ...
   ```

6. Run the following command. Important! Upon running the command, all files in the folder specified in `documents.path` will be cleared (`rm -rf`)

```bash
npm start -- create-projects <path-to-config-file> --from-zip
```
