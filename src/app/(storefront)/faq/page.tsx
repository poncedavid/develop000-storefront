import { Card, CardContent } from '@/components/ui/card';

export const revalidate = false;

export const metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respuestas a las preguntas más comunes sobre nuestra tienda',
};

const faqs = [
  {
    pregunta: '¿Cuánto demora el envío?',
    respuesta:
      'Los envíos dentro de la Región Metropolitana demoran entre 1 y 2 días hábiles. Para regiones, el plazo es de 3 a 5 días hábiles.',
  },
  {
    pregunta: '¿Cómo hago seguimiento de mi pedido?',
    respuesta:
      'Una vez despachado tu pedido, recibirás un correo con el número de tracking para que puedas seguir tu envío en tiempo real.',
  },
  {
    pregunta: '¿Cuáles son los métodos de pago disponibles?',
    respuesta:
      'Aceptamos tarjetas de crédito y débito (Visa, Mastercard), transferencia bancaria y pago en efectivo a través de Khipu.',
  },
  {
    pregunta: '¿Puedo devolver un producto?',
    respuesta:
      'Sí. Tienes 30 días desde la recepción del producto para solicitar una devolución. El producto debe estar en su estado original y con el embalaje intacto.',
  },
  {
    pregunta: '¿Tienen envío gratis?',
    respuesta:
      'Sí, ofrecemos envío gratis en compras iguales o superiores a $50.000. Para compras menores, el costo de envío se calcula al momento del checkout.',
  },
  {
    pregunta: '¿Cómo creo una cuenta?',
    respuesta:
      'Puedes registrarte haciendo clic en "Crear cuenta" en la parte superior de la página. Solo necesitas un correo electrónico y una contraseña.',
  },
  {
    pregunta: '¿Es seguro comprar en su sitio?',
    respuesta:
      'Sí. Tu información personal y de pago está protegida con encriptación SSL. Nunca almacenamos datos de tarjetas de crédito.',
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h1>
      <p className="text-muted-foreground mb-10">
        ¿No encuentras lo que buscas? Escríbenos a contacto@develop000.cl
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-2">{faq.pregunta}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.respuesta}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
