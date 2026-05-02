/* eslint-disable node/no-unpublished-import */
import {Express} from 'express';
import request from 'supertest';
import {
  UserWithLevel,
  UserWithLevelAndCommunity,
  UserWithNoPasswordAndCommunity,
} from 'hybrid-types/DBTypes';
import {
  UserResponse,
  LoginResponse,
  MessageResponse,
} from 'hybrid-types/MessageTypes';
import {createUserFactory} from './factories/userFactory';

export const createAdminUserDirect = async (
  overrides: Partial<
    Pick<UserWithLevel, 'username' | 'email' | 'password'>
  > = {},
): Promise<UserWithNoPasswordAndCommunity> => {
  return await createUserFactory(
    overrides,
    1, // Community 1
    1, // Admin level
  );
};

const createUser = (
  url: string | Express,
  path: string,
  user: Pick<UserWithLevel, 'username' | 'email' | 'password'>,
  token: string,
): Promise<UserWithLevelAndCommunity> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: UserResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          if (!result.user) {
            reject(new Error('User not created'));
          }
          const userData = result.user as UserWithLevelAndCommunity;
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBe(user.email);
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBe('User');
          resolve(userData);
        }
      });
  });
};

const getAllUsers = (
  url: string | Express,
  path: string,
): Promise<UserWithLevel[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(path)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: UserWithLevel[] = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty('user_id');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('created_at');
            expect(user).toHaveProperty('level_name');
          });
          resolve(users);
        }
      });
  });
};

const getSingleUser = (
  url: string | Express,
  path: string,
  id: number,
): Promise<UserWithLevel> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`${path}/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user: UserWithLevel = response.body;
          expect(user.user_id).toBe(id);
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('created_at');
          expect(user).toHaveProperty('level_name');
          resolve(user);
        }
      });
  });
};

const getSingleUserError = (
  url: string | Express,
  path: string,
  id: number,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`${path}/${id}`)
      .expect(404, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: MessageResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result.message).toBe('User not found');
          resolve(result);
        }
      });
  });
};

const login = (
  url: string | Express,
  path: string,
  user: Pick<UserWithLevel, 'username' | 'password'>,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: LoginResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          expect(result).toHaveProperty('token');
          if (!result.user) {
            reject(new Error('User not created'));
          }
          const userData = result.user;
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBeDefined();
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBeDefined();
          resolve(result.token);
        }
      });
  });
};

const modifyUser = (
  url: string | Express,
  path: string,
  token: string,
  user: Pick<UserWithLevel, 'username' | 'email'>,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .put(path)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          console.log('user put failed', response.body);

          reject(err);
        } else {
          const result: UserResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          if (!result.user) {
            reject(new Error('User not created'));
          }
          const userData = result.user;
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBe(user.email);
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBe('User');
          resolve(userData);
        }
      });
  });
};

const deleteUser = (url: string | Express, path: string, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: UserResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          const userData = result.user;
          expect(userData.user_id).toBeGreaterThan(0);
          resolve(userData);
        }
      });
  });
};

export {
  getAllUsers,
  getSingleUser,
  getSingleUserError,
  createUser,
  login,
  modifyUser,
  deleteUser,
};
