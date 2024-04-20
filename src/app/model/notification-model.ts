export interface NotificationData {
  warning: string;
  pinned_tts: string[];
  problem_category: string[];
  file_type: string[];
  api: CoreAPI;
}

interface CoreAPI {
  headers: string;
  generate: string;
  download: string;
}
