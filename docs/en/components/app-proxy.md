# Per-app proxy

Since manager 0.4.0, you can send chosen apps in an instance (by package name) through a proxy program on this computer, while every other app goes direct as before. For example, only the overseas server of a game goes through the proxy, and the domestic games and the system stay as they are.

- No VPN: a small program in the instance that runs as root (`modavd-proxyd`, carried by `modavd.exe` and put into the instance at boot) takes the TCP, UDP and DNS of the listed apps. Neither the apps nor the system see a VPN.
- You still run the proxy program (a Clash-style one, for example) on your computer yourself; ModAVD only sends the listed apps' traffic to it.

::: warning No proxy, no network
When the proxy program is closed or cannot be reached, the listed apps **have no network**. They never quietly fall back to direct.
:::

## What you need

- A proxy program running on your computer, best through its SOCKS5 port or mixed port (7890 and 7897 are common in Clash-style programs), so TCP, UDP and DNS all go through.
- An HTTP proxy also works, but only carries TCP and DNS: the listed apps' UDP does not work, so in-game voice and real-time matches may fail.
- `10.0.2.2` in the instance is `127.0.0.1` on this computer. The proxy program can listen on the local machine only; you do not need to turn on "allow LAN".
- The instance must be started by the manager or the `modavd` CLI to get the proxy. An emulator that another program starts directly, without modavd, does not get it.

## Setting it in the manager

1. On the instance card, click "⋯" at the bottom right, then "按应用走代理…" (per-app proxy). When the card already shows the "代理" mark, clicking the mark opens it too.
2. Turn on "名单里的应用走代理" (the listed apps use the proxy).
3. Proxy address:
   - Click "从系统代理读取" (read the system proxy) to take this computer's proxy setting (the environment variables `ALL_PROXY`, `HTTPS_PROXY`, `HTTP_PROXY`, or the proxy set by hand in Windows "Internet Options");
   - or type an address such as `socks5://127.0.0.1:7890` (the protocol can be left out) and click "检测" (probe) to see which protocol it speaks and whether UDP works.
   - `127.0.0.1` and `localhost` are stored as `10.0.2.2`, as the instance sees them; a mixed port written as `http://` is changed to `socks5://`. What was changed is shown under the probe result.
4. App list:
   - While the instance runs, the installed third-party apps and Google Play services are listed; just tick them. Games the manager knows are shown with their Chinese names.
   - While the instance is off, type package names below (such as `com.example.game`) and press Enter to add them.
   - Listed apps that are not installed in the instance yet are marked "没装" (not installed); they take effect once installed. The list holds at most 64 apps.
5. Click "保存" (save). A running instance takes it at once; a stopped one at its next boot through the manager or `modavd`.

The "现在" (now) line at the bottom of the dialog shows what the saved setting does now; it says the same as the mark on the card.

::: tip Overseas games that sign in with Google
Also list "Google Play 服务" (Google Play services, `com.google.android.gms`). When it is not in the list, the dialog says so; click "加进名单" (add to the list).
:::

To turn it off, untick "名单里的应用走代理" and save. The address and the list are kept, so you do not need to enter them again next time.

## The "代理" mark on the card {#mark}

While the setting is on and the list is not empty, the instance card shows a "代理" (proxy) mark next to its title, in both the card and the list view. Hover over it to see the details; click it to open the setting.

While the instance runs and the manager window is open, the manager asks the instance for its state about every 30 seconds, and right away after a start, a stop or a change of the setting.

| Color | Meaning |
|---|---|
| Gray | The instance is off (it shows how many apps go through which proxy from the next boot); it is starting or stopping; or the manager is asking the instance for its state |
| Green | In effect: N apps (M not installed yet) → proxy address. When the proxy does not carry UDP, "UDP 不通" (no UDP) is added |
| Yellow | Worth a look, but the listed apps most likely still work: some rules are missing and being put back; the last connection through the proxy failed, but this computer can reach the proxy; or the state could not be read this time |
| Red | The listed apps have **no network or go direct** right now: the proxy cannot be reached; the proxy program in the instance is not running; the rules cannot be put in place; or the setting was saved but did not take effect |

