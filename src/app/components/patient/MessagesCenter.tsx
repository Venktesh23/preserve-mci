import MessagesCenter from '../MessagesCenter';

function PatientMessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <main className="max-w-7xl mx-auto w-full p-6 lg:p-8">{children}</main>
    </div>
  );
}

export default function PatientMessagesCenter() {
  return (
    <MessagesCenter
      dashboardPath="/patient/dashboard"
      layoutComponent={PatientMessagesLayout}
      viewMode="notifications"
      pageTitle="Notifications"
    />
  );
}