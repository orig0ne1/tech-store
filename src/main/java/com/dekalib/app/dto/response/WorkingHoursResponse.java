package com.dekalib.app.dto.response;

public record WorkingHoursResponse(
        String monday,
        String tuesday,
        String wednesday,
        String thursday,
        String friday,
        String saturday,
        String sunday
) {}
