import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule} from '@nestjs/mongoose'
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot('mongodb://127.0.0.1:27017/pokemon?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1'),
    PokemonModule,
    CommonModule
  ], 
  controllers: [],
  providers: [],
  exports: [],
})
 
export class AppModule {}
