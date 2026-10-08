# Release process

The card is in its initial beta. Preserve heading-aware markers when changing providers or rendering.

- Batch the day's intended changes before publishing user-facing updates. Routine commits and validation runs are not releases.
- Prepare the final build, focused checks, and exact release notes before requesting approval.
- Show the release version and full proposed release notes to the owner. Wait for explicit approval before creating or publishing the release or advancing a user-facing release tag.
- After approval, publish the tested commit with those approved notes. Verify the remote tag, release and installed build match.
- Do not publish automatically from push events. HACS users receive updates from published releases; their release notes must explain behavior, setup requirements and material limitations.

HACS default-catalog submission requires passing HACS validation without ignored checks, followed by a new release. Prepare the catalog PR, but submit only after that release is approved and published. Never claim catalog acceptance before the upstream PR is merged.

## Release Note Style

- Use Title Case for every section title: capitalize the first letter of every word.
- Place one relevant, distinct emoji before each section heading; keep the main version/title free of emoji.
- Follow the main title with a short release summary. An exclamation mark is welcome for a significant feature announcement.
- Use short paragraphs and parallel bullets. Keep headings visually close to their content and more space between sections; actual typography and spacing follow GitHub/HA rendering.
- Use clear screenshots with synthetic locations. When useful, compare light and dark maps side by side; independent vehicles should have distinct plausible speeds.
- Put a small, subdued caption immediately below the image. Use supported semantic markup such as `<sub>`; do not assume custom CSS transfers to HACS.
- Separate future plans from released changes with a horizontal rule and a `Next Priority` section. Say "the next planned large update" so smaller fixes can precede it without a date commitment.
- Review in a neutral/light-theme preview and, when possible, the actual HA renderer. Preview styling must not be presented as guaranteed renderer behavior.
