const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Example usage functions
export const workoutApi = {
  getAll: () => apiFetch('/api/workouts'),
  
  create: (workoutData: any) => 
    apiFetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    }),
  
  assignToClient: (workoutId: string, clientId: string) =>
    apiFetch('/api/client-workouts', {
      method: 'POST',
      body: JSON.stringify({ workout_id: workoutId, client_id: clientId }),
    }),
};

export const userApi = {
  register: (userData: any) => 
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials: any) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  getProfile: () => apiFetch('/api/auth/profile'),
};