const front_schema = `
type GetShoutoutDTO {
    id: String!
    name: String
    shoutout_text: String
    approved: Boolean
    date_sent: String
}

input ShoutoutInput {
    name: String!
    shoutout_text: String!
}

type RootQuery {
    shoutouts(id: String, approved: Boolean): [GetShoutoutDTO!]!
}

type RootMutation {
    SendShoutout(requestInput: ShoutoutInput): GetShoutoutDTO
}

schema {
   query: RootQuery
   mutation: RootMutation
 }
`;

module.exports = { front_schema } ;