import { ModulePage } from '@/components/ModulePage';

export const metadata = { title: 'Insurance' };

export default function InsurancePage() {
  return (
    <ModulePage
      moduleKey="insuranceModule"
      title="Insurance"
      description="Compare health, life, motor, and travel insurance plans from top providers. Get the best coverage at lowest premiums with expert guidance and easy claim support."
    />
  );
}
