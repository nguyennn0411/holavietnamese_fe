import { useEffect, useState } from "react";

export function notify(message) {
  window.dispatchEvent(new CustomEvent("hola:feedback", { detail: message }));
}
export function confirmAction(message) {
  if (!window.confirm(message)) {
    const error = new Error("Action cancelled");
    error.cancelled = true;
    throw error;
  }
}
export function Feedback() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const receive = (event) => setMessage(event.detail);
    window.addEventListener("hola:feedback", receive);
    return () => window.removeEventListener("hola:feedback", receive);
  }, []);
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timeout);
  }, [message]);
  return message ? (
    <div className="m2-toast" role="status">
      {message}
      <button aria-label="Dismiss notification" onClick={() => setMessage("")}>
        ×
      </button>
    </div>
  ) : null;
}
