import { Link, useNavigate, useParams } from "react-router-dom";
import { adminService } from "../shared/services";
import { State, useLoad } from "../shared/ui";
import { ContentEditor } from "./ContentEditor";

export function AdminContentFormPage({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = useLoad(
    () => (id ? adminService.get(type, id) : Promise.resolve({})),
    [type, id],
  );
  return (
    <div className="m2">
      <Link to={`/admin/${type}`}>← Back to {type}</Link>
      <h1>
        {id ? "Edit" : "Create"} {type === "courses" ? "course" : "quiz"}
      </h1>
      <State resource={resource}>
        {(initial) => (
          <ContentEditor
            key={`${type}-${id}`}
            type={type}
            initial={initial}
            onCancel={() => navigate(`/admin/${type}`)}
            onSave={async (data) => {
              const saved = await adminService.saveSettings(type, id, data);
              navigate(
                type === "courses"
                  ? `/admin/courses/${saved.id}/builder`
                  : `/admin/quizzes/${saved.id}/edit`,
              );
            }}
          />
        )}
      </State>
    </div>
  );
}
