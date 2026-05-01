import bcrypt from 'bcryptjs'
import { seedData } from './seed'
import type { AppUser, SeedData } from './types'

const toUsers = (): AppUser[] =>
  seedData.users.map(({ passwordSeed, ...user }) => ({
    ...user,
    passwordHash: bcrypt.hashSync(passwordSeed, 10),
  }))

const clone = <T>(value: T): T => structuredClone(value)

export const store: Omit<SeedData, 'users'> & { users: AppUser[] } = {
  ...clone(seedData),
  users: toUsers(),
}
