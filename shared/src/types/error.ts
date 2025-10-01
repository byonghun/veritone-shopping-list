export type ApiErrorBody = {
  error?: string;
  message?: string;
  issues?: Array<{ message: string }>;
};
