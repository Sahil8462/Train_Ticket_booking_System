package com.trainbooking.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSwapRequestEmail(String toEmail,
                                     String requesterName,
                                     String seatInfo,
                                     String acceptUrl,
                                     String rejectUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Seat Swap Request");
            helper.setFrom("sahilkumo97@gmail.com");

            String html = """
                    <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Seat Swap Request</h2>
                        <p>Hello,</p>
                        <p><b>%s</b> has requested to swap seat with you.</p>
                        <p><b>Seat Details:</b> %s</p>
                        <p>Please choose an option below:</p>

                        <a href="%s"
                           style="background:#28a745;color:white;padding:10px 18px;
                                  text-decoration:none;border-radius:6px;display:inline-block;margin-right:10px;">
                           Accept
                        </a>

                        <a href="%s"
                           style="background:#dc3545;color:white;padding:10px 18px;
                                  text-decoration:none;border-radius:6px;display:inline-block;">
                           Reject
                        </a>

                        <p style="margin-top:20px;">This link will expire in 30 minutes.</p>
                    </body>
                    </html>
                    """.formatted(requesterName, seatInfo, acceptUrl, rejectUrl);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send swap request email: " + e.getMessage(), e);
        }
    }
}