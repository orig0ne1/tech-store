package com.dekalib.app.dto.response;

public record CompanySocialsResponse(
        String telegram,
        String vk,
        String instagram,
        String youtube,
        String website
) {}
