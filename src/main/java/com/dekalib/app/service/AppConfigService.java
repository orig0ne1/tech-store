package com.dekalib.app.service;

import com.dekalib.app.config.AppProperties;
import com.dekalib.app.dto.response.AppConfigResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppConfigService {
    private final AppProperties appProperties;

    @Autowired
    public AppConfigService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public AppConfigResponse getConfig() {
        AppProperties.Features features = appProperties.getFeatures();
        AppProperties.Theme theme = appProperties.getTheme();
        AppProperties.Pagination pagination = appProperties.getPagination();

        return new AppConfigResponse(
                new AppConfigResponse.Features(
                        features.isCatalog(),
                        features.isOrders(),
                        features.isChat(),
                        features.isAvailabilityRequests()
                ),
                new AppConfigResponse.Theme(theme.getPrimaryColor()),
                new AppConfigResponse.Pagination(pagination.getDefaultSize())
        );
    }
}
