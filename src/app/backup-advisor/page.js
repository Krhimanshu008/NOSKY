import BackupAdvisorInline from '@/components/ui/BackupAdvisorInline';

export const metadata = {
  title: 'Intelligent Backup Advisor',
  description: 'Get a personalized cloud backup strategy engineered from the software you actually use. Free, no signup, one minute.',
};

export default function BackupAdvisorPage() {
  return (
    <div className="min-h-screen bg-[#05070a] pt-20">
      <BackupAdvisorInline />
    </div>
  );
}
