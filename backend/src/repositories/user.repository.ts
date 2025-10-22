import { injectable } from 'inversify';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IUserEntity, UserRole } from '../interfaces/user.interface';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserModel } from '../models/user.model';

@injectable()
export class UserRepository implements IUserRepository {
  
  async create(data: CreateUserDTO): Promise<IUserEntity> {
    const newUser = await UserModel.create({
      email: data.email,
      userName: data.userName,
      password: data.password,
      role: data.role || UserRole.User,
    });

    return newUser.toObject() as IUserEntity;
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUserEntity | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    return updatedUser ? (updatedUser.toObject() as IUserEntity) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async findById(id: string): Promise<IUserEntity | null> {
    const user = await UserModel.findById(id);
    return user ? (user.toObject() as IUserEntity) : null;
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const user = await UserModel.findOne({ email });
    return user ? (user.toObject() as IUserEntity) : null;
  }

  async findAll(): Promise<IUserEntity[]> {
    const users = await UserModel.find();
    return users.map(u => u.toObject() as IUserEntity);
  }
}
