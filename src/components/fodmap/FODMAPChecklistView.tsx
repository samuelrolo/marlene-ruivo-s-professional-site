import { useState, useEffect } from 'react';
import { FODMAPFood, FODMAPChecklistEntry, FODMAPCategory } from '@/types/fodmap';
import { supabase } from '@/lib/supabase';
import { Loader2, Check, X, Calendar, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FODMAPChecklistViewProps {
  checklistId: string;
}

const CATEGORIES: FODMAPCategory[] = [
  'Frutanos – Vegetais',
  'Frutanos – Cereais',
  'Galactanos (leguminosas)',
  'Lactose',
  'Frutose em excesso – Fruta',
  'Frutose – Outros',
  'Polióis – Fruta e Vegetais',
  'Polióis – Adoçantes'
];

const FODMAPChecklistView = ({ checklistId }: FODMAPChecklistViewProps) => {
  const [foods, setFoods] = useState<FODMAPFood[]>([]);
  const [entries, setEntries] = useState<Map<string, FODMAPChecklistEntry>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<FODMAPCategory | 'all'>('all');
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state para edição
  const [formData, setFormData] = useState({
    tested: false,
    tested_date: '',
    symptoms: '',
    tolerated: undefined as boolean | undefined,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [checklistId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar alimentos
      const { data: foodsData, error: foodsError } = await supabase
        .from('fodmap_foods')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (foodsError) throw foodsError;
      setFoods(foodsData || []);

      // Carregar entradas existentes
      const { data: entriesData, error: entriesError } = await supabase
        .from('fodmap_checklist_entries')
        .select('*')
        .eq('checklist_id', checklistId);

      if (entriesError) throw entriesError;

      const entriesMap = new Map<string, FODMAPChecklistEntry>();
      (entriesData || []).forEach(entry => {
        entriesMap.set(entry.fodmap_food_id, entry);
      });
      setEntries(entriesMap);

    } catch (error) {
      console.error('Error loading FODMAP checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (foodId: string) => {
    const entry = entries.get(foodId);
    if (entry) {
      setFormData({
        tested: entry.tested,
        tested_date: entry.tested_date || '',
        symptoms: entry.symptoms || '',
        tolerated: entry.tolerated,
        notes: entry.notes || ''
      });
    } else {
      setFormData({
        tested: false,
        tested_date: '',
        symptoms: '',
        tolerated: undefined,
        notes: ''
      });
    }
    setEditingEntry(foodId);
  };

  const handleSave = async (foodId: string) => {
    setSaving(true);
    try {
      const existingEntry = entries.get(foodId);

      const entryData = {
        checklist_id: checklistId,
        fodmap_food_id: foodId,
        tested: formData.tested,
        tested_date: formData.tested_date || null,
        symptoms: formData.symptoms || null,
        tolerated: formData.tolerated,
        notes: formData.notes || null
      };

      if (existingEntry) {
        // Update
        const { data, error } = await supabase
          .from('fodmap_checklist_entries')
          .update(entryData)
          .eq('id', existingEntry.id)
          .select()
          .single();

        if (error) throw error;
        entries.set(foodId, data);
      } else {
        // Insert
        const { data, error } = await supabase
          .from('fodmap_checklist_entries')
          .insert(entryData)
          .select()
          .single();

        if (error) throw error;
        entries.set(foodId, data);
      }

      setEntries(new Map(entries));
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Erro ao guardar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
  };

  const filteredFoods = selectedCategory === 'all'
    ? foods
    : foods.filter(f => f.category === selectedCategory);

  const getStatusIcon = (foodId: string) => {
    const entry = entries.get(foodId);
    if (!entry || !entry.tested) return null;

    if (entry.tolerated === true) {
      return <Check className="w-5 h-5 text-green-600" />;
    } else if (entry.tolerated === false) {
      return <X className="w-5 h-5 text-red-600" />;
    }
    return null;
  };

  const getStatusColor = (foodId: string) => {
    const entry = entries.get(foodId);
    if (!entry || !entry.tested) return 'border-gray-200 bg-white';

    if (entry.tolerated === true) {
      return 'border-green-200 bg-green-50';
    } else if (entry.tolerated === false) {
      return 'border-red-200 bg-red-50';
    }
    return 'border-yellow-200 bg-yellow-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  // Calcular estatísticas
  const stats = {
    total: foods.length,
    tested: Array.from(entries.values()).filter(e => e.tested).length,
    tolerated: Array.from(entries.values()).filter(e => e.tested && e.tolerated === true).length,
    notTolerated: Array.from(entries.values()).filter(e => e.tested && e.tolerated === false).length
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.tested}/{stats.total}</div>
          <div className="text-sm text-gray-600">Alimentos Testados</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-2xl font-bold text-green-700">{stats.tolerated}</div>
          <div className="text-sm text-green-600">Tolerados</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-2xl font-bold text-red-700">{stats.notTolerated}</div>
          <div className="text-sm text-red-600">Não Tolerados</div>
        </div>
        <div className="bg-[#6FA89E]/10 rounded-lg border border-[#6FA89E]/30 p-4">
          <div className="text-2xl font-bold text-[#6FA89E]">
            {Math.round((stats.tested / stats.total) * 100)}%
          </div>
          <div className="text-sm text-[#6FA89E]">Progresso</div>
        </div>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === 'all'
              ? "bg-[#6FA89E] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Todas ({foods.length})
        </button>
        {CATEGORIES.map(category => {
          const count = foods.filter(f => f.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedCategory === category
                  ? "bg-[#6FA89E] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de Alimentos */}
      <div className="space-y-2">
        {filteredFoods.map(food => {
          const entry = entries.get(food.id);
          const isEditing = editingEntry === food.id;

          return (
            <div
              key={food.id}
              className={cn(
                "border-2 rounded-lg transition-all",
                getStatusColor(food.id)
              )}
            >
              {/* Linha Principal */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(food.id)}
                  <div>
                    <div className="font-medium text-gray-900">{food.food_name}</div>
                    <div className="text-sm text-gray-500">{food.category}</div>
                  </div>
                </div>

                <button
                  onClick={() => isEditing ? handleCancel() : handleEdit(food.id)}
                  className="px-4 py-2 text-sm font-medium text-[#6FA89E] hover:bg-[#6FA89E]/10 rounded-lg transition-all"
                >
                  {isEditing ? 'Cancelar' : entry?.tested ? 'Editar' : 'Registar'}
                </button>
              </div>

              {/* Formulário de Edição */}
              {isEditing && (
                <div className="border-t border-gray-200 p-4 bg-white space-y-4">
                  {/* Testado */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.tested}
                      onChange={(e) => setFormData({ ...formData, tested: e.target.checked })}
                      className="w-4 h-4 text-[#6FA89E] focus:ring-[#6FA89E] rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Já testei este alimento</span>
                  </label>

                  {formData.tested && (
                    <>
                      {/* Data do Teste */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Data do Teste
                        </label>
                        <input
                          type="date"
                          value={formData.tested_date}
                          onChange={(e) => setFormData({ ...formData, tested_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30"
                        />
                      </div>

                      {/* Sintomas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sintomas
                        </label>
                        <input
                          type="text"
                          value={formData.symptoms}
                          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                          placeholder="Ex: Cólicas, inchaço, diarreia..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30"
                        />
                      </div>

                      {/* Tolerado */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tolerado?
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, tolerated: true })}
                            className={cn(
                              "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                              formData.tolerated === true
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, tolerated: false })}
                            className={cn(
                              "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                              formData.tolerated === false
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            Não
                          </button>
                        </div>
                      </div>

                      {/* Notas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <StickyNote className="w-4 h-4 inline mr-1" />
                          Notas Adicionais
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={2}
                          placeholder="Observações adicionais..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 resize-none"
                        />
                      </div>

                      {/* Botão Guardar */}
                      <button
                        onClick={() => handleSave(food.id)}
                        disabled={saving}
                        className="w-full py-3 bg-[#6FA89E] text-white rounded-lg font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            A guardar...
                          </>
                        ) : (
                          'Guardar'
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Informação Existente (quando não está a editar) */}
              {!isEditing && entry?.tested && (
                <div className="border-t border-gray-200 p-4 bg-white/50 text-sm space-y-1">
                  {entry.tested_date && (
                    <div className="text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Testado em: {new Date(entry.tested_date).toLocaleDateString('pt-PT')}
                    </div>
                  )}
                  {entry.symptoms && (
                    <div className="text-gray-600">
                      Sintomas: {entry.symptoms}
                    </div>
                  )}
                  {entry.notes && (
                    <div className="text-gray-600">
                      <StickyNote className="w-4 h-4 inline mr-1" />
                      {entry.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FODMAPChecklistView;
