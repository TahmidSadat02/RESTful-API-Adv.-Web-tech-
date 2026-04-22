import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    // This injects the TypeORM database tools specifically for your 'menu_items' table
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // 1. Logic to save a new food item (Admin only later)
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    // .create() pre-packages the data into the correct format locally
    const newItem = this.menuRepository.create(createMenuDto);
    
    // .save() actually runs the SQL INSERT command to put it in the database
    return await this.menuRepository.save(newItem);
  }

  // 2. Logic to fetch all food items (For your React frontend)
  async findAll(): Promise<Menu[]> {
    // .find() runs a SQL SELECT * command to get everything
    return await this.menuRepository.find();
  }
}