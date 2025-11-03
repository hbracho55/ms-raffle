import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Cambia esto por tu servidor SMTP
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: 'info.bramensolutions@gmail.com', // Tu correo electrónico
        pass: 'itshxaknqldpeorx', // Tu contraseña
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: '"BRAMEN - Rifa" <info.bramensolutions@gmail.com>', // Cambia esto por tu correo
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
