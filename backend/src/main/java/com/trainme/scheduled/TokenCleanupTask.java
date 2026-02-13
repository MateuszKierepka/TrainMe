package com.trainme.scheduled;

import com.trainme.repositories.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupTask {

    private final VerificationTokenRepository verificationTokenRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();

        int deletedVerification = verificationTokenRepository.deleteAllExpiredBefore(now);
        if (deletedVerification > 0) {
            log.info("Usunięto {} wygasłych tokenów weryfikacyjnych", deletedVerification);
        }
    }
}
