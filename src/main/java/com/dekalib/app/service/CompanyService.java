package com.dekalib.app.service;

import com.dekalib.app.dto.response.CompanyContactsResponse;
import com.dekalib.app.dto.response.CompanyResponse;
import com.dekalib.app.dto.response.CompanySocialsResponse;
import com.dekalib.app.dto.response.WorkingHoursResponse;
import com.dekalib.app.entity.Company;
import com.dekalib.app.entity.CompanyContacts;
import com.dekalib.app.entity.CompanySocials;
import com.dekalib.app.entity.WorkingHours;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyResponse getCompany() {
        return toCompanyResponse(getCompanyEntity());
    }

    public CompanyContactsResponse getContacts() {
        Company company = getCompanyEntity();
        return toContactsResponse(company.getContacts());
    }

    private Company getCompanyEntity() {
        return companyRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("COMPANY_NOT_FOUND", "Company not found"));
    }

    private CompanyResponse toCompanyResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getLogo(),
                company.getLatitude(),
                company.getLongitude(),
                company.getPhotos(),
                toContactsResponse(company.getContacts()),
                toSocialsResponse(company.getSocials())
        );
    }

    private CompanyContactsResponse toContactsResponse(CompanyContacts contacts) {
        if (contacts == null) {
            return null;
        }
        WorkingHours hours = contacts.getWorkingHours();
        WorkingHoursResponse hoursResponse = hours == null
                ? null
                : new WorkingHoursResponse(
                        hours.getMonday(),
                        hours.getTuesday(),
                        hours.getWednesday(),
                        hours.getThursday(),
                        hours.getFriday(),
                        hours.getSaturday(),
                        hours.getSunday()
                );
        return new CompanyContactsResponse(
                contacts.getEmail(),
                contacts.getPhone(),
                contacts.getAddress(),
                hoursResponse
        );
    }

    private CompanySocialsResponse toSocialsResponse(CompanySocials socials) {
        if (socials == null) {
            return null;
        }
        return new CompanySocialsResponse(
                socials.getTelegram(),
                socials.getVk(),
                socials.getInstagram(),
                socials.getYoutube(),
                socials.getWebsite()
        );
    }
}
