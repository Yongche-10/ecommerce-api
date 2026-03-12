// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // GET /categories → tree (parents + nested children)
  findAll() {
    return this.categoryRepository.find({
      where:     { parent_id: IsNull() },
      relations: ['children'],
      order:     { category_id: 'ASC' },
    });
  }

  // GET /categories/flat → all rows, used for dropdowns
  findFlat() {
    return this.categoryRepository.find({
      order: { parent_id: 'ASC', category_id: 'ASC' },
    });
  }

  // GET /categories/subcategories/:parentId
  findChildren(parentId: number) {
    return this.categoryRepository.find({
      where: { parent_id: parentId },
      order: { category_id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const cat = await this.categoryRepository.findOne({
      where:     { category_id: id },
      relations: ['children', 'parent'],
    });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }

  create(data: Partial<Category>) {
    const cat = this.categoryRepository.create(data);
    return this.categoryRepository.save(cat);
  }

  update(id: number, data: Partial<Category>) {
    return this.categoryRepository.update(id, data);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}