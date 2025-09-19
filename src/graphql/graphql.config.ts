import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { OrderResolver } from "./resolver/order.resolver";
import { OrderModule } from "src/modules";


@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: "src/schema.gql",
        }),
        OrderModule
    ],
    providers: [OrderResolver],
})
export class GraphQLConfigModule {
    constructor() { }
}