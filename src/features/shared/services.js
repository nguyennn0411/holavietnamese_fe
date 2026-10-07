import { httpClient } from "@/api/httpClient";
import { notify, confirmAction } from "./Feedback";
export const query = (params) =>
  new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v !== "" && v != null),
  ).toString();
export const get = (path, params) =>
  httpClient(`${path}${params ? `?${query(params)}` : ""}`);
export const send = async (path, data, method = "POST") => {
  if (method === "DELETE")
    confirmAction(
      "Delete this item? Content with learner history will be retained; archive it instead.",
    );
  if (path.endsWith("/status") && ["ARCHIVED", "DRAFT"].includes(data?.status))
    confirmAction(
      `Change this content to ${data.status.toLowerCase()}? It will no longer be available for new learning.`,
    );
  const result = await httpClient(path, {
    method,
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  if (path.startsWith("/admin/"))
    notify(
      method === "DELETE"
        ? "Content removed successfully."
        : "Changes saved successfully.",
    );
  return result;
};
export const courseService = {
  getCourses: (params) => get("/courses", { page: 0, ...params }),
  getCourse: (id) => get(`/courses/${id}`),
  enroll: (id) => send(`/courses/${id}/enroll`),
  async myCourses() { const page = await this.mine(); return page.content.map(c => ({...c, ...c.progress, id:c.id, courseId:c.id, enrollmentId:c.progress.id})); },
  async lessons(id) { const c = await this.getCourse(id); return c.modules.flatMap(m => m.lessons).map(l=>({...l,courseId:c.id})); },
  mine: () => get("/users/me/courses", { page: 0, size: 100 }),
};
export const lessonService = {
  getLesson: (id) => get(`/lessons/${id}`),
  getActivities: (id) => get(`/lessons/${id}/activities`),
  start: (id) => send(`/lessons/${id}/start`),
  complete: (id) => send(`/lessons/${id}/complete`),
  completeActivity: (id, answer) =>
    send(`/activities/${id}/complete`, { answer: answer ?? {} }),
};
export const progressService = {
  lesson: (id) => get(`/lessons/${id}/progress`),
  course: (id) => get(`/courses/${id}/progress`),
};
export const grammarService = {
  list: (params) => get("/grammar", params),
  detail: (id) => get(`/grammar/${id}`),
};
export const quizService = {
  get: (id) => get(`/quizzes/${id}`),
  start: (id) => send(`/quizzes/${id}/start`),
  attempt: (id) => get(`/quiz-attempts/${id}`),
  save: (id, question, answer) =>
    send(`/quiz-attempts/${id}/answers/${question}`, { answer }, "PUT"),
  submit: (id) => send(`/quiz-attempts/${id}/submit`),
  result: (id) => get(`/quiz-attempts/${id}/result`),
  retry: (id) => send(`/quizzes/${id}/retry`),
};
export const adminService = {
  list: (type, params) => get(`/admin/${type}`, { page: 0, ...params }),
  get: (type, id) => get(`/admin/${type}/${id}`),
  save: (type, id, data) =>
    send(`/admin/${type}${id ? `/${id}` : ""}`, data, id ? "PUT" : "POST"),
  async saveSettings(type, id, data) {
    if (!["courses", "grammar", "quizzes"].includes(type))
      return this.save(type, id, data);
    const { status, ...body } = data;
    const saved = await this.save(type, id, body);
    const key = id || saved.id;
    if (
      status &&
      status !== (saved.status || saved.publicationStatus || "DRAFT")
    )
      await this.status(type, key, status);
    return saved;
  },
  status: (type, id, status) =>
    send(`/admin/${type}/${id}/status`, { status }, "PATCH"),
  remove: (type, id) => send(`/admin/${type}/${id}`, undefined, "DELETE"),
  reorder: (path, ids) => send(`/admin/${path}/reorder`, { ids }, "PUT"),
};
