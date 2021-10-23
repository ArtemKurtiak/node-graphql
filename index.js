const app = require('express')();

require('dotenv').config();

const { PORT, users} = require("./constants");
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean} = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: {
                toReturn: {
                    type: GraphQLBoolean
                }
            },
            resolve: (parent, args) => {
                const { toReturn } = args;

                if (toReturn) {
                    return users;
                }

                return null;
            }
        }
    }
});
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                users.push({ id: users.length + 1, ...args });

                return args;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

app.use('/graphql',
    graphqlHTTP({ schema, graphiql: true }))

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

