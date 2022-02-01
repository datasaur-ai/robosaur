import { AxiosResponse } from 'axios';
import * as ConfigModule from '../../config/config';
import * as ObjectStorage from '../object-storage';
import * as StreamToBufferHelper from '../stream/streamToBuffer';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import * as PublishHelper from './helper';
import { publishZipFile } from './publishZipFile';

describe(publishZipFile.name, () => {
  beforeEach(() => {
    jest.spyOn(PublishHelper, 'downloadFromPreSignedUrl').mockResolvedValue({ data: {}, status: 200 } as AxiosResponse);
    jest.spyOn(PublishHelper, 'saveFileToLocalFileSystem').mockReturnValue(undefined);

    jest.spyOn(StreamToBufferHelper, 'streamToBuffer').mockImplementation(async () => {
      return Buffer.from('dummy');
    });

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

  it('should throw error when given invalid export source', () => {
    jest.spyOn(ConfigModule, 'getConfig').mockReturnValue({
      export: {
        source: 'INVALID_EXPORT_SOURCE',
      },
    } as any);

    return expect(() => publishZipFile('dummy-url', 'dummy-name')).rejects.toThrow();
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

      return expect(() => publishZipFile('dummy-url', 'dummy-name')).not.toThrow();
    },
  );
});
