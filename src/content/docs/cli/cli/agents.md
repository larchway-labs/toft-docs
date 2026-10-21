---
title: Skills for coding agents
description: Two skills that let a coding agent deploy and write Toft apps on its own — what they cover and how to install them.
---

Toft publishes two **agent skills**: the instructions a coding agent loads before
it touches Toft. They live beside the client, in
[`larchway-labs/toft-cli`](https://github.com/larchway-labs/toft-cli), and are
updated with every `toft` release.

| Skill | Load it to | Source |
|---|---|---|
| **toft-cli** | Ship an app: sign in without a browser, the deploy loop, exit codes and `--json` shapes, jobs and tasks, what `toft` refuses and why | [SKILL.md](https://github.com/larchway-labs/toft-cli/blob/main/skills/toft-cli/SKILL.md) |
| **toft-sdk** | Write the app: `PORT`, `HOST` and `BASE_PATH`, how the build detects a framework, `toft.toml`, and the SDK for Python, Node, R and Go | [SKILL.md](https://github.com/larchway-labs/toft-cli/blob/main/skills/toft-sdk/SKILL.md) |

## Install them

`toft` carries both skills, matched to the commands that binary has. For Claude
Code, write each into its skills folder:

```bash
for s in toft-cli toft-sdk; do
  mkdir -p ~/.claude/skills/$s
  toft skill $s > ~/.claude/skills/$s/SKILL.md
done
```

`toft skill` with no name lists them. It needs no sign-in. Run the loop again
after upgrading `toft`.

To fetch them without `toft` installed, download them from the repository:

```bash
for s in toft-cli toft-sdk; do
  mkdir -p ~/.claude/skills/$s
  curl -fsSL -o ~/.claude/skills/$s/SKILL.md \
    https://raw.githubusercontent.com/larchway-labs/toft-cli/main/skills/$s/SKILL.md
done
```

Any other agent that reads markdown instructions can load the same two files.
A copy from the repository describes the latest release, which may be newer
than your `toft`; `toft skill` is the copy that matches.

## Give the agent a key, not a browser

`toft login` opens a browser and waits for a person. An agent signs in with a
key instead:

```bash
printf '%s' "$TOFT_KEY" | toft login --token-stdin https://toft.example.com
```

Use a personal key (`toftu_`, **Your account → Credentials**) for an agent
working on your behalf, or a deploy key (`toftd_`, **Admin → Deploy keys**) for
one running unattended. See [Signing in](../signing-in/).

Have the agent run `toft whoami` first. It says what the key may do and what the
install allows, so the agent learns its limits before trying a deploy.

## What an agent gets back

- `toft check` says whether a deploy would be refused, without one.
- `toft deploy --verify /path` fails unless the page answers.
- `toft fetch /path` shows what the app returns, with the body capped at 8 KB
  so a large page does not flood the agent's context.
- Flags go anywhere on the line, so an agent does not have to reorder a
  command it composed.
- With `--json`, every refusal carries `code`, `retryable` and often a `hint`.
  An agent should retry only when `retryable` is true, and pass the `hint` on
  to a person when the next step is theirs. See
  [Errors as JSON](../exit-codes/#errors-as-json).

:::tip
No local runtime is needed to deploy. The install builds the app, so an agent
with `toft` and a key can create an app, push a directory, read the build log
and roll back without Node, Python or Go on its machine.
:::
