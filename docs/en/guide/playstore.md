# Installing the Google Play Store yourself

ModAVD runs Google's "Google APIs" Android 14 system image. It comes with Google Play services but without the Play Store. If you need to download a game from the Play Store or sign in to a Google account through the store, this page shows how to put the store from Google's official "Google Play" image into your own instance. The manager is meant to offer this as an option when you create an instance later; until then, use this page.

::: warning Read the risks first
See [Risks](#risks) at the end of this page. Use a new instance for this; don't try it first on an instance that holds game data you care about.
:::

## What gets installed

Five files are taken from Google's official `system-images;android-34;google_apis_playstore;x86_64` r14 and placed into the instance's own system overlay. That image is the same Android version and the same build cycle as the image ModAVD uses now.

| File | What it is |
|---|---|
| `/product/priv-app/Phonesky/Phonesky.apk` | The Play Store |
| `/product/priv-app/PrebuiltGmsCore/PrebuiltGmsCore.apk` | Google Play services, replaced by the copy signed with the same key as the store (same version, 23.18.18) |
| `/system_ext/priv-app/GoogleServicesFramework/GoogleServicesFramework.apk` | Google Services Framework (GSF), likewise |
| `/product/priv-app/PartnerSetupPrebuilt/PartnerSetupPrebuilt.apk` | Google Partner Setup, likewise; without it, it keeps crashing in the background |
| `/product/etc/security/fsverity/play_store_fsi_cert.der` | The store's fs-verity certificate |

The image's own license-check placeholder, `/product/app/LicenseChecker`, is also hidden: its package name is `com.android.vending` too, and it would clash with the store.

For why Play services has to be replaced as well, and why a plain `adb install` doesn't work, see [Why it is done this way](#why-it-is-done-this-way).

## Before you start

- ModAVD 0.36.0 or newer, and an instance with the arm64 execution bridge (any instance created without `--no-bridge`). Only instances with the bridge boot with a writable system, which is what lets the store in.
- About 5 GB of temporary space on the PC (1.5 GB zip, 3.1 GB `system.img`) and about 3.5 GB free on the instance's data disk for temporary files. You can delete both afterwards.
- Run the commands below in PowerShell. Change to the ModAVD folder and set three variables first; the remaining commands can then be copied as they are:

```powershell
cd D:\ModAVD        # your ModAVD folder
$i = 1              # the instance number
$dl = 'D:\gplay'    # a folder for the downloads, English letters and digits only
New-Item -ItemType Directory -Force $dl | Out-Null
```

## 1. Download the Play image and check it

```powershell
curl.exe -L -o "$dl\x86_64-34_r14.zip" https://dl.google.com/android/repository/sys-img/google_apis_playstore/x86_64-34_r14.zip
(Get-FileHash "$dl\x86_64-34_r14.zip" -Algorithm SHA1).Hash
```

- The file is 1,510,752,654 bytes and its SHA-1 must be `01D32617FD1937E540FAF8731D70CF50E35AF854`. If it isn't, delete it and download it again.
- `googledownloads.cn/android/repository/` or `mirrors.cloud.tencent.com/AndroidSDK/` in place of `dl.google.com/android/repository/` serve the same file.
- The image is covered by Google's Android Software Development Kit License Agreement, the one fetching the components shows and keeps in `downloads\android-sdk-license.txt`.

## 2. Extract system.img

```powershell
tar -xf "$dl\x86_64-34_r14.zip" -C $dl x86_64/system.img
```

This gives `$dl\x86_64\system.img`, 3,101,687,808 bytes.

## 3. Create the install script

Copy and run the whole block; it writes `playstore.sh` into `$dl`. The script runs as root inside the instance: it mounts two partitions of `system.img` read-only, checks the SHA-256 of the five files, and only then copies them into the instance.

```powershell
$sh = @'
#!/system/bin/sh
# Put the Google Play Store of Google's "Google Play" system image (android-34 x86_64 r14) into a ModAVD instance.
# Run as root in the instance:  su 0 sh /data/local/tmp/playstore/playstore.sh install|status|gsfid|uninstall
W=/data/local/tmp/playstore
IMG=$W/system.img
U=/mnt/scratch/overlay
# file  sha256 in the Play image r14
FILES="
product/priv-app/Phonesky/Phonesky.apk 2616771999b1cde77fd000ae17a43784dded1f76b21ec12881137c84d5313dd2
product/priv-app/PrebuiltGmsCore/PrebuiltGmsCore.apk 63aaf087cdfad32fd9eca45f36966afe2f44db7e125e099f3e344ca99cee13c2
system_ext/priv-app/GoogleServicesFramework/GoogleServicesFramework.apk 58999d24e4dbdde61f90b59a89c86edabc69e0908ddaaa2742091493d7e3b975
product/priv-app/PartnerSetupPrebuilt/PartnerSetupPrebuilt.apk 20190a60924f36baae9ef9b7687691c445dd9a764b42c4751474293baf5ea15c
product/etc/security/fsverity/play_store_fsi_cert.der 37aabd485044e3af6d84755268faf8392e226ca0d188be6a80335525ce0ec6ff
"
STUB=product/app/LicenseChecker

die() { echo "FAIL: $*"; exit 1; }

writable() {
  remount >/dev/null 2>&1
  for p in product system_ext; do
    touch /$p/.modavd-w 2>/dev/null && rm /$p/.modavd-w || die "/$p is not writable. Only instances with the arm64 bridge boot with a writable system; see the guide."
  done
}

mount_img() {
  [ -f "$IMG" ] || die "$IMG not found: push system.img first"
  mkdir -p $W/product $W/system_ext
  lp=$(losetup -f -s -r -o 1134559232 -S 1955037184 "$IMG") && mount -t ext4 -o ro "$lp" $W/product ||
    die "cannot mount the product partition of $IMG (is it the r14 Play image?)"
  le=$(losetup -f -s -r -o 970981376 -S 162566144 "$IMG") && mount -t ext4 -o ro "$le" $W/system_ext ||
    { umount $W/product; die "cannot mount the system_ext partition of $IMG"; }
}

umount_img() { umount $W/product 2>/dev/null; umount $W/system_ext 2>/dev/null; }

install() {
  writable
  mount_img
  echo "$FILES" | while read -r f sum; do
    [ -n "$f" ] || continue
    got=$(sha256sum "$W/$f" 2>/dev/null | cut -d' ' -f1)
    [ "$got" = "$sum" ] || { umount_img; die "/$f in $IMG does not match (got ${got:-nothing})"; }
  done || exit 1
  echo "$FILES" | while read -r f sum; do
    [ -n "$f" ] || continue
    d=/${f%/*}
    if [ ! -d "$d" ]; then mkdir -p "$d" && chmod 755 "$d" && chcon u:object_r:system_file:s0 "$d" || exit 1; fi
    cp "$W/$f" "/$f.new" && chown root:root "/$f.new" && chmod 644 "/$f.new" &&
      chcon u:object_r:system_file:s0 "/$f.new" && mv "/$f.new" "/$f" || exit 1
    echo "copied /$f"
  done || { umount_img; die "copying failed"; }
  umount_img
  # The image's own com.android.vending is a licensing stub; hide it so the store takes its place.
  rm -rf /$STUB && echo "hid /$STUB"
  pm enable com.android.vending >/dev/null 2>&1
  sync
  echo "OK: installed. Shut the instance down and start it again (cold boot)."
}

status() {
  echo "$FILES" | while read -r f sum; do
    [ -n "$f" ] || continue
    got=$(sha256sum "/$f" 2>/dev/null | cut -d' ' -f1)
    if [ "$got" = "$sum" ]; then echo "play    /$f"; elif [ -n "$got" ]; then echo "image   /$f"; else echo "absent  /$f"; fi
  done
  if [ -e /$STUB ]; then echo "present /$STUB (store not installed)"; else echo "hidden  /$STUB"; fi
  echo "com.android.vending: $(pm path com.android.vending | head -1)"
}

gsfid() {
  id=$(sqlite3 /data/data/com.google.android.gsf/databases/gservices.db "select value from main where name='android_id';")
  [ -n "$id" ] || die "no GSF ID yet: wait a minute with the network on, then try again"
  echo "GSF ID (decimal): $id"
  printf 'GSF ID (hex):     %x\n' "$id"
}

uninstall() {
  # The store is disabled first so it cannot update itself again before the shutdown; the second run, after the
  # cold boot, enables com.android.vending again (by then the image's licensing stub).
  am force-stop com.android.vending >/dev/null 2>&1
  pm disable com.android.vending >/dev/null 2>&1
  for p in com.android.vending com.google.android.gms com.google.android.gsf; do
    case "$(pm uninstall-system-updates $p 2>&1)" in *Success*) echo "removed updates of $p" ;; esac
  done
  writable
  [ -d $U ] || die "$U not found"
  left=0
  for f in $(echo "$FILES" | cut -d' ' -f1); do
    part=${f%%/*}; rest=${f#*/}
    if [ -e "$U/$part/upper/$rest" ]; then rm -f "$U/$part/upper/$rest" && echo "removed /$f"; left=1; fi
  done
  rmdir $U/product/upper/priv-app/Phonesky 2>/dev/null
  if [ -e $U/product/upper/app/LicenseChecker ]; then rm -f $U/product/upper/app/LicenseChecker && echo "restored /$STUB"; left=1; fi
  sync
  if [ $left = 1 ]; then
    echo "OK: files removed. Cold boot the instance (stop, then start), then run uninstall once more."
  elif [ "$(pm path com.android.vending | head -1)" = "package:/$STUB/LicenseChecker.apk" ]; then
    pm enable com.android.vending >/dev/null 2>&1
    echo "OK: the store is gone; the instance is back to the image's own files."
  else
    echo "Not done yet: cold boot the instance, then run uninstall again."
  fi
}

case "$1" in
  install) install ;;
  status) status ;;
  gsfid) gsfid ;;
  uninstall) uninstall ;;
  *) echo "usage: su 0 sh $0 install|status|gsfid|uninstall"; exit 2 ;;
esac
'@
[IO.File]::WriteAllText("$dl\playstore.sh", $sh.Replace("`r`n", "`n"))
```

## 4. Install it into the instance

```powershell
.\tools\modavd.exe start $i
.\tools\modavd.exe shell $i "mkdir -p /data/local/tmp/playstore"
.\tools\modavd.exe adb $i -- push "$dl\x86_64\system.img" /data/local/tmp/playstore/system.img
.\tools\modavd.exe adb $i -- push "$dl\playstore.sh" /data/local/tmp/playstore/playstore.sh
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh install"
```

- If the instance is already running, `start` only reports its state; it doesn't restart it.
- The files are in place when the last line is `OK: installed.` If it says `FAIL:`, deal with what it says and run that line again.

Then shut the instance down and start it again: the new files take effect after a cold boot. Don't restart from inside Android:

```powershell
.\tools\modavd.exe stop $i
.\tools\modavd.exe start $i --window
```

## 5. Check the result

```powershell
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh status"
```

When it is installed, this shows:

```
play    /product/priv-app/Phonesky/Phonesky.apk
play    /product/priv-app/PrebuiltGmsCore/PrebuiltGmsCore.apk
play    /system_ext/priv-app/GoogleServicesFramework/GoogleServicesFramework.apk
play    /product/priv-app/PartnerSetupPrebuilt/PartnerSetupPrebuilt.apk
play    /product/etc/security/fsverity/play_store_fsi_cert.der
hidden  /product/app/LicenseChecker
com.android.vending: package:/product/priv-app/Phonesky/Phonesky.apk
```

After a while the last line may show `/data/app/...` instead: the store has updated itself over the network, which is fine.

Then open "Play Store" from the app list in the instance's window and tap "Sign in". If you reach Google's sign-in page, the store is installed. Read the next section before you sign in.

- Once the instance is online, the store updates Play services to the latest version right away. The store closes itself when that update is installed; open it again a minute or two later.

## 6. Register the device

ModAVD instances aren't devices certified by Google. If signing in, or using Google apps afterwards, is refused with a message that the device isn't Play Protect certified, register the instance's GSF ID with your Google account:

1. Get the GSF ID:

   ```powershell
   .\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh gsfid"
   ```

   It prints the ID in decimal and in hexadecimal; enter whichever the registration page asks for. If there is no ID yet, leave the network on for a minute or two and try again.
2. On the PC, open <https://www.google.com/android/uncertified/> in a browser, sign in with the Google account you will use in the instance, enter the GSF ID and submit it.
3. Give the registration a while to take effect, shut the instance down and start it again, then sign in.

- Each instance has its own GSF ID and needs its own registration. Clearing the data of "Google Services Framework" or recreating the instance gives it a new ID, which has to be registered again.
- Registration only lets Google apps work; the store still shows the device as uncertified.

## 7. Delete the temporary files

```powershell
.\tools\modavd.exe shell $i "rm /data/local/tmp/playstore/system.img"
Remove-Item "$dl\x86_64" -Recurse
```

- Keep `playstore.sh` in the instance; uninstalling needs it, and it is small.
- Keep the zip if you want to install the store into other instances; otherwise delete it.

## How it relates to the bridge and the host IME

- **Host IME**: an ordinary app, not affected.
- **Execution bridge**: the store and the bridge both live in the instance's system overlay, each with its own files. With the store installed, `bridge <number> verify` still passes and the post-boot setup still runs.
- **The store depends on the writable-system boot that the bridge brings**:
  - Don't run `bridge <number> uninstall` on an instance with the store. Without the bridge the instance boots from Google's original image again, the store is gone, and mismatched updates are left behind in the system. To remove the bridge, remove the store first (next section).
  - Instances created with `--no-bridge` can't take the store.
- **Upgrading ModAVD**: as long as the system image version stays the same, the instance's overlay is left alone, so the store stays, like the bridge, and needs no reinstall.
- **A different system image version**: the files, offsets and checksums on this page are for r14 only. If a later ModAVD moves to another image version, follow the documentation of that version.

## Uninstall

```powershell
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh uninstall"
.\tools\modavd.exe stop $i
.\tools\modavd.exe start $i
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh uninstall"
```

- The first run disables the store (so it can't update itself again before the shutdown), removes the updates the store installed for itself, Play services and GSF, deletes the copied files and brings the placeholder back. The second run, after the cold boot, enables the placeholder again. `OK: the store is gone` means it is fully removed.
- Afterwards Play services is back to the image's 23.18, with its data kept. Updates the store installed for other apps (Android System WebView, for example) stay.
- If `playstore.sh` is no longer in the instance, create and push it again with steps 3 and 4; `system.img` isn't needed for this.
- A Google account you signed in with stays in the instance. To remove it, use "Passwords & accounts" in Android's settings.

## Why it is done this way

- **A plain `adb install` of the store fails**: the image already has a system app with the package name `com.android.vending`, the placeholder mentioned above. Its signature is different, so the system refuses the store as an "update". Even if it were installed, the store needs to be a privileged system app to get permissions such as installing apps.
- **The store alone isn't enough**: the image's own Play services and GSF are signed with the Android test certificate, while the store is signed by Google. Google's components check each other's signatures and stop working when they don't match; the log says `requires Google Play Store, but its signature doesn't match that of Google Play services`. So Play services and GSF are replaced too, by the Google-signed copies of the same version from the Play image. Partner Setup writes GSF settings, so its signature has to change along with them.
- **GApps packages from the internet** (MindTheGapps, NikGapps, OpenGApps and others):
  - we found no official Android 14 x86_64 build;
  - they are made to be flashed from a recovery, which ModAVD instances don't have, so the files would still have to be placed by hand as above;
  - their Play services differ from the image's in version and signature, so it would have to be replaced as well.
  - Taking the files from Google's official image gives a source you can check and the same build cycle as the image.
- **Installing the Google apps as ordinary apps**: runs into the first point.

## Risks

- This changes the instance's system partitions. The changes are in the instance's own overlay, not in Google's original image files. If something goes wrong, uninstall as above; if the instance no longer boots, the only way out is to delete and recreate it, which loses its game data. That's why a new instance is recommended.
- The device isn't Play Protect certified. After registering the GSF ID, Google apps work, but Play Integrity checks will most likely fail: the image is a userdebug build with test keys, and it has root. Games and apps that check integrity may refuse to run or to sign in.
- The other Google apps that come with the image (Gmail, YouTube, Maps and so on) are still signed with the test certificate. That is why Partner Setup crashed in the background and is replaced too; the others weren't tested and may stop working once Play services is replaced.
- Once the instance is online, the store updates itself and Play services to the latest versions (in our test Play services went from 23.18 to 26.43), which downloads a few hundred MB.
- Section 3.4 of Google's Android Software Development Kit License Agreement doesn't allow copying or modifying parts of the SDK, and the system images are part of it. Installing the store this way is outside what that agreement allows; whether to do it is your decision.
