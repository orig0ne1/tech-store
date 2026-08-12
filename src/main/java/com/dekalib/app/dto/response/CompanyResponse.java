package com.dekalib.app.dto.response;

import java.util.List;

public record CompanyResponse(
        long id,
        String name,
        String description,
        String logo,
        Double latitude,
        Double longitude,
        List<String> photos,
        CompanyContactsResponse contacts,
        CompanySocialsResponse socials
) {}
