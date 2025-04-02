import { CheckFileHashResult, FileItem, UploadFileParams } from '@/types/files';
import { UserFileStorage } from '@/libs/api/rylai';

export interface IFileService {
  checkFileHash(hash: string): Promise<CheckFileHashResult>;
  checkUserStorage(): Promise<UserFileStorage>;
  createFile(
    file: UploadFileParams,
    knowledgeBaseId?: string,
  ): Promise<{ id: string; url: string }>;
  getFile(id: string): Promise<FileItem>;
  removeAllFiles(): Promise<any>;
  removeFile(id: string): Promise<void>;
  removeFiles(ids: string[]): Promise<void>;
}
