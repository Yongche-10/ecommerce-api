// src/categories/category.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  category_id: number;

  @Column({ name: 'category_name' })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'parent_id', nullable: true, default: null })
  parent_id: number | null;

  @ManyToOne(() => Category, cat => cat.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany(() => Category, cat => cat.parent)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}