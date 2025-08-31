import { db } from "db/client";

export function findUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}