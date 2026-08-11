package com.dekalib.app.controller;

import com.dekalib.app.dto.response.CompanyContactsResponse;
import com.dekalib.app.dto.response.CompanyResponse;
import com.dekalib.app.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/company")
public class CompanyController {
    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public CompanyResponse getCompany() {
        return companyService.getCompany();
    }

    @GetMapping("/contacts")
    public CompanyContactsResponse getContacts() {
        return companyService.getContacts();
    }
}
