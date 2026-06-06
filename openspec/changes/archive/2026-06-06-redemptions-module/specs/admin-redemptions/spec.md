## ADDED Requirements

### Requirement: Admin List Redemptions
The system SHALL allow an admin to list redemptions with optional filters for status and user.

#### Scenario: Admin filters redemptions by status
- **WHEN** admin requests the list of redemptions with status "pending"
- **THEN** system returns a paginated list of all pending redemptions sorted by creation date

### Requirement: Admin Approve Redemption
The system SHALL allow an admin to approve a pending redemption.

#### Scenario: Successful approval
- **WHEN** admin approves a pending redemption
- **THEN** system updates redemption status to "approved", sets reviewed_by and reviewed_at, increments the reward's "stock_used", and sends a "redemption_approved" notification to the member

### Requirement: Admin Reject Redemption
The system SHALL allow an admin to reject a pending redemption, requiring a reason, and the system must refund the points.

#### Scenario: Successful rejection
- **WHEN** admin rejects a pending redemption providing a rejection_reason
- **THEN** system updates status to "rejected", sets reviewed_by and reviewed_at, refunds the points via a "redemption_refund" point_transaction, restores member points_balance, and sends a "redemption_rejected" notification
