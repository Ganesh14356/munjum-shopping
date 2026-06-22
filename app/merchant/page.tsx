import { ModulePage } from '@/components/ModulePage';

export const metadata = { title: 'Merchant Partner Program' };

export default function MerchantPage() {
  return (
    <ModulePage
      moduleKey="merchantModule"
      title="Merchant"
      description="Join Munjum's merchant network. List your products, manage inventory and orders, set up a storefront, and reach millions of customers. Our platform handles payments, logistics, and marketing so you can focus on growing your business."
    />
  );
}
