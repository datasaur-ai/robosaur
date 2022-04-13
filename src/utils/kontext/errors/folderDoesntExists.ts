export class FolderDoesntExist extends Error {
  constructor(path: string) {
    super(`${path} folder doesn't exist`);
  }
}
