'use client';

/**
 * Página de registro de nuevos usuarios
 * Flujo: registro → confirmación por código → login automático
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth/auth-store';

type Step = 'form' | 'confirm';

export default function RegistroPage() {
  const router          = useRouter();
  const register        = useAuthStore((s) => s.register);
  const confirmRegister = useAuthStore((s) => s.confirmRegister);
  const resendCode      = useAuthStore((s) => s.resendCode);
  const login           = useAuthStore((s) => s.login);
  const loading         = useAuthStore((s) => s.isLoading);

  const [step,     setStep]     = useState<Step>('form');
  const [nombre,   setNombre]   = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [code,     setCode]     = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [resent,   setResent]   = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const result = await register(email, password, nombre);
      if (result.needsConfirmation) {
        setStep('confirm');
      } else {
        // Auto-confirm (admin confirmation disabled)
        await login(email, password);
        router.push('/cuenta');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      if (msg.includes('UsernameExistsException') || msg.includes('already exists')) {
        setError('Ya existe una cuenta con este email. ¿Quieres iniciar sesión?');
      } else if (msg.includes('InvalidPasswordException')) {
        setError('La contraseña no cumple los requisitos mínimos de seguridad.');
      } else {
        setError(msg);
      }
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await confirmRegister(email, code);
      await login(email, password);
      router.push('/cuenta');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Código incorrecto';
      if (msg.includes('CodeMismatchException')) {
        setError('El código ingresado es incorrecto.');
      } else if (msg.includes('ExpiredCodeException')) {
        setError('El código expiró. Solicita uno nuevo.');
      } else {
        setError(msg);
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendCode(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError('No se pudo reenviar el código. Intenta más tarde.');
    }
  };

  if (step === 'confirm') {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirma tu cuenta</CardTitle>
          <CardDescription>
            Enviamos un código de verificación a{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConfirm} noValidate className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="code" className="text-sm font-medium">
                Código de verificación
              </label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                autoFocus
                className="text-center text-lg tracking-widest"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}
            {resent && (
              <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md">
                ¡Código reenviado! Revisa tu correo.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading || code.length < 6}>
              {loading ? 'Verificando...' : 'Confirmar cuenta'}
            </Button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              ¿No recibiste el código? Reenviar
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>Regístrate gratis y empieza a comprar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} noValidate className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre completo
            </label>
            <Input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creando cuenta...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
