import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nif: "",
    password: "",
    confirmPassword: "",
    gdprConsent: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gdprConsent) {
      alert("Tens de aceitar os termos de tratamento de dados e comunicações.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("As passwords não coincidem.");
      return;
    }

    if (formData.password.length < 6) {
      alert("A password deve ter pelo menos 6 caracteres.");
      return;
    }

    const phoneRegex = /^9[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Número de telemóvel inválido. Deve ter 9 dígitos e começar por 9.");
      return;
    }

    setLoading(true);

    try {
      // 1. Criar conta de autenticação enviando metadados para o Trigger do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            nif: formData.nif || null
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        alert("Conta criada com sucesso! Podes agora entrar na tua conta.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      alert(error.message || "Erro ao criar conta. Por favor, tenta novamente.");
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
              className="h-48 mx-auto mb-6"
            />
          </Link>
          <h1 className="text-2xl font-serif text-[#2C4A3E] mb-2">Criar Conta</h1>
          <p className="text-gray-400 text-xs">Regista-te para agendar consultas</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Nome Completo"
              required
            />
            
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Email"
              required
            />
            
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Telemóvel (9 dígitos)"
              maxLength={9}
              required
            />
            
            <input
              type="text"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="NIF (opcional)"
              maxLength={9}
            />
            
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Password"
              required
            />
            
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm focus:border-[#6FA89E] outline-none transition-all"
              placeholder="Confirmar Password"
              required
            />

            {/* GDPR Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="gdprConsent"
                  checked={formData.gdprConsent}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-[#6FA89E] border-gray-300 rounded focus:ring-[#6FA89E]"
                  required
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Aceito o tratamento dos meus dados pessoais de acordo com o RGPD e aceito receber informações e comunicações futuras de Marlene Ruivo.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Já tens conta?{" "}
              <Link to="/login" className="text-[#6FA89E] hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
