export const API_URL = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },

  ADMIN: {
    CREATE_TEACHER: '/admin/create-teacher',
  },

  TASKS: {
    CREATE_TASK: '/tasks',
  },
} as const;
