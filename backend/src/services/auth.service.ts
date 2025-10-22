import { injectable, inject } from "inversify";
import { IAuthService } from "./interfaces/auth.service.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { IUserEntity, UserRole } from "../interfaces/user.interface";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async register(dto: CreateUserDTO): Promise<{ accessToken: string; refreshToken: string; user: UserResponseDTO }> {    
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userToCreate: Partial<IUserEntity> = {
      ...dto,
      role: UserRole.User || "user",
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.create(userToCreate as IUserEntity);

    const userResponse: UserResponseDTO = {
      _id: createdUser._id as string,
      userName: createdUser.userName,
      email: createdUser.email,
      role: createdUser.role
    };

    // Generate tokens
    const accessToken = signAccessToken({ userId: createdUser._id as string, email: createdUser.email, role: createdUser.role });
    const refreshToken = signRefreshToken({ userId: createdUser._id as string, email: createdUser.email, role: createdUser.role });

    return { accessToken, refreshToken, user: userResponse };
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponseDTO }> {
    console.log("service layer is caling from login===>");
    
    const user = await this.userRepository.findByEmail(email);

    console.log("user is found",user);
    
    if (!user) throw new Error("Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ userId: user._id as string, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id as string, email: user.email, role: user.role });

    const userResponse: UserResponseDTO = {
      _id: user._id as string,
      userName: user.userName,
      email: user.email,
      role: user.role
    };

    return { accessToken, refreshToken, user: userResponse };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.userId);
      if (!user) throw new Error("User not found");

      const accessToken = signAccessToken({ userId: user._id as string, email: user.email, role: user.role });
      return { accessToken };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

}
