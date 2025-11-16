import { Request } from 'express';
import { TokenName } from '../../shared/enums/token-names';

export const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, string | undefined>;

  return cookies?.[TokenName.Access] ?? null;
};
