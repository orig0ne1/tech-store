package com.dekalib.app.config;

import com.dekalib.app.service.RateLimitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

public class RateLimitFilter extends OncePerRequestFilter {
    private static final String HEADER_LIMIT = "X-RateLimit-Limit";
    private static final String HEADER_REMAINING = "X-RateLimit-Remaining";
    private static final String HEADER_RETRY_AFTER = "Retry-After";
    private static final String CLIENT_IP_ATTRIBUTE = "X-Forwarded-For";

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;
    private final int capacity;

    public RateLimitFilter(RateLimitService rateLimitService, ObjectMapper objectMapper, int capacity) {
        this.rateLimitService = rateLimitService;
        this.objectMapper = objectMapper;
        this.capacity = capacity;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        RateLimitService.Result result = rateLimitService.check(resolveClientIp(request));
        if (result.allowed()) {
            response.setHeader(HEADER_LIMIT, String.valueOf(capacity));
            response.setHeader(HEADER_REMAINING, String.valueOf(result.remaining()));
            filterChain.doFilter(request, response);
            return;
        }
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(HEADER_RETRY_AFTER, String.valueOf(result.retryAfterSeconds()));
        response.setHeader(HEADER_LIMIT, String.valueOf(capacity));
        response.setHeader(HEADER_REMAINING, "0");
        objectMapper.writeValue(response.getWriter(), new com.dekalib.app.dto.response.ErrorResponse(
                Instant.now(),
                HttpStatus.TOO_MANY_REQUESTS.value(),
                "RATE_LIMIT_EXCEEDED",
                "Too many requests. Please retry later.",
                request.getRequestURI()
        ));
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader(CLIENT_IP_ATTRIBUTE);
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
