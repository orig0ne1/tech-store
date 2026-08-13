package com.dekalib.app.config;

import com.dekalib.app.service.RateLimitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.DispatcherType;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
    @Bean
    public CorsConfig corsConfig(AppProperties appProperties) {
        return new CorsConfig(appProperties.getFrontendUrl());
    }

    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilter(
            RateLimitService rateLimitService, ObjectMapper objectMapper, AppProperties appProperties) {
        FilterRegistrationBean<RateLimitFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new RateLimitFilter(
                rateLimitService, objectMapper, appProperties.getRateLimit().getCapacity()));
        registration.addUrlPatterns("/api/*");
        registration.setDispatcherTypes(DispatcherType.REQUEST);
        registration.setOrder(10);
        return registration;
    }
}
