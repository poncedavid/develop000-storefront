/**
 * POST /api/newsletter
 *
 * Registra un suscriptor en DynamoDB via AppSync GraphQL.
 * Guarda como entidad SUSCRIPTOR con el email como identificador único.
 *
 * Body: { email: string }
 * Response: { message: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { COMPANY_ID } from '@/lib/config';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY!;

const CREAR_SUSCRIPTOR = /* GraphQL */ `
  mutation CrearSuscriptor($input: CatalogoInput!) {
    crearSuscriptor(input: $input) {
      statusCode
      message
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = (body?.email as string)?.trim().toLowerCase();

    // Validación básica en el servidor
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Email inválido.' }, { status: 400 });
    }

    // Llamada al backend vía AppSync con API Key
    const res = await fetch(GRAPHQL_URL, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    API_KEY,
      },
      body: JSON.stringify({
        query:     CREAR_SUSCRIPTOR,
        variables: {
          input: {
            companyId: COMPANY_ID,
            email,
            nombre: email.split('@')[0], // nombre placeholder
          },
        },
      }),
      // No cacheamos esta llamada — es una mutación
      cache: 'no-store',
    });

    const json = await res.json();

    // Error a nivel de AppSync
    if (json.errors?.length) {
      console.error('[newsletter] GraphQL error:', json.errors);
      return NextResponse.json(
        { message: 'No se pudo completar la suscripción.' },
        { status: 500 }
      );
    }

    const result = json.data?.crearSuscriptor;

    // Backend retorna statusCode 409 si el email ya existe
    if (result?.statusCode === 409) {
      return NextResponse.json({ message: 'Este email ya está suscrito.' }, { status: 409 });
    }

    if (result?.statusCode !== 200) {
      return NextResponse.json(
        { message: result?.message || 'Error al suscribir.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Suscripción exitosa.' });
  } catch (error) {
    console.error('[newsletter] Error:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}
