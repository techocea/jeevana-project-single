## Delivery phases

## Basic
-full_name
-gender
-dob
-marital_status
-living_status
-religion
-caste
-monther_tongue
-created_by
-country

## Education
-edu_qualification
-edu_detail
-occupation
-annual_income
-employed_in

## Physical attributes
-height
-weight
-complexion
-body_type
-blood_group
-diet
-smoking
-drinking

## About you
-narration
-hobbies (no need cards just strings and then convert to tags)

## Partner preferences
-religion
-caste
-age
-height
-complexion
-education
-expectations
-country
-residential_status

### Phase 1 — Onboarding
- Multi-step onboarding form.
- Image upload.
- Public/private visibility toggle stored in the user/profile schema.
- Validation, error states, and progress saving.

### Phase 2 — Matchmaking action
- Wire up the existing matchmaking logic.
- Ensure it only runs for complete profiles.
- Add clear success/failure feedback.

### Phase 3 — User dashboard
- Redesign information hierarchy.
- Show profile completeness, matchmaking status, and next actions.
- Keep it simple; avoid a second architecture change.

### Phase 4 — Handover
- Update README.
- Verify deployment.
- Prepare client walkthrough.

## Definition of done
- Feature works on desktop and mobile.
- No console errors.
- Build passes.
- Changes are committed and pushed.
- Client can understand the feature without explanation.