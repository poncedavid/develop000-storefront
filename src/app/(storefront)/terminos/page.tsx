export const revalidate = false;

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de develop000',
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: septiembre 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones de uso. Si no está de acuerdo con alguno de estos términos, por favor no utilice este sitio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">2. Uso del sitio</h2>
          <p>
            Este sitio web es operado por develop000. El contenido de este sitio es solo para su información general y uso personal. Está sujeto a cambios sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">3. Productos y precios</h2>
          <p>
            Nos reservamos el derecho de modificar precios en cualquier momento sin previo aviso. Los precios mostrados incluyen IVA cuando corresponda. En caso de error en el precio de un producto, nos reservamos el derecho de cancelar el pedido y notificar al cliente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">4. Pedidos y pagos</h2>
          <p>
            Al realizar un pedido, usted confirma que tiene al menos 18 años de edad y que la información proporcionada es exacta y completa. El pedido se considera aceptado una vez procesado el pago.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">5. Propiedad intelectual</h2>
          <p>
            Todo el contenido de este sitio (textos, imágenes, logotipos, íconos) es propiedad de develop000 o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. Su reproducción no autorizada está prohibida.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">6. Limitación de responsabilidad</h2>
          <p>
            develop000 no será responsable de ningún daño indirecto, incidental o consecuente que resulte del uso o la incapacidad de usar este sitio o los productos adquiridos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de revisar estos términos en cualquier momento. Al continuar utilizando el sitio después de cualquier cambio, usted acepta los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">8. Contacto</h2>
          <p>
            Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en contacto@develop000.cl.
          </p>
        </section>
      </div>
    </div>
  );
}
