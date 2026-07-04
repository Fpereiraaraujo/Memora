import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/components/layout/auth-shell';
import { Input } from '@/components/ui/input';
import { AuthForm } from '@/features/auth/components/auth-form';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get('registered') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(registered ? 'Cadastro concluído. Entre com sua conta.' : null);

  const footer = useMemo(
    () => (
      <>
        Ainda não tem conta?{' '}
        <Link className="font-semibold text-sand-100 underline underline-offset-4" to="/register">
          Criar agora
        </Link>
      </>
    ),
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await api.login({ email, password });
      login(response);
      navigate('/app');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível autenticar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <AuthForm
        title="Entrar"
        description="Acesse o painel do anfitrião para criar eventos, gerar QR code e acompanhar as fotos dos convidados."
        footer={footer}
        submitLabel="Entrar"
        onSubmit={handleSubmit}
        busy={busy}
        alert={error}
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">E-mail</span>
          <Input type="email" placeholder="ana@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Senha</span>
          <Input type="password" placeholder="Sua senha" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
      </AuthForm>
    </AuthShell>
  );
}
