export interface AppConfig {
  features: {
    catalog: boolean;
    orders: boolean;
    chat: boolean;
    availabilityRequests: boolean;
  };
  theme: {
    primaryColor?: string;
  };
  pagination: {
    defaultSize: number;
  };
}

export const DEFAULT_CONFIG: AppConfig = {
  features: {
    catalog: true,
    orders: true,
    chat: true,
    availabilityRequests: true,
  },
  theme: {
    primaryColor: "#6366f1",
  },
  pagination: {
    defaultSize: 20,
  },
};

export const DEFAULT_PRIMARY_COLOR = "#6366f1";
