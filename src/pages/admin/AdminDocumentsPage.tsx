import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

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
  description?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const AdminDocumentsPage = () => {
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocument, setNewDocument] = useState({
    title: "",
    document_type: "evaluation",
    description: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
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
    setSelectedFile(null);
    setNewDocument({ title: "", document_type: "evaluation", description: "" });
    loadPatientDocuments(patient.id);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Ficheiro demasiado grande. O tamanho máximo é 50MB.");
      return;
    }

    setSelectedFile(file);
    if (!newDocument.title) {
      setNewDocument({ ...newDocument, title: file.name.replace(/\.[^/.]+$/, "") });
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newDocument.title) {
      alert("Por favor, preencha o título do documento.");
      return;
    }

    setUploadingFile(true);
    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Upload do ficheiro se existir
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${selectedPatient.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('patient-documents')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Obter URL público
        const { data: urlData } = supabase.storage
          .from('patient-documents')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
      }

      // Inserir documento na base de dados
      const { error } = await supabase
        .from('patient_documents')
        .insert({
          user_id: selectedPatient.id,
          title: newDocument.title,
          document_type: newDocument.document_type,
          description: newDocument.description || null,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          created_by_admin: true,
        });

      if (error) throw error;

      setNewDocument({ title: "", document_type: "evaluation", description: "" });
      setSelectedFile(null);
      await loadPatientDocuments(selectedPatient.id);
      alert("Documento adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao adicionar documento:", error);
      alert(`Erro ao adicionar documento: ${error.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este documento?")) return;

    try {
      const { error } = await supabase
        .from('patient_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      if (selectedPatient) {
        await loadPatientDocuments(selectedPatient.id);
      }
      alert("Documento eliminado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao eliminar documento:", error);
      alert(`Erro ao eliminar documento: ${error.message}`);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Lista de Pacientes */}
      <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
        <h2 className="text-lg font-serif text-[#2C4A3E] mb-4">Pacientes ({patients.length})</h2>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
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
                <div>
                  <p className="text-gray-400 text-xs mb-1">Documentos</p>
                  <p className="text-[#2C4A3E]">{documents.length}</p>
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
                  <label className="text-gray-400 text-xs mb-2 block">Título *</label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                    placeholder="Ex: Avaliação Inicial - Janeiro 2026"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">Descrição</label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none resize-none"
                    rows={3}
                    placeholder="Descrição opcional do documento"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">Ficheiro (Opcional)</label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="w-full text-sm"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="w-full py-2 bg-[#6FA89E] text-white rounded-lg text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50"
                >
                  {uploadingFile ? "A adicionar..." : "Adicionar Documento"}
                </button>
              </form>
            </div>

            {/* Lista de Documentos */}
            <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
              <h3 className="text-lg font-serif text-[#2C4A3E] mb-4">
                Documentos ({documents.length})
              </h3>
              {documents.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  Nenhum documento encontrado
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border border-gray-100 rounded-lg hover:border-[#6FA89E] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-1 bg-[#6FA89E]/10 text-[#6FA89E] rounded">
                              {getDocumentTypeLabel(doc.document_type)}
                            </span>
                          </div>
                          <h4 className="font-medium text-[#2C4A3E] text-sm mb-1">
                            {doc.title}
                          </h4>
                          {doc.description && (
                            <p className="text-xs text-gray-400 mb-2">{doc.description}</p>
                          )}
                          {doc.file_name && (
                            <p className="text-xs text-gray-400">📎 {doc.file_name}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(doc.created_at).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-[#6FA89E] text-white rounded hover:bg-[#5d8d84] transition-all"
                            >
                              Ver
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-gray-50 shadow-sm text-center">
            <p className="text-gray-400">Selecione um paciente para ver os documentos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentsPage;
