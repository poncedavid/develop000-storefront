/**
 * Configuración de AWS Amplify v6 para el storefront
 * Solo Auth (Cognito) — sin Storage ni Analytics
 */
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId:       process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
};
