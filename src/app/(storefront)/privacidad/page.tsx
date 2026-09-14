export const revalidate = false;

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de develop000',
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: septiembre 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">1. Información que recopilamos</h2>
          <p>
            Recopilamos información que usted nos proporciona directamente, como nombre, dirección de correo electrónico, número de teléfono y dirección de envío al crear una cuenta o realizar un pedido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">2. Cómo usamos su información</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Procesar y enviar sus pedidos</li>
            <li>Enviarle confirmaciones y actualizaciones de estado de sus pedidos</li>
            <li>Responder a sus consultas y brindar soporte</li>
            <li>Mejorar nuestros servicios y experiencia de usuario</li>
            <li>Enviarte ofertas y novedades (solo si lo aceptas)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">3. Protección de datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal. Toda la comunicación entre su navegador y nuestro sitio está cifrada con SSL/TLS. Nunca almacenamos datos de tarjetas de crédito en nuestros servidores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">4. Cookies</h2>
          <p>
            Utilizamos cookies para mejorar su experiencia de navegación, recordar las preferencias del carrito y analizar el tráfico del sitio. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">5. Compartir información con terceros</h2>
          <p>
            No vendemos ni compartimos su información personal con terceros con fines comerciales. Podemos compartir datos con proveedores de servicios (como empresas de envío) estrictamente para completar su pedido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">6. Sus derechos</h2>
          <p>
            Tiene derecho a acceder, corregir o eliminar su información personal. Para ejercer estos derechos, contáctenos a contacto@develop000.cl indicando su solicitud.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">7. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta Política de Privacidad, puede escribirnos a contacto@develop000.cl.
          </p>
        </section>
      </div>
    </div>
  );
}
