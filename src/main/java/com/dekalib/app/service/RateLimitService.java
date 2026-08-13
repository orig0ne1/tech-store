package com.dekalib.app.service;

import com.dekalib.app.config.AppProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RateLimitService {
    private static final DefaultRedisScript<Long> FIXED_WINDOW_SCRIPT = new DefaultRedisScript<>(
            """
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then
                redis.call('EXPIRE', KEYS[1], ARGV[1])
            end
            return current
            """,
            Long.class
    );

    private final StringRedisTemplate redisTemplate;
    private final AppProperties appProperties;

    public RateLimitService(StringRedisTemplate redisTemplate, AppProperties appProperties) {
        this.redisTemplate = redisTemplate;
        this.appProperties = appProperties;
    }

    public Result check(String clientIp) {
        AppProperties.RateLimit config = appProperties.getRateLimit();
        if (!config.isEnabled()) {
            return new Result(true, 0, 0);
        }
        String key = rateLimitKey(clientIp);
        Long current = redisTemplate.execute(
                FIXED_WINDOW_SCRIPT,
                List.of(key),
                String.valueOf(config.getWindowSeconds())
        );
        int used = current == null ? 0 : current.intValue();
        int remaining = Math.max(0, config.getCapacity() - used);
        Long ttl = redisTemplate.getExpire(key);
        int retryAfter = ttl == null || ttl <= 0 ? config.getWindowSeconds() : ttl.intValue();
        return new Result(used <= config.getCapacity(), remaining, retryAfter);
    }

    private String rateLimitKey(String clientIp) {
        return "ratelimit:" + clientIp;
    }

    public record Result(boolean allowed, int remaining, int retryAfterSeconds) {}
}
