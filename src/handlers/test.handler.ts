import { getRepository } from '../database/repository';
import { setConfigByJSONFile } from '../config/config';
import { initDatabase } from '../database';

export async function handleTest(configFile: string) {
  setConfigByJSONFile(configFile);
  initDatabase();

  // const repo = await getRepository(Dummy);

  // const dummy = new Dummy();
  // dummy.Name = 'hahahaaaaa';
  // dummy.Country = 'hahaha';

  console.log('test1');
  // await repo.insertOne(dummy);
  console.log('test2');
  process.exit(0);
}
