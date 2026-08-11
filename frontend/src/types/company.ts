export interface WorkingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface CompanyContacts {
  email: string;
  phone: string;
  address: string;
  workingHours: WorkingHours;
}

export interface CompanySocials {
  telegram?: string;
  vk?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  logo: string;
  contacts: CompanyContacts;
  socials: CompanySocials;
}
