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
      setError(
          exception instanceof Error
              ? exception.message
              : 'Não foi possível criar a conta',
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
                  Comece seu evento
                </p>

                <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.92] tracking-[-0.055em] text-ink-900">
                  Crie uma galeria para cada momento especial.
                </h1>

                <p className="mt-5 text-sm leading-7 text-ink-800/70">
                  Cadastre sua conta, crie o primeiro evento e compartilhe um QR Code
                  com convidados para receber fotos direto do celular.
                </p>

                <div className="mt-8 grid gap-4">
                  {[
                    'Crie uma conta em poucos segundos',
                    'Gere um QR Code para o evento',
                    'Receba fotos em uma galeria privada',
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
              title="Criar conta"
              description="Crie seu perfil de anfitrião e comece a montar eventos com página pública, QR Code e galeria privada."
              footer={
                <span>
              Já tem conta?{' '}
                  <Link
                      className="font-bold text-[#ef7885] underline underline-offset-4 transition hover:text-[#d85f6d]"
                      to="/login"
                  >
                Entrar
              </Link>
            </span>
              }
              submitLabel="Criar conta"
              onSubmit={handleSubmit}
              busy={busy}
              alert={error}
          >
            <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800/80">
              Nome
            </span>

              <Input
                  type="text"
                  placeholder="Isadora & Fernando"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
              />
            </label>

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
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
              />
            </label>
          </AuthForm>
        </div>
      </AuthShell>
  );
}
