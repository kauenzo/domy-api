# member-points Specification

## Purpose
TBD - created by archiving change points-module. Update Purpose after archive.
## Requirements
### Requirement: Member Point Summary
The system SHALL return a consolidated gamification summary for the authenticated member.

#### Scenario: Member requests their point summary
- **WHEN** member requests their points summary
- **THEN** system returns their current points_balance, current_streak, longest_streak, level, and the calculated total_earned points

### Requirement: Member Transaction History
The system SHALL allow the member to view a paginated history of their point transactions.

#### Scenario: Member requests point transaction history
- **WHEN** member requests their point history
- **THEN** system returns a paginated list of their point transactions ordered by date descending

