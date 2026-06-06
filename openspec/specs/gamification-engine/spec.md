# gamification-engine Specification

## Purpose
TBD - created by archiving change gamification-module. Update Purpose after archive.
## Requirements
### Requirement: Streak Bonus Calculation
The system MUST calculate a point multiplier based on the user's current consecutive days (streak) completing all tasks. The multipliers are: 3–6 days (+10%), 7–13 days (+25%), 14–29 days (+50%), and 30+ days (+100%).

#### Scenario: User has less than 3 days streak
- **WHEN** calculating the streak bonus for a user with a streak of 2
- **THEN** the system returns a multiplier of 1.0 (no bonus)

#### Scenario: User has a 7 days streak
- **WHEN** calculating the streak bonus for a user with a streak of 7
- **THEN** the system returns a multiplier of 1.25

### Requirement: Level Calculation
The system MUST assign a level to a user based on their total earned points. The thresholds are: Bronze (0–499), Prata (500–1999), Ouro (2000–4999), and Diamante (5000+).

#### Scenario: User earns enough points to reach Prata
- **WHEN** a user reaches 500 total earned points
- **THEN** the system calculates the level as 'Prata'

### Requirement: Level Up Processing
The system MUST detect when a user's calculated level is higher than their current stored level, update the user's profile with the new level, and trigger a 'level_up' notification.

#### Scenario: User ascends to Ouro
- **WHEN** the `checkAndUpdateLevel` is called and the user's calculated level is Ouro while their stored level is Prata
- **THEN** the system updates the user's level to Ouro AND creates a 'level_up' notification for the user

### Requirement: Streak Management
The system MUST provide capabilities to increment the user's current streak (and update longest streak if applicable) and to reset the current streak to 0.

#### Scenario: Incrementing streak breaks longest streak record
- **WHEN** the user's current streak is incremented to 15 and their longest streak was 14
- **THEN** both the current streak and longest streak are updated to 15 in the user profile

#### Scenario: Resetting streak
- **WHEN** the user's streak is reset
- **THEN** the current streak is updated to 0 and the longest streak remains unchanged

