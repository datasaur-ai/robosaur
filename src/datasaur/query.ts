import { GraphQLClient } from 'graphql-request';
import { ClientError, RequestDocument } from 'graphql-request/dist/types';
import packageJson from '../../package.json';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { getAccessToken } from './get-access-token';

let currentClient: GraphQLClient | undefined;
let endpointUrl: string;

export async function query<T = any, V = any>(
  document: RequestDocument,
  variables?: V,
  requestHeaders?: HeadersInit,
): Promise<T> {
  let client = await getClient();
  client.setHeader('user-agent', `Robosaur/${packageJson.version}+${process.platform}+${process.version}`);
  client.setEndpoint(appendGQLTitleAsQuery(endpointUrl, document));
  try {
    return await client.request<T, V>(document, variables, requestHeaders);
  } catch (error) {
    if (error instanceof ClientError) {
      const firstError = error.response?.errors?.[0];
      if (firstError?.message === 'Unauthorized' && firstError?.extensions?.type === 'AuthenticationError') {
        // most likely because the access token is expired so try to re-generate a new access token
        currentClient = undefined;
        client = await getClient();
      }
    }
  }
  return client.request<T, V>(document, variables, requestHeaders);
}

async function getClient(): Promise<GraphQLClient> {
  if (!currentClient) {
    getLogger().info('generating access token...');
    const config = getConfig().datasaur;
    endpointUrl = `${config.host}/graphql`;
    try {
      const accessToken = await getAccessToken(config.host, config.clientId, config.clientSecret);
      getLogger().info('finished generating access token...');

      currentClient = new GraphQLClient(endpointUrl, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      getLogger().error(`fails to get access token`, {
        error: JSON.stringify(error),
        message: error.message,
        stack: error?.stack,
      });
      throw new Error('fails to get access token');
    }
  }
  return currentClient;
}

function appendGQLTitleAsQuery(url: string, document: RequestDocument) {
  // assuming the gql document is named
  // query SomethingQuery(){} or mutation CreateSomethingMutation(){}
  let documentTitle = document.toString().split('(')[0].trim();
  documentTitle = documentTitle.split(' ')[1];
  return url + `?graphql=${documentTitle}`;
}
