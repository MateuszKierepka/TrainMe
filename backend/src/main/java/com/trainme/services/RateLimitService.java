package com.trainme.services;

import com.trainme.exceptions.TooManyRequestsException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    private static final Duration CLEANUP_WINDOW = Duration.ofMinutes(30);

    public void check(String key, int maxRequests, Duration window, String errorMessage) {
        Instant now = Instant.now();
        Instant windowStart = now.minus(window);

        boolean[] rateLimited = {false};

        requestLog.compute(key, (k, deque) -> {
            if (deque == null) deque = new ConcurrentLinkedDeque<>();
            while (!deque.isEmpty() && deque.peekFirst().isBefore(windowStart)) {
                deque.pollFirst();
            }
            if (deque.size() >= maxRequests) {
                rateLimited[0] = true;
                return deque;
            }
            deque.addLast(now);
            return deque;
        });

        if (rateLimited[0]) {
            throw new TooManyRequestsException(errorMessage);
        }
    }

    @Scheduled(cron = "0 */30 * * * *")
    public void cleanupStaleEntries() {
        Instant cutoff = Instant.now().minus(CLEANUP_WINDOW);
        requestLog.entrySet().removeIf(entry -> {
            Deque<Instant> deque = entry.getValue();
            return deque.isEmpty() || deque.peekLast().isBefore(cutoff);
        });
    }
}
