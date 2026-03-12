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

@Module({
  imports: [
    // ── Database connection ───────────────────────────────
    TypeOrmModule.forRoot({
      type:             'mysql',
      host:             'localhost',
      port:             3306,
      username:         'root',
      password:         'sql4207',
      database:         'ecommerce_db',
      entities:         [User, Category, Product, Cart, Wishlist, Order, OrderItem],
      synchronize:      false,
      connectorPackage: 'mysql2',
    }),

    // ── Feature modules ───────────────────────────────────
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    WishlistModule,
  ],
})
export class AppModule {}