# Release process

The card is in its initial beta. Preserve heading-aware markers when changing providers or rendering.

- Batch the day's intended changes before publishing user-facing updates. Routine commits and validation runs are not releases.
- Prepare the final build, focused checks, and exact release notes before requesting approval.
- Show the release version and full proposed release notes to the owner. Wait for explicit approval before creating or publishing the release or advancing a user-facing release tag.
- After approval, publish the tested commit with those approved notes. Verify the remote tag, release and installed build match.
- Do not publish automatically from push events. HACS users receive updates from published releases; their release notes must explain behavior, setup requirements and material limitations.

HACS default-catalog submission requires passing HACS validation without ignored checks, followed by a new release. Prepare the catalog PR, but submit only after that release is approved and published. Never claim catalog acceptance before the upstream PR is merged.
