import { EmailService } from 'domain/ports/EmailService';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'domain/entities/User';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeEmailService implements EmailService {
  constructor(
    private readonly emailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetPasswordEmail(token: string, user: User): Promise<void> {
    const messageSuite = `<p>Attention, ce lien n’est valide que pendant 24 heures.</p><p>Si vous n’avez pas demandé ce changement ou que vous rencontrez des problèmes de connexion à votre espace, veuillez-nous en informer en <b>écrivant à</b> <a href=mailto:info@bornerecharge.fr">info@bornerecharge.fr</a> ou au 0 8000 75014.</p>

    <p>L’équipe de BRS</p>

    <i>Ce message vous a été envoyé sur votre demande en tant que client de la société Borne Recharge Service et conformément à notre politique de confidentialité.<br>Borne Recharge Service – 18 bis Rue Molitor – 75 016 Paris</p>`;

    let message;

    const resetUrl = `${this.configService.get(
      'RESET_PASSWORD_URL',
    )}?token=${token}`;

    message = `<p>Bonjour Madame, Monsieur  ${user.givenName},</p>Vous souhaitez créer ou modifier votre mot de passe afin d’accéder à votre espace client Borne Recharge Service. Veuillez cliquer sur le lien ci-dessous afin de réinitialiser votre mot de passe.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>${messageSuite}`;

    await this.emailService.sendMail({
      to: user.email,
      from: this.configService.get('EMAIL_FROM'),
      subject: 'Renouvellement de votre mot de passe - Borne Recharge',
      html: message,
    });
  }
}
