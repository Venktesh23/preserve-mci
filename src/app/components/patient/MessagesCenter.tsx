import MessagesCenter from '../MessagesCenter';
import PatientLayout from './PatientLayout';

export default function PatientMessagesCenter() {
  return (
    <MessagesCenter
      dashboardPath="/patient/dashboard"
      layoutComponent={PatientLayout}
    />
  );
}