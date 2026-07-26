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

  const brandHeader = `
    <div style="background:#0E0E0E;padding:20px 28px;border-radius:12px 12px 0 0">
      <span style="font-family:Arial,sans-serif;font-weight:700;font-size:18px;color:#fff">SM <span style="color:#E20613">Publicidad</span></span>
    </div>`;
  const wrap = (bodyHtml) => `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
      ${brandHeader}
      <div style="padding:28px;color:#222;font-size:15px;line-height:1.6">${bodyHtml}</div>
      <div style="padding:16px 28px;background:#fafafa;color:#999;font-size:12px;border-top:1px solid #eee">
        SM Publicidad · Bogotá, Colombia · <a href="https://www.smpublicidad.com.co" style="color:#E20613">smpublicidad.com.co</a>
      </div>
    </div>`;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: process.env.ZOHO_USER,
      replyTo: correo,
      subject: `Nuevo contacto web — ${safeNombre} (${safeServicio})`,
      text: `Nombre: ${safeNombre}\nCorreo: ${correo}\nServicio: ${safeServicio}\n\nMensaje:\n${safeMensaje || '(sin mensaje)'}`,
      html: wrap(`
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">Nueva solicitud de cotización</h2>
        <p style="margin:0 0 10px"><strong>Nombre:</strong> ${escapeHtml(safeNombre)}</p>
        <p style="margin:0 0 10px"><strong>Correo:</strong> ${escapeHtml(correo)}</p>
        <p style="margin:0 0 10px"><strong>Servicio:</strong> ${escapeHtml(safeServicio)}</p>
        <p style="margin:16px 0 6px"><strong>Mensaje:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(safeMensaje || '(sin mensaje)')}</p>
      `),
    });

    await transporter.sendMail({
      from: fromAddress,
      to: correo,
      subject: `Recibimos tu mensaje, ${safeNombre} — SM Publicidad`,
      text: `Hola ${safeNombre},\n\nGracias por escribirnos. Ya recibimos tu solicitud sobre "${safeServicio}" y te contactaremos en menos de 24 horas con una propuesta.\n\nSi necesitas algo urgente, escríbenos por WhatsApp al +57 300 555 1234.\n\n— Equipo SM Publicidad\nhttps://www.smpublicidad.com.co`,
      html: wrap(`
        <p style="margin:0 0 14px">Hola ${escapeHtml(safeNombre)},</p>
        <p style="margin:0 0 14px">Gracias por escribirnos. Ya recibimos tu solicitud sobre <strong>${escapeHtml(safeServicio)}</strong> y te contactaremos en <strong>menos de 24 horas</strong> con una propuesta.</p>
        <p style="margin:0 0 14px">Si necesitas algo urgente, escríbenos por WhatsApp al <strong>+57 300 555 1234</strong>.</p>
        <p style="margin:0;color:#555">— Equipo SM Publicidad</p>
      `),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact form send error:', err);
    res.status(502).json({ error: 'No se pudo enviar el mensaje. Intenta de nuevo en un momento.' });
  }
};
