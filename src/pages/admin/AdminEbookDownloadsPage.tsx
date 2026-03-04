import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  Download,
  Search,
  RefreshCw,
  BookOpen,
  Users,
  Calendar,
  Mail,
  Filter,
  ChevronDown,
  ChevronUp,
  FileDown,
} from 'lucide-react';

interface EbookDownload {
  id: string;
  email: string;
  ebook_id: string;
  ebook_title: string;
  gdpr_consent: boolean;
  gdpr_consent_date: string;
  downloaded_at: string;
  created_at: string;
}

interface Stats {
  total: number;
  uniqueEmails: number;
  byEbook: Record<string, number>;
  last7Days: number;
  last30Days: number;
}

const AdminEbookDownloadsPage = () => {
  const [downloads, setDownloads] = useState<EbookDownload[]>([]);
  const [filtered, setFiltered] = useState<EbookDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEbook, setFilterEbook] = useState('all');
  const [sortField, setSortField] = useState<keyof EbookDownload>('downloaded_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    uniqueEmails: 0,
    byEbook: {},
    last7Days: 0,
    last30Days: 0,
  });

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ebook_downloads')
        .select('*')
        .order('downloaded_at', { ascending: false });

      if (error) throw error;

      const list = (data as EbookDownload[]) || [];
      setDownloads(list);
      computeStats(list);
    } catch (err) {
      console.error('Erro ao carregar downloads:', err);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (list: EbookDownload[]) => {
    const now = new Date();
    const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const uniqueEmails = new Set(list.map((d) => d.email)).size;
    const byEbook: Record<string, number> = {};
    list.forEach((d) => {
      byEbook[d.ebook_title] = (byEbook[d.ebook_title] || 0) + 1;
    });

    setStats({
      total: list.length,
      uniqueEmails,
      byEbook,
      last7Days: list.filter((d) => new Date(d.downloaded_at) >= day7).length,
      last30Days: list.filter((d) => new Date(d.downloaded_at) >= day30).length,
    });
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Filtrar e ordenar
  useEffect(() => {
    let result = [...downloads];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.email.toLowerCase().includes(term) ||
          d.ebook_title.toLowerCase().includes(term)
      );
    }

    if (filterEbook !== 'all') {
      result = result.filter((d) => d.ebook_id === filterEbook);
    }

    result.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    setFiltered(result);
  }, [downloads, searchTerm, filterEbook, sortField, sortDir]);

  const handleSort = (field: keyof EbookDownload) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'E-book', 'Data de Download', 'Consentimento RGPD'];
    const rows = filtered.map((d) => [
      d.email,
      d.ebook_title,
      new Date(d.downloaded_at).toLocaleString('pt-PT'),
      d.gdpr_consent ? 'Sim' : 'Não',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ebook_downloads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uniqueEbooks = Array.from(new Set(downloads.map((d) => d.ebook_id))).map((id) => ({
    id,
    title: downloads.find((d) => d.ebook_id === id)?.ebook_title || id,
  }));

  const SortIcon = ({ field }: { field: keyof EbookDownload }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da secção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-[#2C4A3E] mb-1">Downloads de E-books</h2>
          <p className="text-sm text-gray-400">
            Registo de todos os utilizadores que descarregaram e-books
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDownloads}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#2C4A3E] rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#6FA89E] text-white rounded-lg hover:bg-[#5d8d84] transition-colors text-sm disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6FA89E]/10 rounded-lg">
              <Download className="w-4 h-4 text-[#6FA89E]" />
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Total Downloads
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2C4A3E]">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6FA89E]/10 rounded-lg">
              <Users className="w-4 h-4 text-[#6FA89E]" />
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              E-mails Únicos
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2C4A3E]">{stats.uniqueEmails}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6FA89E]/10 rounded-lg">
              <Calendar className="w-4 h-4 text-[#6FA89E]" />
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Últimos 7 dias
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2C4A3E]">{stats.last7Days}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6FA89E]/10 rounded-lg">
              <BookOpen className="w-4 h-4 text-[#6FA89E]" />
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Últimos 30 dias
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2C4A3E]">{stats.last30Days}</p>
        </div>
      </div>

      {/* Por e-book */}
      {Object.keys(stats.byEbook).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-[#2C4A3E] mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6FA89E]" />
            Downloads por E-book
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byEbook).map(([title, count]) => (
              <div key={title}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{title}</span>
                  <span className="text-[#6FA89E] font-bold">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#6FA89E] h-2 rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros e pesquisa */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por e-mail ou e-book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E]"
            />
          </div>
          {uniqueEbooks.length > 1 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterEbook}
                onChange={(e) => setFilterEbook(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E] bg-white appearance-none"
              >
                <option value="all">Todos os e-books</option>
                {uniqueEbooks.map((eb) => (
                  <option key={eb.id} value={eb.id}>
                    {eb.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {filtered.length !== downloads.length && (
          <p className="text-xs text-gray-400 mt-2">
            A mostrar {filtered.length} de {downloads.length} registos
          </p>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-[#6FA89E] animate-spin mr-3" />
            <span className="text-gray-400">A carregar dados...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Download className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">Nenhum download registado</p>
            <p className="text-sm text-gray-300 mt-1">
              {searchTerm || filterEbook !== 'all'
                ? 'Tente ajustar os filtros de pesquisa.'
                : 'Os downloads aparecerão aqui assim que alguém descarregar um e-book.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-[#6FA89E] select-none"
                    onClick={() => handleSort('email')}
                  >
                    <Mail className="w-3 h-3 inline mr-1" />
                    E-mail
                    <SortIcon field="email" />
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-[#6FA89E] select-none"
                    onClick={() => handleSort('ebook_title')}
                  >
                    <BookOpen className="w-3 h-3 inline mr-1" />
                    E-book
                    <SortIcon field="ebook_title" />
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-[#6FA89E] select-none"
                    onClick={() => handleSort('downloaded_at')}
                  >
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Data de Download
                    <SortIcon field="downloaded_at" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    RGPD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((download) => (
                  <tr key={download.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#6FA89E]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-[#6FA89E]">
                            {download.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-700 font-medium">{download.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#6FA89E]/10 text-[#6FA89E] text-xs font-medium rounded-full">
                        <BookOpen className="w-3 h-3" />
                        {download.ebook_title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(download.downloaded_at).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {download.gdpr_consent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                          ✓ Consentido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                          ✗ Não consentido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rodapé informativo */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          Total de {filtered.length} registo{filtered.length !== 1 ? 's' : ''} · Dados tratados em
          conformidade com o RGPD
        </p>
      )}
    </div>
  );
};

export default AdminEbookDownloadsPage;
