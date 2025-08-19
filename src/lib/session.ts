import { randomUUID } from "crypto";
import { redis } from "./redis";

const TTL = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  id: string;        // UUID key in Redis
  userId: string;    // user PK
  createdAt: number; // epoch ms
};

export async function createSession(userId: string): Promise<Session> {
  const id = randomUUID();
  const session: Session = { id, userId, createdAt: Date.now() };
  await redis.set(`sess:${id}`, JSON.stringify(session), "EX", TTL);
  return session;
}

export async function getSession(id: string): Promise<Session | null> {
  const raw = await redis.get(`sess:${id}`);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export async function destroySession(id: string) {
  await redis.del(`sess:${id}`);
} 