export interface EncryptionService {
  compare(str1: string, str2: string): Promise<boolean>;

  hash(str: string): Promise<string>;
}
