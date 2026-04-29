export interface OrderTrackingAlertsProps {
  showDeliveredAlert: boolean;
  showLeaveAlert: boolean;
  showCancelAlert: boolean;
  onDeliveredConfirm: () => void;
  onLeaveConfirm: () => void;
  onCancelConfirm: () => void;
  onDismissDelivered: () => void;
  onDismissLeave: () => void;
  onDismissCancel: () => void;
}
