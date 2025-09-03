import PremiumHeader from "./premium-history/PremiumHistoryHeader";
import SubscriptionDescription from "./premium-history/PremiumDescription";
import InvoiceSection from "./premium-history/PremiumInvoices";

export default function PremiumHistoryContent() {
  return (
    <>
      <PremiumHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <SubscriptionDescription />
        <InvoiceSection />
      </div>
    </>
  );
}
