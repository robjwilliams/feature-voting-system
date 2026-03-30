import { FeatureForm } from '@/components/FeatureForm';

export const metadata = {
  title: 'Submit Feature — Feature Voting',
};

export default function NewFeaturePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Submit a Feature Request</h1>
      <FeatureForm />
    </div>
  );
}
