import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const Registro = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    razaoSocial: '',
    cnpj: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.registro(form);
      
      if (response.data.success) {
        login(
          response.data.data.token,
          response.data.data.empresaId,
          response.data.data.usuarioId
        );
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Criar Conta</h1>
          <p className="text-slate-600 mt-2">Comece sua jornada de regularização</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />

          <Input
            label="Razão Social"
            placeholder="Sua Empresa LTDA"
            value={form.razaoSocial}
            onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
            required
          />

          <Input
            label="CNPJ"
            placeholder="12345678000199"
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-6"
          >
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
};
