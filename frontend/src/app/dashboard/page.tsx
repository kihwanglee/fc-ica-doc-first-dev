"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject } from "@/lib/api";
import { ProjectListItem, User } from "@/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // New Project modal
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.items);
    } catch {
      // If unauthorized, redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    fetchProjects();
  }, [router, fetchProjects]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim()) return;
    setCreating(true);
    try {
      const res = await createProject({
        name: projectName,
        description: projectDesc || undefined,
      });
      setShowModal(false);
      setProjectName("");
      setProjectDesc("");
      router.push(`/projects/${res.data.id}`);
    } catch {
      // handle silently
    } finally {
      setCreating(false);
    }
  }

  function totalTasks(p: ProjectListItem) {
    const s = p.task_summary;
    return s.todo + s.in_progress + s.done;
  }

  function progressPercent(p: ProjectListItem) {
    const total = totalTasks(p);
    if (total === 0) return 0;
    return Math.round((p.task_summary.done / total) * 100);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <h1
            className="text-lg font-bold text-indigo-600 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            TaskFlow
          </h1>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden sm:inline">{user?.name || "User"}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-4 py-2 text-sm text-slate-500 border-b border-slate-100">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            My Projects
          </h2>
          <Button onClick={() => setShowModal(true)}>+ New Project</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-slate-500 mb-4">
              You don&apos;t have any projects yet.
            </p>
            <Button onClick={() => setShowModal(true)}>
              + New Project
            </Button>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Task Summary */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      TODO {project.task_summary.todo}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      IN PROGRESS {project.task_summary.in_progress}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      DONE {project.task_summary.done}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent(project)}%` }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {project.member_count} member
                    {project.member_count !== 1 ? "s" : ""}
                  </span>
                  <span>
                    Updated{" "}
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              loading={creating}
              disabled={!projectName.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name *"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Project description (optional)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
