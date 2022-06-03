import { gql } from "graphql-request";
import { query } from "./query";

const CREATE_TAG = gql`
  mutation CreateTagMutation($input: CreateTagInput!) {
    createTag(input: $input) {
      ...TagFragment
    }
  }
  fragment TagFragment on Tag {
    id
    name
  }
`

export async function createTags(teamId, name){
  const variables = {
    input: {
      teamId,
      name
    }
  };

  const data = await query(CREATE_TAG, variables);
  return data.result;
}