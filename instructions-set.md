
## TASK 0 — PROJECT AUDIT

Inspect this repository and produce a concise report. Do not change,
create, delete, rename, or refactor any code.

Report:
1. Tech stack and major dependencies.
2. Folder structure overview.
3. Authentication approach.
4. Database/schema approach.
5. Existing onboarding flow and related files.
6. Existing matchmaking logic and related files.
7. Existing user dashboard and related files.
8. Existing admin dashboard and related files.
9. Existing image-upload handling, if any.
10. Existing public/private visibility or privacy fields, if any.
11. Environment variables required.
12. Development, build, lint, and test commands.

Also identify:
- Components, utilities, hooks, services, and API routes that can be
  reused for onboarding, image upload, matchmaking, and dashboard work.
- Any broken imports, missing files, or build blockers.

End with a recommended implementation order for:
1. Onboarding improvements
2. Matchmaking action
3. User dashboard improvement

Do not implement anything yet.

## TASK 1 — ONBOARDING FLOW

Before implementation:
1. Locate the existing onboarding pages, forms, components, validation
   logic, upload handling, user/profile schema, and API endpoints.
2. List all reusable files and functions.
3. Propose the implementation plan:
    - Existing files to modify
    - Existing components to reuse
    - New files required, with justification
    - Exact schema fields to add or change
4. Wait for approval before writing code.

Implementation requirements:
- Build a smooth multi-step onboarding experience.
- Reuse existing form, input, button, upload, and layout components
  wherever available.
- Allow customers to fill out profile details progressively.
- Support image upload.
- Add a public/private visibility toggle for the uploaded image.
- Persist the visibility preference in the appropriate existing schema or
  model.
- Preserve entered data when moving between steps.
- Validate required fields before progression.
- Show clear loading, error, and success states.
- Redirect completed users to their existing dashboard.

Constraints:
- Do not rebuild the onboarding system if it can be improved.
- Do not introduce a new form library, state library, or upload service
  unless the current one cannot handle the requirement.
- Do not alter unrelated pages or admin functionality.

## TASK 2 — MATCHMAKING ACTION

Activate/complete the matchmaking action.

Requirements:
- Use the existing matchmaking logic; do not rewrite it unless broken.
- Ensure matchmaking only runs for users with completed onboarding.
- Add clear loading, success, and failure states.
- Store or expose the matchmaking result in the user dashboard.
- Prevent duplicate or repeated matchmaking actions where appropriate.

Constraints:
- Do not alter the matching algorithm unless it is non-functional.
- Do not change admin functionality.

## TASK 3 — USER DASHBOARD IMPROVEMENT

Improve the existing user dashboard without rebuilding the app.

Requirements:
- Clear hierarchy: profile status, matchmaking status, next action.
- Show onboarding completion state.
- Show whether the profile image is public or private.
- Provide obvious primary actions:
    - Complete onboarding
    - Run/update matchmaking
    - View/edit profile
- Improve spacing, typography, and mobile layout.
- Remove visual clutter.

Constraints:
- Do not introduce a new state-management library.
- Do not create a new routing structure.
- Reuse existing components and styling approach.

## TASK 4 — HANDOVER PREPARATION

1. Update README with:
    - Project overview
    - Setup steps
    - Environment variables
    - Run/build/deploy instructions
    - Feature summary
2. Ensure no secrets, API keys, or credentials are committed.
3. Run final build.
4. Produce a short client-facing changelog.