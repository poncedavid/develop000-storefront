'use client';

/**
 * Página de callback OAuth para MeLi (solo uso en desarrollo).
 * MeLi redirige aquí después de que el usuario autoriza la app.
 * La URL llega como: /callback?code=TG-XXX&state=YYY
 *
 * Esta página captura el code y lo muestra para que el admin
 * lo use en el intercambio manual por tokens.
 */
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackContent() {
  const params = useSearchParams();
  const code   = params.get('code');
  const error  = params.get('error');
  const state  = params.get('state');

  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.iconError}>✗</div>
        <h1 style={styles.title}>Autorización rechazada</h1>
        <p style={styles.subtitle}>{error}</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div style={styles.card}>
        <div style={styles.iconWarn}>?</div>
        <h1 style={styles.title}>Sin code en la URL</h1>
        <p style={styles.subtitle}>Esta página espera un parámetro <code>code</code> de MeLi.</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.iconOk}>✓</div>
      <h1 style={styles.title}>¡Autorización exitosa!</h1>
      <p style={styles.subtitle}>Copia el código de abajo y pásalo a Kiro:</p>

      <div style={styles.codeBox}>
        <p style={styles.codeLabel}>Authorization Code</p>
        <code style={styles.code}>{code}</code>
        <button
          style={styles.copyBtn}
          onClick={() => {
            navigator.clipboard.writeText(code);
            alert('¡Copiado!');
          }}
        >
          Copiar
        </button>
      </div>

      {state && (
        <p style={styles.state}>state: <code>{state}</code></p>
      )}

      <p style={styles.warning}>
        ⚠️ Este código expira en ~10 minutos. Úsalo de inmediato.
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div style={styles.page}>
      <Suspense fallback={<p style={{ color: '#666' }}>Cargando...</p>}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight:      '100vh',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     '#f9fafb',
    fontFamily:     'system-ui, sans-serif',
    padding:        '24px',
  },
  card: {
    background:   '#fff',
    borderRadius: '16px',
    padding:      '48px 40px',
    maxWidth:     '520px',
    width:        '100%',
    boxShadow:    '0 4px 24px rgba(0,0,0,.08)',
    textAlign:    'center',
  },
  iconOk: {
    width:        '64px',
    height:       '64px',
    borderRadius: '50%',
    background:   '#dcfce7',
    color:        '#16a34a',
    fontSize:     '32px',
    lineHeight:   '64px',
    margin:       '0 auto 24px',
  },
  iconError: {
    width:        '64px',
    height:       '64px',
    borderRadius: '50%',
    background:   '#fee2e2',
    color:        '#dc2626',
    fontSize:     '32px',
    lineHeight:   '64px',
    margin:       '0 auto 24px',
  },
  iconWarn: {
    width:        '64px',
    height:       '64px',
    borderRadius: '50%',
    background:   '#fef9c3',
    color:        '#ca8a04',
    fontSize:     '32px',
    lineHeight:   '64px',
    margin:       '0 auto 24px',
  },
  title: {
    fontSize:    '1.5rem',
    fontWeight:  700,
    color:       '#111',
    margin:      '0 0 8px',
  },
  subtitle: {
    color:  '#6b7280',
    margin: '0 0 32px',
  },
  codeBox: {
    background:   '#f3f4f6',
    borderRadius: '12px',
    padding:      '20px',
    margin:       '0 0 16px',
    textAlign:    'left',
  },
  codeLabel: {
    fontSize:     '11px',
    fontWeight:   700,
    textTransform:'uppercase',
    letterSpacing:'.06em',
    color:        '#9ca3af',
    margin:       '0 0 8px',
  },
  code: {
    display:      'block',
    fontSize:     '13px',
    color:        '#111',
    wordBreak:    'break-all',
    marginBottom: '12px',
    lineHeight:   1.5,
  },
  copyBtn: {
    background:   '#2563eb',
    color:        '#fff',
    border:       'none',
    borderRadius: '8px',
    padding:      '8px 20px',
    fontSize:     '14px',
    fontWeight:   600,
    cursor:       'pointer',
    width:        '100%',
  },
  state: {
    fontSize: '12px',
    color:    '#9ca3af',
    margin:   '0 0 16px',
  },
  warning: {
    fontSize:     '13px',
    color:        '#d97706',
    background:   '#fffbeb',
    padding:      '12px 16px',
    borderRadius: '8px',
    margin:       '0',
  },
};
