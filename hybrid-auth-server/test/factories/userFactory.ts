import {User, UserWithNoPasswordAndCommunity} from 'hybrid-types/DBTypes';
import {createUser as createUserModel} from '../../src/api/models/userModel';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';

// Builds a plain user object (no DB interaction) - useful for API payloads
export const buildUser = (
  overrides: Partial<Pick<User, 'username' | 'email' | 'password'>> = {},
): Pick<User, 'username' | 'password' | 'email'> => ({
  username:
    overrides.username ||
    'testuser' +
      randomstring.generate({
        length: 7,
        charset: 'alphabetic',
      }),
  email:
    overrides.email ||
    randomstring.generate({
      length: 5,
      charset: 'alphanumeric',
      capitalization: 'lowercase',
    }) + '@test.com',
  password: overrides.password || 'defaultpass',
});

// Builds and persists a user in the DB (direct model call) - bypasses API
export const createUserFactory = async (
  overrides: Partial<Pick<User, 'username' | 'email' | 'password'>> = {},
  communityId: number,
  userLevelId = 2, // Default to 'User'; 1 for Admin
): Promise<UserWithNoPasswordAndCommunity> => {
  const userData = buildUser(overrides);
  const hashedPassword = await bcrypt.hash(userData.password, 12); // Match controller's salt
  return await createUserModel(
    {...userData, password: hashedPassword},
    communityId,
    userLevelId,
  );
};
