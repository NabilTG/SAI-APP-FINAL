import { EmailTemplate } from '@/components/emails/email-template';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombreDestino,
      idSolicitud,
      estadoSolicitud,
      correos, // puede ser un string o un array
    } = body;

    if (!nombreDestino || !idSolicitud || !estadoSolicitud || !correos) {
      return Response.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    const destinatarios = Array.isArray(correos) ? correos : [correos];

    const { data, error } = await resend.emails.send({
      from: 'Notificación Movimiento <admin@saiappcr.online>',
      to: destinatarios,
      subject: 'SAI APP - Notificación de Movimiento',
      react: EmailTemplate({
        firstName: nombreDestino,
        idSolicitud,
        estadoSolicitud,
      }) as React.ReactElement,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return Response.json({ error }, { status: 500 });
    }

    console.log('Correo enviado:', data);
    return Response.json({ data });
  } catch (error) {
    console.error('Error en el servidor:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
