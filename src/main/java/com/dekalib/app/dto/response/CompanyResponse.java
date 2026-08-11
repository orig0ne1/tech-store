package com.dekalib.app.dto.response;

public record CompanyResponse(
        long id,
        String name,
        String description,
        String logo,
        CompanyContactsResponse contacts,
        CompanySocialsResponse socials
) {}
