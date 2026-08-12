package com.dekalib.app.dto.response;

public record AppConfigResponse(
        Features features,
        Theme theme,
        Pagination pagination
) {
    public record Features(
            boolean catalog,
            boolean orders,
            boolean availabilityRequests
    ) {}

    public record Theme(
            String primaryColor
    ) {}

    public record Pagination(
            int defaultSize
    ) {}
}
