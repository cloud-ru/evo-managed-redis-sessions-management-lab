"use client";
import LoginForm from "@/components/LoginForm";
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { userId, loading } = useSession();

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!userId) {
    return <LoginForm />;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl">Hello {userId}</h1>
      <form method="post" action="/api/logout">
        <button className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
          Logout
        </button>
      </form>
    </main>
  );
}
