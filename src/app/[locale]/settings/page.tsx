import { TLocale } from "@/types/index";
import { setRequestLocale } from "next-intl/server";
import SettingsClient from "./client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <SettingsClient locale={locale as TLocale} />;
}
