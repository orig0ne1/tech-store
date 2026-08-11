package com.dekalib.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;
    private String description;
    private String logo;

    @Embedded
    private CompanyContacts contacts;

    @Embedded
    private CompanySocials socials;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public CompanyContacts getContacts() {
        return contacts;
    }

    public void setContacts(CompanyContacts contacts) {
        this.contacts = contacts;
    }

    public CompanySocials getSocials() {
        return socials;
    }

    public void setSocials(CompanySocials socials) {
        this.socials = socials;
    }
}
