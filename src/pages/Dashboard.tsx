import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { processoService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Processo } from '../types';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNovoProcesso, setShowNovoProcesso] = useState(false);
  const [form, setForm] = useState({
    produtorNome: '',
    produtorEmail: '',
    produtorTelefone: '',
    valorTotal: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    carregarProcessos();
  }, [token, navigate]);

  const carregarProcessos = async () => {
    try {
      const response = await processoService.listar();
      setProcessos(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCriarProcesso = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await processoService.criar({
        produtorNome: form.produtorNome,
        produtorEmail: form.produtorEmail,
        produtorTelefone: form.produtorTelefone,
        valorTotal: parseFloat(form.valorTotal),
      });

      setForm({
        produtorNome: '',
        produtorEmail: '',
        produtorTelefone: '',
        valorTotal: '',
      });
      setShowNovoProcesso(false);
      carregarProcessos();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ETAPAS = [
    'Lead', 'Qualificação', 'Proposta', 'Contrato', 'Onboarding',
    'Análise Técnica', 'Execução CAR', 'Execução PRA', 'Execução CRA',
    'Protocolo', 'Acompanhamento', 'Aprovação', 'Entrega',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Regularização Ambiental</h1>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Processos</h2>
            <p className="text-slate-600 mt-1">{processos.length} processos em andamento</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowNovoProcesso(!showNovoProcesso)}
          >
            + Novo Processo
          </Button>
        </div>

        {showNovoProcesso && (
          <Card className="mb-8 bg-gradient-to-br from-primary-50 to-slate-50">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Criar Novo Processo</h3>
            <form onSubmit={handleCriarProcesso} className="space-y-4">
              <Input
                label="Nome do Produtor"
                placeholder="João da Silva"
                value={form.produtorNome}
                onChange={(e) => setForm({ ...form, produtorNome: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="joao@fazenda.com"
                value={form.produtorEmail}
                onChange={(e) => setForm({ ...form, produtorEmail: e.target.value })}
                required
              />

              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={form.produtorTelefone}
                onChange={(e) => setForm({ ...form, produtorTelefone: e.target.value })}
                required
              />

              <Input
                label="Valor Total"
                type="number"
                placeholder="5000"
                value={form.valorTotal}
                onChange={(e) => setForm({ ...form, valorTotal: e.target.value })}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  Criar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNovoProcesso(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {processos.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-slate-600">Nenhum processo criado ainda</p>
            </Card>
          ) : (
            processos.map((processo) => (
              <Card key={processo.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {processo.numero}
                    </h4>
                    <p className="text-slate-600 text-sm">{processo.produtorNome}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {ETAPAS[processo.etapaAtual - 1] || 'Desconhecida'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progresso</span>
                    <span className="font-medium text-slate-900">{processo.percentual}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${processo.percentual}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{processo.produtorEmail}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Valor</p>
                    <p className="font-medium text-slate-900">
                      R$ {parseFloat(String(processo.valorTotal)).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <Button variant="secondary" size="sm" className="w-full">
                  Ver Detalhes
                </Button>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
