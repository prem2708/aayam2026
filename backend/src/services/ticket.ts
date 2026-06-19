import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { env } from '../config/env';

export async function generateQrBuffer(data: string): Promise<Buffer> {
  return QRCode.toBuffer(data, { type: 'png', width: 200, margin: 1 });
}

export async function generateTicketPdf(params: {
  eventTitle: string;
  userName: string;
  college: string;
  qrToken: string;
  eventDate: string;
  venue?: string;
  userEmail?: string;
  userPhone?: string;
  userBranch?: string;
  teamName?: string;
  teamMembers?: string[];
  category?: string;
  registrationNo?: string;
}): Promise<Buffer> {
  const verifyUrl = `${env.ticketBaseUrl}/${params.qrToken}`;
  const qrBuffer = await generateQrBuffer(verifyUrl);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A5', layout: 'landscape', margin: 15, autoPageBreak: false } as any);
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const w = doc.page.width;
    const h = doc.page.height;

    // 1. Dark background
    doc.rect(0, 0, w, h).fill('#0d1527');

    // 2. Double border lines (sleek card framing)
    doc.rect(12, 12, w - 24, h - 24).strokeColor('#1e293b').lineWidth(1).stroke();
    doc.rect(16, 16, w - 32, h - 32).strokeColor('#334155').lineWidth(2).stroke();

    // 3. Category Badge Color
    const badgeColors: Record<string, string> = {
      technical: '#4f46e5',
      cultural: '#db2777',
      gaming: '#9333ea',
      workshop: '#ea580c',
      hackathon: '#0891b2',
    };
    const cat = params.category?.toLowerCase() || 'technical';
    const categoryColor = badgeColors[cat] || '#4f46e5';

    // --- LEFT COLUMN ---
    // Brand header
    doc.fillColor('#ffffff')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('AAYAM TECH FEST 2026', 35, 35);

    doc.fillColor('#94a3b8')
      .fontSize(8)
      .font('Helvetica')
      .text('OFFICIAL EVENT ENTRY TICKET', 35, 60, { characterSpacing: 0.5 });

    // Category Badge
    const catName = (params.category || 'TECHNICAL').toUpperCase();
    doc.rect(35, 78, 90, 18).fill(categoryColor);
    doc.fillColor('#ffffff')
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(catName, 35, 83, { width: 90, align: 'center' });

    // Event Title
    doc.fillColor('#ffffff')
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(params.eventTitle, 35, 110, { width: 330 });

    // Event Date & Venue
    doc.fillColor('#94a3b8')
      .fontSize(8)
      .font('Helvetica')
      .text(`DATE: ${params.eventDate}`, 35, 132)
      .text(`VENUE: ${params.venue || 'TBA'}`, 35, 145);

    // Separator line
    doc.strokeColor('#1e293b')
      .lineWidth(1)
      .moveTo(35, 165)
      .lineTo(330, 165)
      .stroke();

    // Participant Details
    const detailsY = 178;
    doc.fillColor('#ffffff')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(params.userName, 35, detailsY);

    doc.fillColor('#94a3b8')
      .fontSize(8)
      .font('Helvetica')
      .text(`College: ${params.college}`, 35, detailsY + 18)
      .text(`Email: ${params.userEmail || 'N/A'}`, 35, detailsY + 30);

    let offset = 42;
    if (params.userPhone) {
      doc.text(`Phone: ${params.userPhone}`, 35, detailsY + offset);
      offset += 12;
    }
    if (params.userBranch) {
      doc.text(`Branch: ${params.userBranch}`, 35, detailsY + offset);
      offset += 12;
    }

    // Team details (if any)
    if (params.teamName) {
      doc.strokeColor('#1e293b')
        .lineWidth(1)
        .moveTo(35, detailsY + offset + 6)
        .lineTo(330, detailsY + offset + 6)
        .stroke();

      doc.fillColor('#06b6d4')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(`Team: ${params.teamName}`, 35, detailsY + offset + 14);

      if (params.teamMembers && params.teamMembers.length > 0) {
        doc.fillColor('#94a3b8')
          .fontSize(7)
          .font('Helvetica')
          .text(`Members: ${params.teamMembers.join(', ')}`, 35, detailsY + offset + 24, { width: 295 });
      }
    }

    // --- RIGHT COLUMN ---
    const rightColX = 390;
    const regNo = params.registrationNo || `TF26-${params.qrToken.substring(0, 6).toUpperCase()}`;

    // Registration Number on top right
    doc.fillColor('#10b981')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`REG NO: ${regNo}`, rightColX, 35, { width: 170, align: 'right' });

    // White QR Code Card
    const cardW = 150;
    const cardH = 150;
    const cardX = w - cardW - 35; // 595 - 150 - 35 = 410
    const cardY = 70;
    doc.rect(cardX, cardY, cardW, cardH).fill('#ffffff');

    // QR Image centered on the card
    const qrSize = 136;
    doc.image(qrBuffer, cardX + (cardW - qrSize) / 2, cardY + (cardH - qrSize) / 2, { width: qrSize });

    // Sub-QR Texts
    doc.fillColor('#94a3b8')
      .fontSize(8)
      .font('Helvetica')
      .text(`Reg No: ${regNo}`, cardX, cardY + cardH + 8, { width: cardW, align: 'center' });

    doc.fillColor('#64748b')
      .fontSize(6)
      .font('Helvetica')
      .text(`Registration ID: ${regNo}`, cardX - 10, cardY + cardH + 20, { width: cardW + 20, align: 'center' });

    doc.fillColor('#475569')
      .fontSize(6)
      .font('Helvetica')
      .text('Valid for one scan check-in only. Do not duplicate.', cardX - 10, cardY + cardH + 34, { width: cardW + 20, align: 'center' });

    doc.end();
  });
}
