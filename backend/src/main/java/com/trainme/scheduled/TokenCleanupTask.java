package com.trainme.scheduled;

import com.trainme.entities.User;
import com.trainme.repositories.TrainerProfileRepository;
import com.trainme.repositories.UserOAuthAccountRepository;
import com.trainme.repositories.UserRepository;
import com.trainme.repositories.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupTask {

    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final UserOAuthAccountRepository userOAuthAccountRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();

        int deletedVerification = verificationTokenRepository.deleteAllExpiredBefore(now);
        if (deletedVerification > 0) {
            log.info("Usunięto {} wygasłych tokenów weryfikacyjnych", deletedVerification);
        }
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void deleteGhostUsers() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(2);
        List<User> ghostUsers = userRepository.findUnverifiedUsersCreatedBefore(cutoff);

        if (ghostUsers.isEmpty()) {
            return;
        }

        userOAuthAccountRepository.deleteByUserIn(ghostUsers);
        verificationTokenRepository.deleteByUserIn(ghostUsers);
        trainerProfileRepository.deleteByUserIn(ghostUsers);
        userRepository.deleteAllInBulk(ghostUsers);

        log.info("Usunięto {} niezweryfikowanych kont (ghost users)", ghostUsers.size());
    }
}
