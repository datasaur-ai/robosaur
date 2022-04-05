import { readFileSync } from 'fs';
import * as ConfigModule from '../config/config';
import { Config, StorageSources } from '../config/interfaces';
import * as ObjectStorage from '../utils/object-storage';
import { ObjectStorageClient } from '../utils/object-storage/interfaces';
import { parseAssignment } from './parse-assignment';

describe(parseAssignment.name, () => {
  let mockGetStorageClient: jest.MockInstance<ObjectStorageClient, any>;

  beforeEach(() => {
    mockGetStorageClient = jest
      .spyOn(ObjectStorage, 'getStorageClient')
      .mockName('mockGetStorageClient')
      .mockImplementation(() => {
        return {
          getStringFileContent: jest.fn(async () => JSON.stringify({ functionCalled: 'getFileContent' })),
          getObjectUrl: jest.fn(async () => 'getObjectUrl'),
          listItemsInBucket: jest.fn(async () => []),
          listSubfoldersOfPrefix: jest.fn(async () => ['listSubfolders']),
          setFileContent: jest.fn(),
          setStringFileContent: jest.fn(),
        };
      });
  });

  it.each([
    [StorageSources.AMAZONS3, 1],
    [StorageSources.GOOGLE, 1],
  ])('should call the correct method per source', async (source, callTimes) => {
    jest
      .spyOn(ConfigModule, 'getConfig')
      .mockName('mockGetConfig')
      .mockImplementation(() => {
        return {
          project: {
            assignment: {
              source: source,
              path: 'path/to/file.json',
              bucketName: 'bucket-name',
            },
          },
        } as Config;
      });

    await parseAssignment();

    expect(mockGetStorageClient).toBeCalledTimes(callTimes);
  });

  it(`should read local file when source is ${StorageSources.LOCAL}`, async () => {
    const LOCAL_ASSIGNMENT_PATH = 'sample/__shared__/assignment/assignment.json';
    jest
      .spyOn(ConfigModule, 'getConfig')
      .mockName('mockGetConfig')
      .mockImplementation(() => {
        return {
          project: {
            assignment: {
              source: StorageSources.LOCAL,
              path: LOCAL_ASSIGNMENT_PATH,
            },
          },
        } as Config;
      });

    const assignees = await parseAssignment();

    expect(assignees).toEqual(JSON.parse(readFileSync(LOCAL_ASSIGNMENT_PATH, { encoding: 'utf-8' })));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
