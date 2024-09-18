import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to add a new user
export async function addUser(fid: number, username: string, daily_challenge: string | null) {
  try {
    const user = await prisma.users.create({
      data: {
        fid,
        username,
        daily_challenge,
      },
    });
    return user;
  } catch (error) {
    throw new Error('User creation failed');
  }
}

// Function to get all users
export async function getAllUsers() {
  try {
    const users = await prisma.users.findMany();
    return users;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

// Function to get user by ID
export async function getUserById(fid: number) {
  try {
    const user = await prisma.users.findUnique({
      where: { fid },
    });
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

// Function to update a user
export async function updateUser(fid: number, username: string, daily_challenge: string | null) {
  try {
    const user = await prisma.users.update({
      where: { fid },
      data: {
        username,
        daily_challenge,
      },
    });
    return user;
  } catch (error) {
    throw new Error('User update failed');
  }
}