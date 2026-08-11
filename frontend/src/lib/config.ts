import client from "./api";
import type { AppConfig } from "@/types/config";

export async function getConfig(): Promise<AppConfig> {
  const { data } = await client.get<AppConfig>("/config");
  return data;
}
