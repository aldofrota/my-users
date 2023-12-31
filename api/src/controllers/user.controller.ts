import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  AuthResponseDto,
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  User,
} from '../models/user.model';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os Usuários cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Um Array com todos os Usuários cadastrados',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async getUsers(): Promise<any> {
    try {
      return await this.appService.findAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Corpo da requisição para criar um novo usuário',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'E-mail já cadastrado no sistema' })
  async registerUsers(@Body() body: User): Promise<{ message: string }> {
    try {
      await this.appService.create(body);
      return { message: 'Usuário cadastrado' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/auth')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Corpo da requisição de autenticação',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário autenticado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async authUser(@Body() body: User) {
    try {
      const user = await this.appService.auth(body);
      return user;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar Permissão do usuário' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser atualizado',
    type: String,
    required: true,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Corpo da requisição de atualização',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async updateUser(@Param('id') id: string, @Body() body: any) {
    try {
      const user = await this.appService.update(id, body);
      return user;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser excluido',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário excluido com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async removeUser(@Param('id') id: string) {
    try {
      await this.appService.delete(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
