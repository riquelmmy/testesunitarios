import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';
import { response } from 'express';

// Cria uma instância da aplicação para executar os testes
const app = new App().server.listen(8081);

describe('UserController', () => {
  afterAll((done) => {
    // Fechar o servidor após os testes
    app.close(done);
  });

  it('Deve retornar a lista de usuários corretamente', async () => {
    const mockUsers: IUser[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
      },
    ];

    const expectedUsers: IUserResponse[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
        isOfAge: false,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
        isOfAge: true,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
        isOfAge: true,
      },
    ];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });

  it('Deve retornar uma lista vazia', async () =>{
    const mockUsers: IUser[] = []
    const expectedUsers: IUserResponse[] = []

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  })

  it('Deve retornar um usuário por id', async () => {
    const mockUser: IUser = {
      id: 1,
      name: 'Chouji',
      age: 10,
    };
  
    const expectedUser: IUserResponse = {
      id: 1,
      name: 'Chouji',
      age: 10,
      isOfAge: false,
    };
    jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValue(mockUser);
    const response = await request(app).get('/users/id')
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
    success: true,
    data: expectedUser,
  });
  })
  
  it("criar um usuário", async () =>{
    const mockUser : IUser = {
      id: 4,
      name: 'Orochi',
      age: 50,
    };

    jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(!!mockUser)
    const response = await request(app).post('/users');
    expect(response.status).toBe(201);

  })

});
