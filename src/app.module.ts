// src/app.module.ts
import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';

// Entities
import { User }         from './users/user.entity';
import { Category }     from './categories/category.entity';
import { Product }      from './products/product.entity';
import { Cart }         from './cart/cart.entity';
import { Wishlist }     from './wishlist/wishlist.entity';
import { Order }        from './orders/order.entity';
import { OrderItem }    from './orders/order-item.entity';
import { Notification } from './notifications/notification.entity';

// Feature modules
import { UsersModule }         from './users/users.module';
import { AuthModule }          from './auth/auth.module';
import { CategoriesModule }    from './categories/categories.module';
import { ProductsModule }      from './products/products.module';
import { CartModule }          from './cart/cart.module';
import { WishlistModule }      from './wishlist/wishlist.module';
import { OrdersModule }        from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:        'mysql',
      host:        process.env.MYSQLHOST     || '127.0.0.1',
      port:        parseInt(process.env.MYSQLPORT || '3306'),
      username:    process.env.MYSQLUSER     || 'root',
      password:    process.env.MYSQLPASSWORD || 'sql4207',
      database:    process.env.MYSQLDATABASE || 'ecommerce_db',
      entities:    [User, Category, Product, Cart, Wishlist, Order, OrderItem, Notification],
      synchronize: false,
    }),

    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    NotificationsModule,
  ],
})
export class AppModule {}