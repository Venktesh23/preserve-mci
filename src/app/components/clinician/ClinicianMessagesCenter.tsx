import MessagesCenter from '../MessagesCenter';
import ClinicianLayout from './ClinicianLayout';

export default function ClinicianMessagesCenter() {
  return (
    <MessagesCenter
      dashboardPath="/clinician/dashboard"
      layoutComponent={ClinicianLayout}
    />
  );
}
