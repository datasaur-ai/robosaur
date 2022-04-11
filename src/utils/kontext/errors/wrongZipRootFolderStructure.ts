export class WrongZipRootFolderStructure extends Error {
  constructor() {
    super(
      'Wrong upload folder structure. The folder structure should contain multiple folders containing multiple zip files.',
    );
  }
}
