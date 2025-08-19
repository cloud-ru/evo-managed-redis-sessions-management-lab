import { useEffect, useState } from "react";

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Not authenticated");
        }
      })
      .then((d) => {
        setUserId(d?.userId ?? null);
        setError(null);
      })
      .catch((err) => {
        setUserId(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { userId, loading, error };
}
