type RequestParams = object;

interface RequestOptions {
  params?: RequestParams;
}

interface ApiResponse<T> {
  data: T;
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const buildUrl = (path: string, params?: RequestParams) => {
  const url = new URL(path, `${baseURL.replace(/\/$/, '')}/`);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, options?.params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401) {
    console.error('Unauthorized, please log in');
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  return { data: (await response.json()) as T };
};

const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};

export default apiClient;
