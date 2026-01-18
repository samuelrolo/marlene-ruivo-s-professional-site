import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
}

interface PatientDocument {
  id: string;
  title: string;
  document_type: string;
  created_at: string;
  file_name?: string;
}

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    document_type: "evaluation",
    description: "",
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== "marleneruivo@example.com") {
        navigate("/");
        return;
      }

      // Carregar lista de pacientes
      const { data: profilesData, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (error) throw error;
      setPatients(profilesData || []);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDocuments = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    }
  };

  const handlePatientSelect = (patient: UserProfile) => {
    setSelectedPatient(patient);
    loadPatientDocuments(patient.id);
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newDocument.title) return;

    setUploadingFile(true);
    try {
      const { error } = await supabase
        .from('patient_documents')
        .insert({
          user_id: selectedPatient.id,
          title: newDocument.title,
          document_type: newDocument.document_type,
          description: newDocument.description,
          created_by_admin: true,
        });

      if (error) throw error;

      setNewDocument({ title: "", document_type: "evaluation", description: "" });
      await loadPatientDocuments(selectedPatient.id);
      alert("Documento adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao adicionar documento:", error);
      alert("Erro ao adicionar documento.");
    } finally {
      setUploadingFile(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      evaluation: "Avaliação",
      meal_plan: "Plano Alimentar",
      weight_record: "Registo de Peso",
      intolerance: "Intolerância",
      clinical_analysis: "Análise Clínica",
      consultation_notes: "Notas de Consulta",
      other: "Outro",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <p className="text-gray-400">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <main className="pb-20 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#2C4A3E] mb-2">Painel Administrativo</h1>
          <p className="text-gray-400 text-sm">Gerir documentos e registos de pacientes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de Pacientes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
            <h2 className="text-lg font-serif text-[#2C4A3E] mb-4">Pacientes</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedPatient?.id === patient.id
                      ? "bg-[#6FA89E] text-white"
                      : "bg-gray-50 text-[#2C4A3E] hover:bg-gray-100"
                  }`}
                >
                  <p className="font-medium text-sm">{patient.full_name}</p>
                  <p className="text-xs opacity-75">{patient.phone}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detalhes do Paciente */}
          <div className="md:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                {/* Informações do Paciente */}
                <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
                  <h2 className="text-lg font-serif text-[#2C4A3E] mb-4">
                    {selectedPatient.full_name}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Telemóvel</p>
                      <p className="text-[#2C4A3E]">{selectedPatient.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Adicionar Documento */}
                <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
                  <h3 className="text-lg font-serif text-[#2C4A3E] mb-4">Adicionar Documento</h3>
                  <form onSubmit={handleUploadDocument} className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block">Tipo de Documento</label>
                      <select
                        value={newDocument.document_type}
                        onChange={(e) =>
                          setNewDocument({ ...newDocument, document_type: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                      >
                        <option value="evaluation">Avaliação</option>
                        <option value="meal_plan">Plano Alimentar</option>
                        <option value="weight_record">Registo de Peso</option>
                        <option value="intolerance">Intolerância</option>
                        <option value="clinical_analysis">Análise Clínica</option>
                        <option value="consultation_notes">Notas de Consulta</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block">Título</label>
                      <input
                        type="text"
                        value={newDocument.title}
                        onChange={(e) =>
                          setNewDocument({ ...newDocument, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                        placeholder="Ex: Avaliação Inicial"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block">Descrição (opcional)</label>
                      <textarea
                        value={newDocument.description}
                        onChange={(e) =>
                          setNewDocument({ ...newDocument, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                        placeholder="Adicione notas ou observações..."
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingFile}
                      className="w-full px-4 py-2 bg-[#6FA89E] text-white rounded-lg text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50"
                    >
                      {uploadingFile ? "A adicionar..." : "Adicionar Documento"}
                    </button>
                  </form>
                </div>

                {/* Documentos Existentes */}
                <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
                  <h3 className="text-lg font-serif text-[#2C4A3E] mb-4">Documentos</h3>
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 border border-gray-100 rounded-lg hover:border-[#6FA89E]/30 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-[#2C4A3E]">{doc.title}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {getDocumentTypeLabel(doc.document_type)}
                              </p>
                              <p className="text-xs text-gray-300 mt-1">
                                {new Date(doc.created_at).toLocaleDateString("pt-PT")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum documento adicionado ainda.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-gray-50 shadow-sm text-center">
                <p className="text-gray-400">Selecione um paciente para começar.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanelPage;
