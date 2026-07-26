const nodemailer = require('nodemailer');

const SERVICE_OPTIONS = new Set([
  'Desarrollo web con IA',
  'Logos & Branding',
  'Impresión & Publicidad',
  'Marketing digital & BTL',
  'Souvenirs & Promocionales',
  'Fotografía',
]);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { nombre, correo, servicio, mensaje } = req.body || {};

  if (!nombre || typeof nombre !== 'string' || !correo || typeof correo !== 'string') {
    res.status(400).json({ error: 'Nombre y correo son requeridos.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    res.status(400).json({ error: 'Correo inválido.' });
    return;
  }

  const safeServicio = SERVICE_OPTIONS.has(servicio) ? servicio : 'Desarrollo web con IA';
  const safeMensaje = typeof mensaje === 'string' ? mensaje.slice(0, 4000) : '';
  const safeNombre = nombre.slice(0, 200);

  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  const fromAddress = `"SM Publicidad" <${process.env.ZOHO_USER}>`;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: process.env.ZOHO_USER,
      replyTo: correo,
      subject: `Nueva solicitud: ${safeServicio} — ${safeNombre}`,
      text: `Nombre: ${safeNombre}\nCorreo: ${correo}\nServicio: ${safeServicio}\n\nMensaje:\n${safeMensaje || '(sin mensaje)'}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(safeNombre)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(correo)}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(safeServicio)}</p>
        <p><strong>Mensaje:</strong><br>${escapeHtml(safeMensaje || '(sin mensaje)').replace(/\n/g, '<br>')}</p>
      `,
    });

    await transporter.sendMail({
      from: fromAddress,
      to: correo,
      subject: 'Hemos recibido tu mensaje — SM Publicidad',
      text: `Hola ${safeNombre},\n\nGracias por escribirnos. Ya recibimos tu solicitud sobre "${safeServicio}" y te contactaremos en menos de 24 horas con una propuesta.\n\nSi necesitas algo urgente, escríbenos por WhatsApp al +57 300 555 1234.\n\n— Equipo SM Publicidad\nhttps://www.smpublicidad.com.co`,
      html: `
        <p>Hola ${escapeHtml(safeNombre)},</p>
        <p>Gracias por escribirnos. Ya recibimos tu solicitud sobre <strong>${escapeHtml(safeServicio)}</strong> y te contactaremos en menos de 24 horas con una propuesta.</p>
        <p>Si necesitas algo urgente, escríbenos por WhatsApp al <strong>+57 300 555 1234</strong>.</p>
        <p>— Equipo SM Publicidad<br><a href="https://www.smpublicidad.com.co">www.smpublicidad.com.co</a></p>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact form send error:', err);
    res.status(502).json({ error: 'No se pudo enviar el mensaje. Intenta de nuevo en un momento.' });
  }
};
