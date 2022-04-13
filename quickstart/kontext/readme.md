# Kontext

This build is created specifically for Kontext's use case

## How it Works

1. First, Robosaur will read the input folder containing folders related to client names. Inside each client folder is multiple zip files that contain images. Each zip file will be created as a single project.

2. Next, Robosaur will create a temporary folder called `temp` to extract the zip files while still retaining the original folder structure.

3. After that, those extracted images will be uploaded to the chosen cloud object storage while still in the same original folder structure even the cloud. While uploading, Robosaur will save the url and compile them into 1 csv file for each project saved in document.path.

4. Finally, the resulting csv files in document.path folder will be used to create projects.

Final folder structure will look like this:

```
kontext/
  input/
    Client1/
      Project1.zip
      Project2.zip
    Client2/
      ProjectA.zip
      ProjectB.zip
  documents/
    Client1_Project1/
      image_url.csv
    Client1_Project2/
      image_url.csv
    Client2_ProjectA/
      image_url.csv
    Client2_ProjectB/
      image_url.csv
```

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
