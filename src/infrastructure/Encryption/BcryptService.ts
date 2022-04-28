import { EncryptionService } from 'domain/ports/EncryptionService';
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService implements EncryptionService {
  compare(str1: string, str2: string): Promise<boolean> {
    return bcrypt.compare(str1, str2);
  }

  hash(str: string): Promise<string> {
    return bcrypt.hash(str, 10);
  }
}
