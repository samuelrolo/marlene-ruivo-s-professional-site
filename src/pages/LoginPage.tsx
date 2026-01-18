import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      alert(error.message || "Erro ao fazer login. Verifica as tuas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img 
              src="/assets/logo-marlene-ruivo.png" 
              alt="Marlene Ruivo" 
              className="h-32 mx-auto mb-6"
            />
          </Link>
          <h1 className="text-2xl font-serif text-[#2C4A3E] mb-2">Entrar</h1>
          <p className="text-gray-400 text-xs">Acede à tua conta</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Email"
              required
            />
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-gray-400">
              Não tens conta?{" "}
              <Link to="/register" className="text-[#6FA89E] hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
