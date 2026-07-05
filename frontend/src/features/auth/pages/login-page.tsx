import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthShell } from '@/components/layout/auth-shell';
import { Input } from '@/components/ui/input';
import { AuthForm } from '@/features/auth/components/auth-form';
import { useAuth } from '@/features/auth/auth-context';
import { api } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const registered = searchParams.get('registered') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
      registered ? 'Cadastro concluído. Entre com sua conta.' : null,
  );

  const footer = useMemo(
      () => (
          <span>
        Ainda não tem conta?{' '}
            <Link
                className="font-bold text-[#ef7885] underline underline-offset-4 transition hover:text-[#d85f6d]"
                to="/register"
            >
          Criar agora
        </Link>
      </span>
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
      setError(
          exception instanceof Error
              ? exception.message
              : 'Não foi possível autenticar',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
      <AuthShell>
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-[2.8rem] border border-[#f0d8ca] bg-white/62 p-8 shadow-[0_28px_90px_rgba(96,60,36,0.09)] backdrop-blur">
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#f4a1aa]/22 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-[#d8a84f]/20 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b9852f]">
                  Bem-vindo de volta
                </p>

                <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.92] tracking-[-0.055em] text-ink-900">
                  Continue organizando suas memórias.
                </h1>

                <p className="mt-5 text-sm leading-7 text-ink-800/70">
                  Acesse seu painel para criar eventos, compartilhar QR Codes e acompanhar
                  as fotos enviadas pelos convidados.
                </p>

                <div className="mt-8 grid gap-4">
                  {[
                    'Eventos com QR Code personalizado',
                    'Galeria privada para cada celebração',
                    'Upload simples para convidados',
                  ].map((item, index) => (
                      <div
                          key={item}
                          className="flex items-center gap-4 rounded-[1.7rem] border border-[#f0d8ca] bg-white/72 p-4 shadow-[0_14px_38px_rgba(96,60,36,0.06)]"
                      >
                        <div className="grid size-10 place-items-center rounded-2xl bg-[#fff1f2] text-sm font-bold text-[#ef7885]">
                          0{index + 1}
                        </div>

                        <p className="text-sm font-semibold text-ink-800/74">
                          {item}
                        </p>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AuthForm
              title="Entrar"
              description="Acesse o painel do casal para criar eventos, gerar QR Code e acompanhar as fotos enviadas pelos convidados."
              footer={footer}
              submitLabel="Entrar"
              onSubmit={handleSubmit}
              busy={busy}
              alert={error}
          >
            <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800/80">
              E-mail
            </span>

              <Input
                  type="email"
                  placeholder="ana@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
              />
            </label>

            <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800/80">
              Senha
            </span>

              <Input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
              />
            </label>
          </AuthForm>
        </div>
      </AuthShell>
  );
}