// npm services
import { ApolloServer } from "@apollo/server";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from 'body-parser';
import cors from "cors";
import { creatTableToPostgres, initializeUserData } from "./config/pgInitialize";


const port = 4000;

const app = express();

app.use(cors())

const schema = makeExecutableSchema({ typeDefs, resolvers });

const httpServer = createServer(app);

const apolloServer = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await wsServerCleanup.dispose();
                    },
                };
            },
        },
    ],
});

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
});

const wsServerCleanup = useServer({ schema }, wsServer);

(async function () {
    // starting the apollo server to expose endoint to client
    await apolloServer.start();
    app.use("/graphql", bodyParser.json(), expressMiddleware(apolloServer));
})();


initializeUserData().then(() => {
    httpServer.listen(port, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`);
    });
}).catch(err => console.log(err));
