import MessagesCenter from '../MessagesCenter';
import CarePartnerLayout from './CarePartnerLayout';

export default function CarePartnerMessagesCenter() {
  return (
    <MessagesCenter
      dashboardPath="/care-partner/dashboard"
      layoutComponent={CarePartnerLayout}
    />
  );
}
