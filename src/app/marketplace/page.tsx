import { redirect } from "next/navigation";

export default function MarketplaceRedirectPage() {
  // Returns to the homepage marketplace section.
  redirect("/#marketplace");
}

