"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
      } else {
        setUserId(null);
      }
    } catch {
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    const endpoint = isRegistering ? "/api/register" : "/api/login";
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        // Refresh session after login/register
        await checkSession();
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        const data = await response.json();
        setMessage(data.error || "Произошла ошибка");
      }
    } catch {
      setMessage("Ошибка сети");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUserId(null);
    } catch {
      setMessage("Ошибка выхода");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-[#A0A0A0]">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {isRegistering ? "Создать аккаунт" : "Войти в систему"}
              </h2>
              <p className="text-[#A0A0A0]">
                {isRegistering ? "Настройте свой аккаунт" : "Добро пожаловать"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Email
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Введите ваш email"
                  className="input-field w-full"
                  type="email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Введите ваш пароль"
                  className="input-field w-full"
                  minLength={6}
                  required
                />
              </div>
              
              {message && (
                <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
                  <p className="text-[#EF4444] text-sm text-center">{message}</p>
                </div>
              )}
              
              <button type="submit" className="btn-primary w-full">
                {isRegistering ? "Создать аккаунт" : "Войти"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setMessage("");
                }}
                className="text-[#00D4AA] hover:text-[#00B894] text-sm font-medium transition-colors"
              >
                {isRegistering ? "Уже есть аккаунт? Войти" : "Нужен аккаунт? Создать"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Добро пожаловать, {userId}!
            </h2>
            <p className="text-[#A0A0A0]">
              Вы успешно вошли в систему.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="btn-secondary w-full"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
} 