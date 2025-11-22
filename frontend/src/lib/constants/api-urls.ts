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
    MY_TASKS: '/tasks/my-tasks',
    AVAILABLE_TASKS: '/tasks/available-tasks',
  },
} as const;
