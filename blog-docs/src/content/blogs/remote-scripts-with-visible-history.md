---
title: "Remote Scripts Need a Visible Execution History"
pubDate: "2026-10-19"
author: "PulseTask Team"
tags: ["SSH", "Automation", "Operations"]
draft: false
---

Saved scripts turn common operational work into a repeatable action. PulseTask pairs that convenience with an explicit execution record, so a command is never just a button click that disappears.

## From a saved script to a run

A script belongs to a team and has a title, unique slug, and shell content. When a member triggers it on a server, PulseTask creates a `ScriptRun` in `pending` state and hands it to a queue worker.

The worker then changes the run to `running`, opens an SSH connection with phpseclib, and executes the saved content using the server's configured SSH user and private key. Successful zero-exit commands finish as `success`; a non-zero exit or an engine failure is recorded as `failed`.

The run keeps output, error output, timestamps, the initiating user, the script, and the target server. That makes it possible to answer practical questions later: what ran, where, who started it, and what did the remote host return?

## Built for both the dashboard and terminal

The same capability is available through a CLI-oriented API. A personal access token can queue a script by its slug and a server by its IP address, then poll a run ID for its result. This makes a small deployment or maintenance workflow possible without reimplementing SSH logic in every local tool.

## Power deserves boundaries

PulseTask does not sandbox script content. The command runs with the permissions of the configured SSH account, and the current worker allows a 300-second execution window. We recommend dedicated, least-privilege SSH users, restricted keys, and careful review of every script before it is saved.

Execution records are pruned after 30 days, so teams that need a longer audit trail should export or archive the information they need.
