# member-redemptions Specification

## Purpose
TBD - created by archiving change redemptions-module. Update Purpose after archive.
## Requirements
### Requirement: Member List Redemptions
The system SHALL allow a member to view their own redemption history.

#### Scenario: Member views their history
- **WHEN** member requests their redemptions list
- **THEN** system returns a paginated list of redemptions belonging only to the member, ordered by creation date

### Requirement: Member View Redemption Details
The system SHALL allow a member to view the details of a specific redemption they own.

#### Scenario: Member views specific redemption
- **WHEN** member requests details for a specific redemption ID they own
- **THEN** system returns the full redemption details including the reward info and rejection_reason if rejected

