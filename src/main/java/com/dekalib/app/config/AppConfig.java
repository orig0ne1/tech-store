package com.dekalib.app.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
    @Bean
    public CorsConfig corsConfig(AppProperties appProperties) {
        return new CorsConfig(appProperties.getFrontendUrl());
    }
}
