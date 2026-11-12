# Live demo: break it first

The live demo for *AI That Never Leaves Your Laptop* (Sovereign Conference, Asunción, 22 Nov 2026).
DeepSeek V4.1 Flash 1017, served on our own DGX Sparks, runs in Oh My Pi (OMP) inside herdr. It audits a
tiny Bitcoin wallet key generator, proves the worst bug by recovering a real seed phrase, fixes it, and
reruns the tests. One fixed prompt, no edits.

## The planted bug

`seed/keygen.py` seeds Python's `random` with the creation time in whole seconds. `wallet.json`, which the
app treats as public, gives the creation date and a short fingerprint of the entropy. That leaves 86,400
candidate seeds, and a plain Python loop checks them all in under a second. It's the same class of bug as
the Coldcard RNG fallback (Aug 2026): the entropy looked random, but wasn't.

- Target phrase: `end engine load screen audit unfold rather drill piano spy breeze motor`
  (created 2026-01-03 18:15:05 UTC, `wallet_id` `8cab2a59`)
- Decoy finding the model may also flag: `seed.txt` is written with default permissions.
- The 4 unit tests pass before *and* after the fix; tests alone don't catch the bug, which is the point.

## Files

| File | What it is |
|---|---|
| `prompt.txt` | The one prompt used in the talk |
| `seed/` | Clean tinywallet: `keygen.py`, `test_keygen.py`, `wallet.json`, BIP39 `english.txt` |
| `reset.sh [dir]` | Fresh copy of `seed/` as a git repo in `work/` (or `dir`) |
| `run.sh` | Show time: reset, then `omp --model $OMP_MODEL "<prompt>"` in `work/` (prompt also on the clipboard on macOS) |
| `monitor.sh` | Second pane: `nvidia-smi` on one Spark via `ssh $SPARK_HOST` |
| `check.sh [dir]` | Grades a run: PoC prints the target phrase, `keygen.py` uses a CSPRNG, tests pass |
| `rehearse.sh [n]` | Runs the demo headless (`omp -p`) n times and grades each |
| `reference/poc.py` | Known-good PoC (`python3 reference/poc.py work`); never copied into `work/` |

Needs Python 3.10+ and git on the machine where OMP runs. No pip packages.

## Before the day

1. Find the model id: `omp models` and pick the DeepSeek V4.1 Flash 1017 entry on the Spark provider.
   `export OMP_MODEL=<that id>`.
2. Rehearse from the herdr host: `./rehearse.sh 10`. Aim for 10/10; note the slowest time. If a run fails,
   read `rehearsals/<n>/omp.log` and tighten `prompt.txt`, then re-run all ten.
3. Check OMP takes the prompt as its first message: `./run.sh` should start the TUI already working. If
   your build doesn't, start `omp` and paste (`run.sh` puts the prompt on the clipboard on macOS).
4. Record one clean run as the backup video, at the same font size you'll screen-share.
5. Set up the fallback model: the same prompt on Qwen 3.8-27B served on the laptop (Splash), fully offline.
   `OMP_MODEL=<local id> ./rehearse.sh 3`.

## During the talk (remote, from home)

The talk is remote, so the laptop sits on the same network as the Sparks; there's no venue Wi-Fi in the path.
What can still go wrong is the video call, not the cluster.

1. herdr already open in its own window, two panes: left `./run.sh` (not started), right `./monitor.sh`.
   Share your whole screen, not one window, so switching between the deck and herdr shows up for the room.
   Font size large enough to survive video compression on a projector. Notifications off.
2. On the demo slide, switch to herdr and press enter on `./run.sh`. Narrate while it works; the slide notes
   have the beats.
3. When it finishes, run `./check.sh` in the left pane: three green PASS lines are the punchline.
4. Switch back to the deck for the recap slide.

If the agent stalls for more than about 30 seconds, say so and switch to the fallback: the laptop model, or the
video. If the call drops mid-demo, the agent keeps running on the host under herdr; rejoin, reattach with
`herdr`, and pick up where it is.

Keep hostnames, addresses and how the cluster is reached out of this repo and off the screen.
