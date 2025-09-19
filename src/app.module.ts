import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import {
  CategoryModule,
  UserModule,
  ProductModule,
  SubCategoryModule,
  BrandModule,
  CouponModule,
  CartModule,
  OrderModule,
} from "./modules/index";
import { GlobalModule } from "./global.module";
import { CoreModule } from "./core/core.module";
import { GraphQLConfigModule } from "./graphql/graphql.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./config/.env",
    }),
    MongooseModule.forRoot(process.env.DB_URL as string),
    CoreModule,
    GraphQLConfigModule,
    GlobalModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
