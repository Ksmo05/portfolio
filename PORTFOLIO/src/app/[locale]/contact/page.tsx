import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function LocalizedContactRedirect({ params }: Props) {
  const { locale } = await params;
  const target = isLocale(locale) ? locale : "en";
  redirect(`/${target}/professional-profile`);
}
