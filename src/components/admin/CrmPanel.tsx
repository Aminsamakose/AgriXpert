"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type EntityType = "farmer" | "buyer" | "supplier" | "cooperative" | "enquiry";
type Stage = "new" | "contacted" | "engaged" | "active" | "dormant";

const stages: { value: Stage; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "engaged", label: "Engaged" },
  { value: "active", label: "Active" },
  { value: "dormant", label: "Dormant" },
];

const stageColors: Record<Stage, string> = {
  new: "bg-forest-dark/10 text-forest-dark/70",
  contacted: "bg-harvest-gold/15 text-harvest-gold",
  engaged: "bg-agri-green/15 text-agri-green",
  active: "bg-forest/15 text-forest",
  dormant: "bg-red-100 text-red-700",
};

type Note = {
  id: string;
  body: string;
  created_at: string;
  created_by: string | null;
};

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: "open" | "done";
  created_at: string;
  completed_at: string | null;
  assigned_to: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CrmPanel({
  entityType,
  entityId,
  entityLabel,
  onStageChange,
}: {
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
  onStageChange?: (stage: Stage) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("new");
  const [savingStage, setSavingStage] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [staffEmails, setStaffEmails] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteBody, setEditingNoteBody] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDue, setEditingTaskDue] = useState("");
  const [editingTaskAssignee, setEditingTaskAssignee] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [pipelineRes, notesRes, tasksRes] = await Promise.all([
      supabase
        .from("crm_pipeline")
        .select("stage")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .maybeSingle(),
      supabase
        .from("crm_notes")
        .select("id, body, created_at, created_by")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false }),
      supabase
        .from("crm_tasks")
        .select("id, title, due_date, status, created_at, completed_at, assigned_to")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("status", { ascending: true })
        .order("due_date", { ascending: true, nullsFirst: false }),
    ]);
    setStage((pipelineRes.data?.stage as Stage | undefined) ?? "new");
    if (notesRes.error) setError(notesRes.error.message);
    else setNotes((notesRes.data as Note[]) ?? []);
    if (tasksRes.error) setError((prev) => prev ?? tasksRes.error!.message);
    else setTasks((tasksRes.data as Task[]) ?? []);
    setLoading(false);
  }, [entityType, entityId]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on expand
      load();
      supabase
        .from("admins")
        .select("email")
        .order("email", { ascending: true })
        .then(({ data }) => setStaffEmails((data ?? []).map((r: { email: string }) => r.email)));
    }
  }, [open, load]);

  async function handleStageChange(next: Stage) {
    setSavingStage(true);
    setError(null);
    setStage(next);
    const { error: upsertError } = await supabase
      .from("crm_pipeline")
      .upsert(
        { entity_type: entityType, entity_id: entityId, stage: next, updated_at: new Date().toISOString() },
        { onConflict: "entity_type,entity_id" }
      );
    setSavingStage(false);
    if (upsertError) setError(upsertError.message);
    else onStageChange?.(next);
  }

  async function handleAddNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = newNote.trim();
    if (!body) return;
    setAddingNote(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("crm_notes")
      .insert({ entity_type: entityType, entity_id: entityId, body });
    setAddingNote(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewNote("");
    load();
  }

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    setAddingTask(true);
    setError(null);
    const { error: insertError } = await supabase.from("crm_tasks").insert({
      entity_type: entityType,
      entity_id: entityId,
      entity_label: entityLabel,
      title,
      due_date: newTaskDue || null,
      assigned_to: newTaskAssignee || null,
    });
    setAddingTask(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewTaskTitle("");
    setNewTaskDue("");
    setNewTaskAssignee("");
    load();
  }

  async function toggleTask(task: Task) {
    setError(null);
    const nextStatus = task.status === "open" ? "done" : "open";
    const { error: updateError } = await supabase
      .from("crm_tasks")
      .update({ status: nextStatus, completed_at: nextStatus === "done" ? new Date().toISOString() : null })
      .eq("id", task.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  }

  function startEditNote(note: Note) {
    setEditingNoteId(note.id);
    setEditingNoteBody(note.body);
  }

  async function saveEditNote() {
    if (!editingNoteId) return;
    const body = editingNoteBody.trim();
    if (!body) return;
    setError(null);
    const { error: updateError } = await supabase.from("crm_notes").update({ body }).eq("id", editingNoteId);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditingNoteId(null);
    setEditingNoteBody("");
    load();
  }

  async function deleteNote(id: string) {
    setError(null);
    const { error: deleteError } = await supabase.from("crm_notes").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  }

  function startEditTask(task: Task) {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskDue(task.due_date ?? "");
    setEditingTaskAssignee(task.assigned_to ?? "");
  }

  async function saveEditTask() {
    if (!editingTaskId) return;
    const title = editingTaskTitle.trim();
    if (!title) return;
    setError(null);
    const { error: updateError } = await supabase
      .from("crm_tasks")
      .update({ title, due_date: editingTaskDue || null, assigned_to: editingTaskAssignee || null })
      .eq("id", editingTaskId);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditingTaskId(null);
    setEditingTaskTitle("");
    setEditingTaskDue("");
    setEditingTaskAssignee("");
    load();
  }

  async function deleteTask(id: string) {
    setError(null);
    const { error: deleteError } = await supabase.from("crm_tasks").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  }

  const openTaskCount = tasks.filter((t) => t.status === "open").length;

  return (
    <div className="mt-3 border-t border-forest/5 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-semibold text-forest hover:text-forest-dark"
      >
        {open ? "Hide CRM" : "CRM"}
        {!open && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${stageColors[stage]}`}>
            {stage}
          </span>
        )}
        {!open && openTaskCount > 0 && (
          <span className="rounded-full bg-harvest-gold/15 px-2 py-0.5 text-[10px] font-semibold text-harvest-gold">
            {openTaskCount} open task{openTaskCount === 1 ? "" : "s"}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-4 rounded-xl bg-forest/5 p-4">
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <div>
            <p className="text-xs font-semibold text-forest-dark/70">Pipeline Stage</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {stages.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={savingStage}
                  onClick={() => handleStageChange(s.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                    stage === s.value ? stageColors[s.value] : "bg-white text-forest-dark/50 hover:bg-forest/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-forest-dark/70">Follow-up Tasks</p>
            {loading && <p className="mt-1.5 text-xs text-forest-dark/50">Loading…</p>}
            {!loading && tasks.length === 0 && <p className="mt-1.5 text-xs text-forest-dark/50">No tasks yet.</p>}
            {!loading && tasks.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {tasks.map((t) => {
                  const overdue =
                    t.status === "open" && t.due_date && new Date(t.due_date) < new Date(new Date().toDateString());
                  if (editingTaskId === t.id) {
                    return (
                      <li key={t.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-2 text-sm">
                        <input
                          value={editingTaskTitle}
                          onChange={(e) => setEditingTaskTitle(e.target.value)}
                          className="min-w-[160px] flex-1 rounded-lg border border-forest/20 px-2 py-1 text-xs"
                        />
                        <input
                          type="date"
                          value={editingTaskDue}
                          onChange={(e) => setEditingTaskDue(e.target.value)}
                          className="rounded-lg border border-forest/20 px-2 py-1 text-xs"
                        />
                        <select
                          value={editingTaskAssignee}
                          onChange={(e) => setEditingTaskAssignee(e.target.value)}
                          className="rounded-lg border border-forest/20 px-2 py-1 text-xs"
                        >
                          <option value="">Unassigned</option>
                          {staffEmails.map((email) => (
                            <option key={email} value={email}>
                              {email}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={saveEditTask}
                          disabled={!editingTaskTitle.trim()}
                          className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-natural-white disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTaskId(null)}
                          className="text-xs font-semibold text-forest-dark/60 hover:text-forest-dark"
                        >
                          Cancel
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={t.id} className="group flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={t.status === "done"}
                        onChange={() => toggleTask(t)}
                        className="shrink-0"
                      />
                      <span className={t.status === "done" ? "text-forest-dark/40 line-through" : "text-forest-dark/80"}>
                        {t.title}
                      </span>
                      {t.due_date && (
                        <span className={`text-xs ${overdue ? "font-semibold text-red-600" : "text-forest-dark/50"}`}>
                          due {formatDate(t.due_date)}
                        </span>
                      )}
                      {t.assigned_to && (
                        <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest">
                          {t.assigned_to}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditTask(t)}
                        className="ml-auto text-xs text-forest-dark/40 hover:text-forest-dark"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(t.id)}
                        className="text-xs text-red-500/70 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <form onSubmit={handleAddTask} className="mt-2 flex flex-wrap gap-2">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Follow up about…"
                className="min-w-[180px] flex-1 rounded-lg border border-forest/20 px-2 py-1.5 text-xs"
              />
              <input
                type="date"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                className="rounded-lg border border-forest/20 px-2 py-1.5 text-xs"
              />
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="rounded-lg border border-forest/20 px-2 py-1.5 text-xs"
              >
                <option value="">Unassigned</option>
                {staffEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={addingTask || !newTaskTitle.trim()}
                className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
              >
                {addingTask ? "Adding…" : "Add Task"}
              </button>
            </form>
          </div>

          <div>
            <p className="text-xs font-semibold text-forest-dark/70">Notes</p>
            {!loading && notes.length === 0 && <p className="mt-1.5 text-xs text-forest-dark/50">No notes yet.</p>}
            {!loading && notes.length > 0 && (
              <ul className="mt-1.5 space-y-2">
                {notes.map((n) =>
                  editingNoteId === n.id ? (
                    <li key={n.id} className="rounded-lg bg-white p-2 text-xs">
                      <textarea
                        value={editingNoteBody}
                        onChange={(e) => setEditingNoteBody(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-forest/20 px-2 py-1 text-xs"
                      />
                      <div className="mt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={saveEditNote}
                          disabled={!editingNoteBody.trim()}
                          className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-natural-white disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="text-xs font-semibold text-forest-dark/60 hover:text-forest-dark"
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  ) : (
                    <li key={n.id} className="group rounded-lg bg-white p-2 text-xs text-forest-dark/80">
                      <p>{n.body}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-[10px] text-forest-dark/40">{formatDate(n.created_at)}</p>
                        <button
                          type="button"
                          onClick={() => startEditNote(n)}
                          className="ml-auto text-[10px] text-forest-dark/40 hover:text-forest-dark"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(n.id)}
                          className="text-[10px] text-red-500/70 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
            <form onSubmit={handleAddNote} className="mt-2 flex gap-2">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note…"
                className="flex-1 rounded-lg border border-forest/20 px-2 py-1.5 text-xs"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
              >
                {addingNote ? "Adding…" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
