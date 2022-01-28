import internal from 'stream';
import fs from 'fs';
import * as ConfigModule from '../../config/config';
import * as ObjectStorage from '../object-storage';
import * as ReadZipFile from '../readZipFile';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import * as PublishHelper from './helper';
import { publishFiles } from './publishFiles';

describe(publishFiles.name, () => {
  beforeEach(() => {
    jest.spyOn(ReadZipFile, 'readZipStream').mockResolvedValue([{ filename: 'dummy-file', content: 'dummy-content' }]);
    jest.spyOn(PublishHelper, 'downloadFromPreSignedUrl').mockResolvedValue({ data: new internal.Readable() } as any);
    jest.spyOn(fs, 'mkdirSync').mockImplementation();
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest
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

  it.each(IMPLEMENTED_EXPORT_STORAGE_SOURCES.map((s) => [s]))(
    'should not throw error when given valid export source %s',
    (source) => {
      jest.spyOn(ConfigModule, 'getConfig').mockReturnValue({
        export: {
          source: source,
          prefix: 'dummy',
        },
      } as any);

      return expect(() => publishFiles('dummy-url', 'dummy-name')).not.toThrow();
    },
  );

  it('should throw error when given invalid export source', () => {
    jest.spyOn(ConfigModule, 'getConfig').mockReturnValue({
      export: {
        source: 'INVALID_EXPORT_SOURCE',
      },
    } as any);
    return expect(() => publishFiles('dummy-url', 'dummy-name')).rejects.toThrow();
  });
});
