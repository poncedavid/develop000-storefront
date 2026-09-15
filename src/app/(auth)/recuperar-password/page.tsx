'use client';

/**
 * Página de recuperar contraseña
 * Flujo: email → código llega al correo → nueva contraseña
 *
 * Paso 1: ingresa email → Cognito envía código
 * Paso 2: ingresa código + nueva contraseña → confirmación
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

type Step = 'email' | 'codigo';

export default function RecuperarPasswordPage() {
  const router  = useRouter();
  const [step,     setStep]     = useState<Step>('email');
  const [email,    setEmail]    = useState('');
  const [code,     setCode]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  // Paso 1 — solicitar código
  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep('codigo');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar el código';
      if (msg.includes('UserNotFoundException') || msg.includes('not found')) {
        setError('No existe una cuenta con ese email.');
      } else if (msg.includes('LimitExceeded')) {
        setError('Demasiados intentos. Espera unos minutos.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Paso 2 — confirmar nueva contraseña
  const handleConfirmarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres con mayúscula, número y símbolo.');
      return;
    }
    setLoading(true);
    try {
      await confirmResetPassword({
        username:        email,
        confirmationCode: code,
        newPassword:     password,
      });
      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      if (msg.includes('CodeMismatchException')) {
        setError('El código es incorrecto. Verifica el email.');
      } else if (msg.includes('ExpiredCodeException')) {
        setError('El código expiró. Solicita uno nuevo.');
      } else if (msg.includes('InvalidPasswordException')) {
        setError('La contraseña no cumple los requisitos (mayúscula, número y símbolo).');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-8 pb-6 text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <KeyRound className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="font-bold text-lg">¡Contraseña actualizada!</h2>
          <p className="text-sm text-muted-foreground">
            Redirigiendo al login...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {step === 'email' ? 'Recuperar contraseña' : 'Nueva contraseña'}
        </CardTitle>
        <CardDescription>
          {step === 'email'
            ? 'Ingresa tu email y te enviaremos un código'
            : `Código enviado a ${email}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleSolicitarCodigo} noValidate className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email" type="email" className="pl-10"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required autoFocus
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading || !email}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Enviando...</span>
                : 'Enviar código'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="flex items-center justify-center gap-1 hover:text-foreground">
                <ArrowLeft className="h-3 w-3" /> Volver al login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleConfirmarPassword} noValidate className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="code" className="text-sm font-medium">Código de verificación</label>
              <Input
                id="code" type="text" inputMode="numeric"
                placeholder="123456" maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest"
                required autoFocus
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Nueva contraseña</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres con mayúscula, número y símbolo</p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading || code.length < 6 || !password}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Guardando...</span>
                : 'Cambiar contraseña'}
            </Button>

            <button
              type="button"
              onClick={() => { setStep('email'); setCode(''); setError(null); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              ← Volver a ingresar email
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
