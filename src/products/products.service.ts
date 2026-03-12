import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepository.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { product_id: id },
      relations: ['category'],
    });
  }

  create(data: Partial<Product>) {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  update(id: number, data: Partial<Product>) {
    return this.productRepository.update(id, data);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}