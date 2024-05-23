import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListEmployee(name: string) {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isVerified = 1');
    if (name) {
      queryBuilder.andWhere('user.firstName = :name OR user.lastName = :name', {
        name,
      });
    }
    return await queryBuilder.getMany();
  }

  async getOneEmployee(id: number) {
    return await this.userRepository.findOneBy({
      id: id,
    });
  }
}
