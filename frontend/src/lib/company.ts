import client from "./api";
import type { Company, CompanyContacts } from "@/types/company";

export async function getCompany(): Promise<Company> {
  const { data } = await client.get<Company>("/company");
  return data;
}

export async function getCompanyContacts(): Promise<CompanyContacts> {
  const { data } = await client.get<CompanyContacts>("/company/contacts");
  return data;
}
