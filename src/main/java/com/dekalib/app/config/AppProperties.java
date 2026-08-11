package com.dekalib.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String frontendUrl;
    private Features features = new Features();
    private Theme theme = new Theme();
    private Pagination pagination = new Pagination();

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    public Features getFeatures() {
        return features;
    }

    public void setFeatures(Features features) {
        this.features = features;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(Pagination pagination) {
        this.pagination = pagination;
    }

    public static class Features {
        private boolean catalog = true;
        private boolean orders = true;
        private boolean chat = true;
        private boolean availabilityRequests = true;

        public boolean isCatalog() {
            return catalog;
        }

        public void setCatalog(boolean catalog) {
            this.catalog = catalog;
        }

        public boolean isOrders() {
            return orders;
        }

        public void setOrders(boolean orders) {
            this.orders = orders;
        }

        public boolean isChat() {
            return chat;
        }

        public void setChat(boolean chat) {
            this.chat = chat;
        }

        public boolean isAvailabilityRequests() {
            return availabilityRequests;
        }

        public void setAvailabilityRequests(boolean availabilityRequests) {
            this.availabilityRequests = availabilityRequests;
        }
    }

    public static class Theme {
        private String primaryColor = "#6366f1";

        public String getPrimaryColor() {
            return primaryColor;
        }

        public void setPrimaryColor(String primaryColor) {
            this.primaryColor = primaryColor;
        }
    }

    public static class Pagination {
        private int defaultSize = 20;

        public int getDefaultSize() {
            return defaultSize;
        }

        public void setDefaultSize(int defaultSize) {
            this.defaultSize = defaultSize;
        }
    }
}
