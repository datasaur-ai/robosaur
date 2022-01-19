import { GraphQLClient } from 'graphql-request';
import { RequestDocument } from 'graphql-request/dist/types';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { getAccessToken } from './get-access-token';

let client: GraphQLClient;

export async function query<T = any, V = any>(
  document: RequestDocument,
  variables?: V,
  requestHeaders?: HeadersInit,
): Promise<T> {
  return (await getClient()).request<T, V>(document, variables, requestHeaders);
}

async function getClient() {
  if (!client) {
    getLogger().info('Generating access token...');
    const config = getConfig().datasaur;
    const accessToken = await getAccessToken(config.host, config.clientId, config.clientSecret);
    getLogger().info('Finished generating access token...');

    client = new GraphQLClient(`${config.host}/graphql`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return client;
}
