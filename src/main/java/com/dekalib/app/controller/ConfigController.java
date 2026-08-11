package com.dekalib.app.controller;

import com.dekalib.app.dto.response.AppConfigResponse;
import com.dekalib.app.service.AppConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/config")
public class ConfigController {
    private final AppConfigService appConfigService;

    @Autowired
    public ConfigController(AppConfigService appConfigService) {
        this.appConfigService = appConfigService;
    }

    @GetMapping
    public AppConfigResponse getConfig() {
        return appConfigService.getConfig();
    }
}
