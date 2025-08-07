import { sql } from '@vercel/postgres';

export async function getClient() {
  return sql;
}
