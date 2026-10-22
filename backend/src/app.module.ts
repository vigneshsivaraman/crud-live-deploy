import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '/tmp',
      port: parseInt(process.env.DB_PORT || '5434', 10),
      username: process.env.DB_USERNAME || 'e1110',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crud_db',
      entities: [Product],
      synchronize: true, // Automatically sync DB schema for easy dev
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
