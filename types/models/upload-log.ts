export interface UploadLog {
  url: string;
  id: number;
  shopScopedId: number;
  filename: string;
  mimetype: string;
  collection: string;
  timestamp: Date;
  uid: string;
  size: number;
  shopId: number;
}
