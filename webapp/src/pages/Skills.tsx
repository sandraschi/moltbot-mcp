import { BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchSkillContent, fetchSkills } from "../api/client";

export function Skills() {
  const [skills, setSkills] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Stable per-content line ids: the rendered copy is static, so an id
  // derived from position + text never changes while the content is shown.
  const lines = useMemo(
    () =>
      (content ?? "")
        .split("\n")
        .map((text, n) => ({ id: `${n}:${text.slice(0, 32)}`, text })),
    [content],
  );

  useEffect(() => {
    fetchSkills()
      .then((s) => {
        setSkills(s);
        setLoading(false);
        if (s.length > 0) setSelected(s[0]);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchSkillContent(selected)
      .then(setContent)
      .catch(() => setContent("Failed to load skill content."));
  }, [selected]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-100">Skills</h1>
      {loading && <p className="text-sm text-gray-400">Loading skills...</p>}
      {!loading && skills.length === 0 && (
        <p className="text-sm text-gray-500">No skills available.</p>
      )}
      {skills.length > 0 && (
        <div className="flex gap-6">
          <nav className="w-48 shrink-0 space-y-1">
            {skills.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelected(s)}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${
                  selected === s
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {s}
              </button>
            ))}
          </nav>
          <div className="min-w-0 flex-1">
            {content ? (
              <div className="prose prose-invert max-w-none rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-sm text-gray-300">
                {lines.map((line) => (
                  <p key={line.id} className="mb-1">
                    {line.text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a skill to view its content.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
