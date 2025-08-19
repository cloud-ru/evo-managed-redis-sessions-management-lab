import bcrypt from "bcrypt";
import { z } from "zod";

const users = new Map<string, { id: string; email: string; hash: string }>();

export const Credentials = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function userExists(email: string): Promise<boolean> {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

export async function createUser(email: string, password: string) {
  // Check if user with this email already exists
  if (await userExists(email)) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const id = crypto.randomUUID();
  users.set(id, {
    id,
    email: email.toLowerCase(),
    hash: await bcrypt.hash(password, 10),
  });
  return id;
}

export async function verifyUser(email: string, password: string) {
  for (const u of users.values()) {
    if (u.email === email && (await bcrypt.compare(password, u.hash))) {
      return u.id;
    }
  }
  return null;
}
