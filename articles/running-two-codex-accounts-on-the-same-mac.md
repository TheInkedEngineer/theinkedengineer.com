---
title: 'Running Two Codex Accounts on the Same Mac'
date: '2026-09-10'
description: 'I wanted my company API account and personal OpenAI account running side by side. I kept the app on work, made the CLI personal by default, and added an explicit command for using either account from the terminal.'
is_hidden: false
---

# Running Two Codex Accounts on the Same Mac

I use the Codex app with my company's API key for work. But sometimes I just want to try something: explore an idea, test a prompt, or see whether an approach is worth pursuing. I wanted to use my personal OpenAI account for those experiments without burning through my monthly company API budget.

Ideally, I would have both accounts available in the Codex app and choose whichever one made sense for the task. As of writing this on September 10, 2026, I couldn't find a supported way to keep both accounts running side by side in the app. Signing out of one account and into the other every time I wanted to experiment wasn't the workflow I had in mind.

So I settled on a compromise: keep the Codex app connected to my company API account, and use the Codex CLI with my personal ChatGPT login. Work stays in the app. Personal experiments happen in the terminal, using the access and limits of my personal account.

That gave me a place for each account. The next step was making sure the two clients actually kept their logins separate. Here is how I set it up.

## Two Clients, One Shared Home

The catch is that using two different clients does not automatically give you two separate account environments. By default, the app and CLI can both use `~/.codex`, so a terminal login can change the authentication available to the app.

Codex uses the `CODEX_HOME` environment variable to locate its configuration and local state. When the variable is not set, it defaults to `~/.codex`. This home is also involved in resolving stored authentication.

Sharing it is convenient when Desktop and CLI should use the same account and configuration. In my case, I wanted two independent environments:

```text
Codex Desktop → ~/.codex          → Company API account
Codex CLI     → ~/.codex-personal → Personal ChatGPT account
```

I kept the app on the default home and gave the personal CLI its own directory. This made the distinction explicit without requiring another installation of the binary.

## Keeping Work in the App and Experiments in the Terminal

### Leave the Company Account on the Default Home

My company account was the one I wanted to keep in the app, so I left it using `~/.codex`. If the API key is already configured there, this part is done. Otherwise, authenticate from the terminal with `CODEX_HOME` unset for that command:

```bash
printf '%s' "$OPENAI_API_KEY" | env -u CODEX_HOME codex login --with-api-key
```

This assumes `OPENAI_API_KEY` already contains the key for the intended API account. Then check the authentication mode for the default home:

```bash
env -u CODEX_HOME codex login status
```

The status should indicate an API-key login. Using `env -u CODEX_HOME` makes the target explicit, even if the current shell has a different Codex home configured.

### Give the Personal CLI Its Own Home

Next, I gave my personal account its own home. This is the directory the terminal will use for my experiments:

```bash
mkdir -p "$HOME/.codex-personal"
CODEX_HOME="$HOME/.codex-personal" command codex login
```

Sign in with the personal ChatGPT account, then verify that environment:

```bash
CODEX_HOME="$HOME/.codex-personal" command codex login status
```

This time, the status should indicate a ChatGPT login. Each home now has its own authentication setup, and I can use the terminal without repeatedly changing the credentials used by Desktop.

## Making the Personal Account the Terminal Default

With both logins in place, I wanted starting a personal experiment to be as simple as typing `codex`. Passing `CODEX_HOME` every time would have added another detail to remember. On macOS with `zsh`, I added this function to `~/.zshrc`:

```bash
codex() {
    CODEX_HOME="$HOME/.codex-personal" command codex "$@"
}
```

Reload the shell configuration to make it available:

```bash
source ~/.zshrc
```

The function sets the personal home for the command it launches. `command codex` calls the executable without invoking the function again, and `"$@"` forwards the arguments. Everyday commands continue to work as expected:

```bash
codex
codex login status
codex exec "explain this project"
codex --help
```

I chose this approach because I wanted the setting to apply specifically to terminal invocations of `codex`. Globally exporting `CODEX_HOME` would also affect other processes that inherit that environment, which makes it less clear which home a client will use.

## Using the App Account from the Terminal

Making the personal account the terminal default introduced one small inconvenience: an ordinary `codex exec` now always uses my personal account. Occasionally, I still want to run a non-interactive command with the company account used by the app.

I added a second function to `~/.zshrc` for that:

```bash
codex-app() {
    CODEX_HOME="$HOME/.codex" command codex "$@"
}
```

After reloading the shell configuration:

```bash
source ~/.zshrc
```

I can choose the account through the command name:

```bash
# Personal ChatGPT account
codex exec "explain this project"

# Company API account used by the app
codex-app exec "explain this project"
```

The name describes which account environment the command uses. `codex-app` does not open or control the desktop app; it runs the CLI with the same `~/.codex` home used by the app.

The distinction is now:

```text
codex     → ~/.codex-personal → Personal ChatGPT account
codex-app → ~/.codex          → Company API account
```

This gives me access to both accounts from scripts and terminal workflows while keeping the shorter `codex` command assigned to personal experiments.

## What the Separate Home Changes

The separation extends beyond authentication. Each home can hold its own `config.toml`, sessions, history, and home-scoped customizations such as skills and prompts.

That gives me room to configure the CLI for personal projects independently of Desktop. It also means I need to set up any home-specific configuration I want in both environments deliberately; creating a new home does not bring those settings across automatically.

For authentication, I use a separate login flow in each home instead of copying `auth.json` between directories. This keeps the account choice explicit and avoids relying on duplicated credentials as the basis of the setup.

## Checking Which Environment Is Active

If the account looks wrong, I start by checking both commands:

```bash
# Company API account used by Desktop
codex-app login status

# Personal ChatGPT account
codex login status
```

If I need to bypass the shell functions while debugging, I check both homes directly:

```bash
# Default home used by Desktop
env -u CODEX_HOME codex login status

# Personal CLI home
CODEX_HOME="$HOME/.codex-personal" command codex login status
```

These commands bypass both shell functions and select the intended environment explicitly. For this setup, I expect an API-key login in the default home and a ChatGPT login in the personal home. The authentication mode is a useful first check, though it does not by itself distinguish between two accounts using the same login method.

One detail is easy to miss: printing `$CODEX_HOME` in the shell does not show the value applied inside either wrapper. Each function sets it only for the process it launches. To inspect both wrappers in `zsh`, use:

```bash
functions codex codex-app
```

## What This Means for My Budget

The reason I wanted this separation in the first place was to choose where my usage went. In the app, I use the company API key and its associated API budget. In the terminal, I use my personal ChatGPT account and the Codex access available through that account.

My personal account still has its own usage limits. The benefit is that a personal experiment no longer needs to draw from my company API budget just because that is the account I have open for work.

## The Compromise I Can Live With

I would still prefer to have both accounts available inside the Codex app. For now, this setup gives me a practical way to keep them available side by side on the same Mac.

I open the app for company work. When I want to try an idea on my personal account, I open a terminal and type `codex`. If I need the company account in a terminal workflow, including through `codex exec`, I use `codex-app`. Two home directories and two small shell functions make the account choice explicit without requiring another installation of Codex.

## References

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540)
- [Codex configuration source](https://github.com/openai/codex/blob/main/codex-rs/core/src/config/mod.rs)
- [Codex CLI login implementation](https://github.com/openai/codex/blob/main/codex-rs/cli/src/login.rs)
- [Codex authentication storage implementation](https://github.com/openai/codex/blob/main/codex-rs/login/src/auth/manager.rs)
