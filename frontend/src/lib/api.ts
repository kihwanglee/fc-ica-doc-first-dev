import {
  ApiResponse,
  AuthData,
  LoginRequest,
  RegisterRequest,
  CreateProjectRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ProjectListItem,
  Project,
  Task,
  PaginatedData,
  ProjectMember,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    const message = json.message || `Request failed with status ${res.status}`;
    const error: any = new Error(message);
    error.status = res.status;
    error.data = json;
    throw error;
  }

  return json;
}

// --- Auth ---

export async function login(
  data: LoginRequest
): Promise<ApiResponse<AuthData>> {
  return request<ApiResponse<AuthData>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(
  data: RegisterRequest
): Promise<ApiResponse<AuthData>> {
  return request<ApiResponse<AuthData>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Projects ---

export async function getProjects(): Promise<
  ApiResponse<PaginatedData<ProjectListItem>>
> {
  return request("/projects");
}

export async function createProject(
  data: CreateProjectRequest
): Promise<ApiResponse<Project>> {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProject(
  projectId: string
): Promise<ApiResponse<Project>> {
  return request(`/projects/${projectId}`);
}

export async function getProjectMembers(
  projectId: string
): Promise<ApiResponse<ProjectMember[]>> {
  return request(`/projects/${projectId}/members`);
}

// --- Tasks ---

export async function getTasks(
  projectId: string
): Promise<ApiResponse<PaginatedData<Task>>> {
  return request(`/projects/${projectId}/tasks?size=100`);
}

export async function createTask(
  projectId: string,
  data: CreateTaskRequest
): Promise<ApiResponse<Task>> {
  return request(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: UpdateTaskRequest
): Promise<ApiResponse<Task>> {
  return request(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(
  projectId: string,
  taskId: string
): Promise<void> {
  return request(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}
