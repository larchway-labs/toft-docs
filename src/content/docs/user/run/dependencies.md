---
title: Dependencies and policy
description: How Toft checks your app's packages against advisories, and what to do when a deploy is refused.
---

The **Dependencies** tab lists the packages your app installs (npm, PyPI, Go, CRAN) and any advisories that match. It appears only when your administrator has turned on a dependency policy.

:::caution[Not a security review]
It reads package names and versions, not your code. It won't find a bug you wrote or a secret you committed.
:::

The top line shows the mode (**Blocking** or **Warning only**), the advisory data's age, the serving deployment, and the last check. **Check again** re-runs the check without redeploying.

## What a policy can do

In blocking mode, a policy refuses a **deploy** above a severity (optionally only when a fix exists) and, separately, for malicious packages. A restart is not a deploy, and stale advisory data never blocks.

One setting, off by default, goes further: a background check **locks and stops** an app whose serving deployment has a malicious package, or a critical or high advisory if set that way. Waived findings never lock, and **Check again** never locks. An unlock alone is undone by the next check; the way out is a fixed deploy or a waiver. See [When an app is locked](../locked/).

## When your deploy is refused

The app page shows **Your last deploy was refused**; the build log names the package, version and advisory.

1. **Upgrade the package.** Usually the whole fix.
2. **Ask for a waiver.** Only an administrator grants one, and it expires.
3. **Argue it doesn't apply**, if you don't use the vulnerable code. Take it to your administrator.

## SBOM

Each successful deployment has **Download SBOM** in its **⋯** menu on the **Deployments** tab: a CycloneDX 1.6 file listing the packages that release installed. Where Toft could not read everything, the file says **incomplete** or **unknown** rather than complete. That happens, for example, with an app locked with pnpm or Yarn, an app with no lockfile, or vendored code. The deploy's warnings name what was missed. Downloading the same release twice gives the same file.

API: `GET /api/v1/apps/{id}/deployments/{deploymentID}/sbom`. A personal API key or a deploy key can read it.

## When there's no verdict

| Message | Means |
|---|---|
| **This app declares no dependencies** | A static site with no manifest. |
| **This app's packages cannot be listed** | An R app with no `renv.lock`. Commit one (`renv::snapshot()`). |
| **This deployment's packages haven't been recorded** | The next deploy will record them. |
| **Nothing found, but coverage is thin** | CRAN advisory data is sparse, so silence means little. |
| **Nothing has been checked yet** | No advisory data has loaded on this install, so an empty list is not a clean result. The deploy's warnings say so too. Ask your administrator to refresh it. |
