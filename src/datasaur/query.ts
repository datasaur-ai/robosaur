import { GraphQLClient } from 'graphql-request';
import { RequestDocument } from 'graphql-request/dist/types';
import packageJson from '../../package.json';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { getAccessToken } from './get-access-token';

let client: GraphQLClient;
let endpointUrl: string;

export async function query<T = any, V = any>(
  document: RequestDocument,
  variables?: V,
  requestHeaders?: HeadersInit,
): Promise<T> {
  const client = await getClient();
  client.setHeader('user-agent', `Robosaur/${packageJson.version}+${process.platform}+${process.version}`);
  client.setEndpoint(appendGQLTitleAsQuery(endpointUrl, document));
  return client.request<T, V>(document, variables, requestHeaders);
}

async function getClient() {
  if (!client) {
    getLogger().info('generating access token...');
    const config = getConfig().datasaur;
    endpointUrl = `${config.host}/graphql`;
    try {
      const accessToken = await getAccessToken(config.host, config.clientId, config.clientSecret);
      getLogger().info('finished generating access token...');

      client = new GraphQLClient(endpointUrl, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
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
  return client;
}

function appendGQLTitleAsQuery(url: string, document: RequestDocument) {
  // assuming the gql document is named
  // query SomethingQuery(){} or mutation CreateSomethingMutation(){}
  let documentTitle = document.toString().split('(')[0].trim();
  documentTitle = documentTitle.split(' ')[1];
  return url + `?graphql=${documentTitle}`;
}