## The CLI

```powershell
tools\modavd.exe proxy 3                                          # show
tools\modavd.exe proxy 3 on --server auto --add com.example.game  # turn on with this computer's proxy setting
tools\modavd.exe proxy 3 --add com.google.android.gms             # add to the list
tools\modavd.exe proxy 3 test                                     # probe the proxy from this computer
tools\modavd.exe proxy 3 off                                      # turn off; the address and the list are kept
```

- Without other arguments it shows the switch, the address and the list; while the instance runs, it adds the state in the instance (whether the rules are in place, whether the proxy answers, which listed apps are not installed yet).
- `on` turns it on, `off` turns it off; `--server` changes the address, `--add` / `--remove` edit the list, `--apps` replaces it. Each can be given several times or comma-separated; `--apps ""` empties the list. They can be combined with `on`.
- `--server` takes the same addresses as the dialog; `auto` takes this computer's proxy setting. The first `on` without an address also means `auto`.
- `test` probes the configured proxy from this computer: which protocol it speaks and whether UDP works through it. A proxy that cannot be reached is exit code 9 (`proxy_unavailable`).
- The setting is stored in `mas-avd.json` under `instances.<i>.appProxy` and goes away with the instance.
- In MCP, the tools are `get_app_proxy` and `set_app_proxy`.

For every option and the `--json` output, see [the ModAVDManager README](https://github.com/ModAVD/ModAVDManager/blob/main/README.en.md#command-line).

## The HTTP API

The manager page uses a local HTTP API that listens only on `127.0.0.1`:

| Endpoint | What it does |
|---|---|
| `GET` / `PUT /api/instances/{i}/proxy` | Read or change one instance's setting; reading also gives the state in the instance and the mark |
| `GET /api/instances/{i}/packages` | List the third-party apps and Google Play services installed in the instance (it must be running) |
| `GET /api/proxy/suggest` | This computer's proxy setting, as the instance sees the address |
| `POST /api/proxy/probe` | Probe a proxy address from this computer |
| Event `proxy` | Sent when an instance's mark changes |

For the fields, error codes and how to log in, see [API.md](https://github.com/ModAVD/ModAVDManager/blob/main/internal/ui/API.md) (in Chinese).

## Common problems {#faq}

### The mark is red and says the proxy cannot be reached

- Check that the proxy program is running and the port is right: click "检测" (probe) in the dialog, or run `tools\modavd.exe proxy <number> test`.
- The listed apps have no network meanwhile; that is on purpose. Once the proxy program is back you do not need to restart the instance: the mark turns green after the next connection of a listed app succeeds, and may be yellow until then.

### The mark is yellow and says the last connection through the proxy failed

This computer can reach the proxy; only the listed app's last connection failed. Most likely the server it tried did not answer, or a rule in the proxy program blocked it. If the app works, nothing needs to be done; if it stays this way, look at the proxy program's log.

### The mark is red and says the proxy program is not running or the rules cannot be put in place

Shut the instance down and start it again with the manager or `modavd`. If it stays this way, [report a problem](../guide/feedback): collect the information while the instance runs, and the package includes the state and the log of the proxy program in the instance.

### The game still cannot connect or sign in

- Games that sign in with Google: also list Google Play services.
- Games that use UDP (voice, real-time matches): use the proxy program's SOCKS5 or mixed port, not an HTTP proxy.
- The listed apps get no IPv6; they use IPv4 only.
- An app shown as "没装" (not installed): the package name may be wrong, or the game's package name differs from what you typed. Open the dialog while the instance runs and tick it in the listed apps.

### Are apps outside the list affected?

No, they go direct as before.
