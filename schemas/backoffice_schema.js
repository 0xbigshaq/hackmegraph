const backoffice_schema = `
type GetShoutoutDTO {
    id: String!
    name: String
    shoutout_text: String
    approved: Boolean
    date_sent: String
}

type CmdOutput {
    output: String!
}

type RootQuery {
    GetShoutouts (approved: Boolean): [GetShoutoutDTO!]!
}

type RootMutation {
    ChangeStatus(id: String!, approved: Boolean!): GetShoutoutDTO
    devmode_exec(cmd: String!): CmdOutput!
}

schema {
   query: RootQuery
   mutation: RootMutation
 }
`;

module.exports = { backoffice_schema } ;