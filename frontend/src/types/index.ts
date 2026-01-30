// --- Enums / Union Types ---

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MemberRole = "owner" | "member";

// --- Domain Models ---

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joined_at?: string;
}

export interface TaskSummary {
  todo: number;
  in_progress: number;
  done: number;
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  member_count: number;
  task_summary: TaskSummary;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  members: ProjectMember[];
  created_at: string;
  updated_at: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  assignee: TaskAssignee | null;
  created_by?: TaskAssignee;
  created_at: string;
  updated_at: string;
}

// --- API Response Types ---

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message: string | null;
}

export interface ApiError {
  status: "error";
  data: null;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

// --- Auth Types ---

export interface AuthData {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string | null;
  position?: number;
}
