import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { HashModule } from './shared/hash/hash.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidation,
    }),
    DatabaseModule,
    UserModule,
    HashModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
