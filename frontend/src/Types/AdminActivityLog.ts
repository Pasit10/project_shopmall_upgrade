export default interface AdminActivityLog {
  id: number;
  adminId: string;
  adminName: string;
  status: string;
  timestamp: string | Date;
  }