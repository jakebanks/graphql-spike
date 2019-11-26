const express = require('express');
const graphqlHTTP = require('express-graphql'); //allows express to access the graphql api, kind of like middleware
const schema = require('./schema/schema');

const app = express();



app.use('/graphql', graphqlHTTP({
    schema: schema, //pass the schema to the middleware
    graphiql: true //allow graphiql GUI on localhost:4000/graphql
}));

app.listen(4000, () => {
    console.log("Express running on port 4000...");
})