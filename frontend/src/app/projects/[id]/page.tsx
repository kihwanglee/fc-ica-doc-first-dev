"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/api";
import {
  Project,
  Task,
  TaskStatus,
  TaskPriority,
  ProjectMember,
  CreateTaskRequest,
} from "@/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "bg-slate-100" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50" },
  { status: "DONE", label: "Done", color: "bg-emerald-50" },
];

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

export default function ProjectBoardPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Task modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("TODO");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  // Task detail panel
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("TODO");
  const [editPriority, setEditPriority] = useState<TaskPriority>("MEDIUM");
  const [editAssignee, setEditAssignee] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getTasks(projectId),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data.items);
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [router, fetchData]);

  function getTasksByStatus(status: TaskStatus): Task[] {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);
  }

  async function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as TaskStatus;
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTask(projectId, draggableId, { status: newStatus });
    } catch {
      // Revert on failure
      fetchData();
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setCreatingTask(true);
    try {
      const data: CreateTaskRequest = {
        title: newTaskTitle,
        description: newTaskDesc || undefined,
        priority: newTaskPriority,
        status: newTaskStatus,
        assignee_id: newTaskAssignee || undefined,
      };
      const res = await createTask(projectId, data);
      setTasks((prev) => [...prev, res.data]);
      setShowCreateModal(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("MEDIUM");
      setNewTaskStatus("TODO");
      setNewTaskAssignee("");
    } catch {
      // handle silently
    } finally {
      setCreatingTask(false);
    }
  }

  function openTaskDetail(task: Task) {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditAssignee(task.assignee?.id || "");
  }

  function closeTaskDetail() {
    setSelectedTask(null);
  }

  async function handleSaveTask() {
    if (!selectedTask) return;
    setSaving(true);
    try {
      const res = await updateTask(projectId, selectedTask.id, {
        title: editTitle,
        description: editDesc,
        status: editStatus,
        priority: editPriority,
        assignee_id: editAssignee || null,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === selectedTask.id ? res.data : t))
      );
      setSelectedTask(res.data);
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTask() {
    if (!selectedTask) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleting(true);
    try {
      await deleteTask(projectId, selectedTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      closeTaskDetail();
    } catch {
      // handle silently
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <h1
            className="text-lg font-bold text-indigo-600 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            TaskFlow
          </h1>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700">
            {(() => {
              try {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                return u.name?.charAt(0) || "U";
              } catch {
                return "U";
              }
            })()}
          </div>
        </div>
      </header>

      {/* Board Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Dashboard
            </button>
            <h2 className="text-xl font-semibold text-slate-900">
              {project?.name}
            </h2>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            + Add Task
          </Button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 min-w-max">
            {COLUMNS.map((col) => {
              const columnTasks = getTasksByStatus(col.status);
              return (
                <div
                  key={col.status}
                  className={`w-80 ${col.color} rounded-xl p-4 flex flex-col`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-700">
                        {col.label}
                      </h3>
                      <span className="text-xs bg-white rounded-full px-2 py-0.5 text-slate-500 font-medium">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-3 min-h-[100px] rounded-lg transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-50 ring-2 ring-indigo-200"
                            : ""
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => openTaskDetail(task)}
                                className={`bg-white rounded-lg border border-slate-200 shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow ${
                                  snapshot.isDragging
                                    ? "shadow-lg scale-[1.02]"
                                    : ""
                                }`}
                              >
                                {/* Priority Badge */}
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
                                >
                                  {task.priority}
                                </span>

                                {/* Title */}
                                <h4 className="mt-2 text-sm font-medium text-slate-900 line-clamp-2">
                                  {task.title}
                                </h4>

                                {/* Assignee */}
                                {task.assignee && (
                                  <div className="mt-3 flex items-center gap-1.5">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                                      {task.assignee.name.charAt(0)}
                                    </div>
                                    <span className="text-xs text-slate-500">
                                      {task.assignee.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Add task shortcut */}
                  <button
                    onClick={() => {
                      setNewTaskStatus(col.status);
                      setShowCreateModal(true);
                    }}
                    className="mt-3 w-full text-sm text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-lg py-2 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Create Task Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Task"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              loading={creatingTask}
              disabled={!newTaskTitle.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Title *"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Task description (optional)"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskPriority}
                onChange={(e) =>
                  setNewTaskPriority(e.target.value as TaskPriority)
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {project?.members && project.members.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assignee
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                {project.members.map((m: ProjectMember) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>
      </Modal>

      {/* Task Detail Side Panel */}
      {selectedTask && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeTaskDetail}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-xl z-50 flex flex-col animate-slide-in">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Task Detail
              </h2>
              <button
                onClick={closeTaskDetail}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              {/* Status + Priority */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as TaskStatus)
                    }
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value as TaskPriority)
                    }
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Assignee */}
              {project?.members && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Assignee
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editAssignee}
                    onChange={(e) => setEditAssignee(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {project.members.map((m: ProjectMember) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={5}
                  placeholder="Add a description..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              {/* Meta Info */}
              <div className="text-xs text-slate-400 space-y-1">
                <p>
                  Created:{" "}
                  {new Date(selectedTask.created_at).toLocaleString()}
                </p>
                <p>
                  Updated:{" "}
                  {new Date(selectedTask.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteTask}
                loading={deleting}
              >
                Delete
              </Button>
              <Button onClick={handleSaveTask} loading={saving}>
                Save
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Inline styles for animation */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
