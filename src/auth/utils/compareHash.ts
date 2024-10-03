import { compare } from 'bcrypt';

export async function compareHash(
  data: string,
  hash: string,
): Promise<boolean> {
  return await compare(data, hash);
}
