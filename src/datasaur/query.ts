import { GraphQLClient } from 'graphql-request';
import { RequestDocument } from 'graphql-request/dist/types';
import packageJson from '../../package.json';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { getAccessToken } from './get-access-token';

let client: GraphQLClient;

export async function query<T = any, V = any>(
  document: RequestDocument,
  variables?: V,
  requestHeaders?: HeadersInit,
): Promise<T> {
  const client = await getClient();
  client.setHeader('user-agent', `Robosaur/${packageJson.version}+${process.platform}+${process.version}`);
  return client.request<T, V>(document, variables, requestHeaders);
}

async function getClient() {
  if (!client) {
    getLogger().info('generating access token...');
    const config = getConfig().datasaur;
    try {
      const accessToken = await getAccessToken(config.host, config.clientId, config.clientSecret);
      getLogger().info('finished generating access token...');

      client = new GraphQLClient(`${config.host}/graphql`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      getLogger().error(`fails to get access token`, { error: { message: error.message, stack: error?.stack } });
      throw new Error('fails to get access token');
    }
  }
  return client;
}
