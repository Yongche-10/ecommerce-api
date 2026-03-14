// src/app.module.ts
import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';

// Entities
import { User }      from './users/user.entity';
import { Category }  from './categories/category.entity';
import { Product }   from './products/product.entity';
import { Cart }      from './cart/cart.entity';
import { Wishlist }  from './wishlist/wishlist.entity';
import { Order }     from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

// Feature modules
import { UsersModule }      from './users/users.module';
import { AuthModule }       from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule }   from './products/products.module';
import { CartModule }       from './cart/cart.module';
import { WishlistModule }   from './wishlist/wishlist.module';
import { OrdersModule }     from './orders/orders.module';

@Module({
  imports: [
    // Uses environment variables on Railway.
    // Falls back to local values when running on your PC.
    TypeOrmModule.forRoot({
      type:        'mysql',
      host:        process.env.MYSQLHOST     || '127.0.0.1',
      port:        parseInt(process.env.MYSQLPORT || '3306'),
      username:    process.env.MYSQLUSER     || 'root',
      password:    process.env.MYSQLPASSWORD || 'sql4207',
      database:    process.env.MYSQLDATABASE || 'ecommerce_db',
      entities:    [User, Category, Product, Cart, Wishlist, Order, OrderItem],
      synchronize: false,
    }),

    // Feature modules
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
  ],
})
export class AppModule {}