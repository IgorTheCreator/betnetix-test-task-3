import { hash } from 'bcrypt';

export async function generateHash(data: string): Promise<string> {
  return await hash(data, 10);
}
