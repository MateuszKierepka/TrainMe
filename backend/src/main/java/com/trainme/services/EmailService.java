package com.trainme.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String baseUrl;
    private final String mailFrom;

    public EmailService(
            JavaMailSender mailSender,
            TemplateEngine templateEngine,
            @Value("${app.base-url}") String baseUrl,
            @Value("${spring.mail.username}") String mailFrom
    ) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.baseUrl = baseUrl;
        this.mailFrom = mailFrom;
    }

    @Async
    public void sendVerificationEmail(String to, String firstName, String token) {
        String link = baseUrl + "/verify-email?token=" + token;

        Context context = new Context();
        context.setVariable("firstName", firstName);
        context.setVariable("link", link);

        String html = templateEngine.process("email/verify-email", context);
        sendHtmlEmail(to, "Potwierdź adres e-mail powiązany z Twoim kontem TrainMe", html);
    }

    @Async
    public void sendPasswordResetEmail(String to, String firstName, String token) {
        String link = baseUrl + "/reset-password?token=" + token;

        Context context = new Context();
        context.setVariable("firstName", firstName);
        context.setVariable("link", link);

        String html = templateEngine.process("email/reset-password", context);
        sendHtmlEmail(to, "Próba zresetowania hasła dla Twojego konta TrainMe", html);
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
            log.error("Nie udało się wysłać e-maila do {}", to, e);
        }
    }
}
