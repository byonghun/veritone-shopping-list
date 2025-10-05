export type User = {
  id: string;
  email: string;
  emailCanonical: string; // trimmed + lowercased for lookup
  passwordHash: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
};
