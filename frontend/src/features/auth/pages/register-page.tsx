import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/auth-shell';
import { Input } from '@/components/ui/input';
import { AuthForm } from '@/features/auth/components/auth-form';
import { api } from '@/lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await api.register({ name, email, password });
      navigate('/login?registered=1');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível criar a conta');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <AuthForm
        title="Criar conta"
        description="Cadastre seu perfil de anfitrião e comece a montar eventos com páginas públicas e galerias privadas."
        footer={
          <>
            Já tem conta?{' '}
            <Link className="font-semibold text-sand-100 underline underline-offset-4" to="/login">
              Entrar
            </Link>
          </>
        }
        submitLabel="Criar conta"
        onSubmit={handleSubmit}
        busy={busy}
        alert={error}
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Nome</span>
          <Input type="text" placeholder="Ana Silva" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">E-mail</span>
          <Input type="email" placeholder="ana@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Senha</span>
          <Input type="password" placeholder="Senha forte" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
      </AuthForm>
    </AuthShell>
  );
}
