package com.trainme.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String baseUrl;
    private final String mailFrom;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.base-url}") String baseUrl,
            @Value("${spring.mail.username}") String mailFrom
    ) {
        this.mailSender = mailSender;
        this.baseUrl = baseUrl;
        this.mailFrom = mailFrom;
    }

    @Async
    public void sendVerificationEmail(String to, String token) {
        String link = baseUrl + "/verify-email?token=" + token;
        String subject = "TrainMe — Potwierdź swój adres e-mail";
        String body = """
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Witaj w TrainMe!</h2>
                    <p>Kliknij poniższy przycisk, aby potwierdzić swój adres e-mail:</p>
                    <a href="%s" style="display: inline-block; padding: 12px 24px;
                       background-color: #111827; color: #ffffff; text-decoration: none;
                       border-radius: 8px; font-weight: 600;">
                        Potwierdź e-mail
                    </a>
                    <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
                        Jeśli nie zakładałeś konta w TrainMe, zignoruj tę wiadomość.
                    </p>
                </div>
                """.formatted(link);

        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String link = baseUrl + "/reset-password?token=" + token;
        String subject = "TrainMe — Reset hasła";
        String body = """
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset hasła</h2>
                    <p>Kliknij poniższy przycisk, aby ustawić nowe hasło:</p>
                    <a href="%s" style="display: inline-block; padding: 12px 24px;
                       background-color: #111827; color: #ffffff; text-decoration: none;
                       border-radius: 8px; font-weight: 600;">
                        Resetuj hasło
                    </a>
                    <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
                        Link jest ważny przez 15 minut. Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.
                    </p>
                </div>
                """.formatted(link);

        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Nie udało się wysłać e-maila", e);
        }
    }
}
