/**
 * API Route: POST /api/contacto
 * Recibe los datos del formulario de contacto y envía un email via SES
 *
 * No usa el backend de AppSync — llama a SES directamente desde el servidor Next.js
 * Las credenciales de AWS vienen de las env vars de Amplify (mismo rol que el servidor)
 */

import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

const FROM_EMAIL = process.env.SES_FROM_EMAIL ?? 'ponceriveradavid@icloud.com';
const TO_EMAIL   = process.env.CONTACT_TO_EMAIL ?? 'ponceriveradavid@icloud.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, mensaje } = body;

    // Validación básica
    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      );
    }

    // Validar email básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido.' },
        { status: 400 }
      );
    }

    await ses.send(new SendEmailCommand({
      Source:      FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      ReplyToAddresses: [email],   // responder directamente al remitente
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data:    `[Contacto develop000] Mensaje de ${nombre}`,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <h2>Nuevo mensaje de contacto</h2>
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Mensaje:</strong></p>
              <p style="background:#f4f4f4;padding:16px;border-radius:8px;">${mensaje.replace(/\n/g, '<br/>')}</p>
            `,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Nuevo mensaje de contacto\n\nNombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
          },
        },
      },
    }));

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('[api/contacto] Error al enviar email:', error);
    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
