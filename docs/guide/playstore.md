# Google Play 商店

ModAVD 用的系统镜像是 Google 的「Google APIs」版 Android 14，自带 Google Play 服务，但没有 Play 商店。要从 Play 商店下载游戏、在商店里登录 Google 账号的，可以给实例补上 Google 官方「Google Play」版镜像里的商店。ModAVD 0.38.2（管理器 0.5.0）起，管理器和命令行都能做；新建的实例不带商店，要用的实例再补。

::: warning 先看风险
见本页最后的[风险](#风险)。建议新建一台实例专门来装，不要先在存着重要游戏数据的实例上试。
:::

## 用管理器装

实例要有执行桥（新建时没加 `--no-bridge` 就是带的，见[和执行桥、宿主输入法的关系](#和执行桥、宿主输入法的关系)）。

1. 在实例卡片的「更多操作」里点「补全 Google Play 商店…」。
2. 根目录还没有[下面表里](#装的是什么)那五个文件时，管理器会先带你到「电脑检查」的「Google Play 商店服务」一项，二选一：
   - 点「下载…」：同意许可协议后下载 Google 官方的 Play 版镜像（约 1.5 GB），只取出五个文件，其余删掉；
   - 点「使用我自己的文件…」：导入 Google 官方的镜像压缩包 `x86_64-34_r14.zip`，或者那五个文件本身。

   第一次补全组件（电脑检查里的「补全组件」）时，也可以直接勾上「同时补全 Google Play 商店服务」。五个文件在根目录里放好以后，每台实例都用这一份。
3. 回到实例的「更多操作」，再点「补全 Google Play 商店…」。管理器会先问一下，然后把实例冷启动一次，把文件放进去；原来没开的实例做完会再关上。
4. 在实例窗口的应用列表里打开「Play Store」（中文界面叫「Play 商店」），点「Sign in」，能进到 Google 的登录页就装好了。登录前先看[登记设备](#登记设备)。

- 装好以后，实例的「更多操作」里变成「移除 Google Play 商店…」和「复制 GSF ID」。
- 联网以后商店会把自己和 Play 服务更新到最新版，要下载几百 MB。更新装上的那一下商店会自己关掉，过一两分钟再打开就好。

## 用命令行装

在 ModAVD 文件夹里，用 `tools\modavd.exe`。`<i>` 是实例编号。

```powershell
# 根目录补全五个文件，二选一
.\tools\modavd.exe components fetch --play-store                  # 下载（会问许可协议）
.\tools\modavd.exe components import-playstore <压缩包或文件夹>   # 用自己的文件

# 装进实例
.\tools\modavd.exe playstore <i> install     # 冷启动一次
.\tools\modavd.exe playstore <i> status      # 看装没装好（实例要开着）
.\tools\modavd.exe playstore <i> gsfid       # 打出 GSF ID，登记设备用
.\tools\modavd.exe playstore <i> uninstall   # 移除，冷启动一次
```

- `components import-playstore` 收 Google 官方的 `x86_64-34_r14.zip`，或者那五个文件（名字不限）。逐个核对大小和 SHA-256，对不上的一律拒收，什么也不改。
- 实例没有执行桥，或者根目录还没有五个文件时，`playstore <i> install` 在动实例之前就报错。
- `components fetch --play-store` 只补全商店的五个文件；不带这个参数的 `components fetch` 只补全 adb 和系统镜像。

## 装的是什么

从 Google 官方的 `system-images;android-34;google_apis_playstore;x86_64` r14 里取五个文件，放进实例自己的系统覆盖层。这个镜像和 ModAVD 现在用的镜像是同一个安卓版本、同一期构建。

| 文件 | 是什么 | SHA-256 |
|---|---|---|
| `/product/priv-app/Phonesky/Phonesky.apk` | Play 商店 | `2616771999b1cde77fd000ae17a43784dded1f76b21ec12881137c84d5313dd2` |
| `/product/priv-app/PrebuiltGmsCore/PrebuiltGmsCore.apk` | Google Play 服务，换成和商店同一个签名的那份（版本不变，都是 23.18.18） | `63aaf087cdfad32fd9eca45f36966afe2f44db7e125e099f3e344ca99cee13c2` |
| `/system_ext/priv-app/GoogleServicesFramework/GoogleServicesFramework.apk` | Google 服务框架（GSF），同上 | `58999d24e4dbdde61f90b59a89c86edabc69e0908ddaaa2742091493d7e3b975` |
| `/product/priv-app/PartnerSetupPrebuilt/PartnerSetupPrebuilt.apk` | Google 合作伙伴设置，同上；不换的话它在后台反复崩溃 | `20190a60924f36baae9ef9b7687691c445dd9a764b42c4751474293baf5ea15c` |
| `/product/etc/security/fsverity/play_store_fsi_cert.der` | 商店用的 fs-verity 证书 | `37aabd485044e3af6d84755268faf8392e226ca0d188be6a80335525ce0ec6ff` |

另外把镜像自带的许可证检查占位应用 `/product/app/LicenseChecker` 藏起来：它的包名也是 `com.android.vending`，不藏会和商店撞。

管理器和命令行放进去之前，会逐个核对这五个文件的大小和 SHA-256。为什么要连 Play 服务一起换、为什么不能直接 `adb install`，见[为什么要这样装](#为什么要这样装)。

## 登记设备

ModAVD 的实例不是 Google 认证过的设备。登录时或登录后提示「设备未经 Play 保护机制认证」、不让用 Google 应用的，要把这台实例的 GSF ID 登记到你的 Google 账号：

1. 取 GSF ID。实例开着、联网，在实例的「更多操作」里点「复制 GSF ID」；命令行用 `.\tools\modavd.exe playstore <i> gsfid`。会给出十进制和十六进制两种写法，登记页要哪种就填哪种。提示还没有 ID 的，开着网等一两分钟再试。手动装的实例用[手动安装](#手动安装)里的 `playstore.sh gsfid`。
2. 在电脑的浏览器里打开 <https://www.google.com/android/uncertified/>，用要在实例里登录的那个 Google 账号登录，填入 GSF ID，提交。
3. 等一会儿让登记生效，把实例关机再开机，再去登录。

- 每台实例的 GSF ID 不一样，每台都要登记。清除「Google 服务框架」的数据或者重建实例以后 ID 会变，要重新登记。
- 登记只是让 Google 应用能用，商店里照样显示设备未认证。

## 和执行桥、宿主输入法的关系

- **宿主输入法**：是普通应用，不受影响。
- **执行桥**：商店和桥都在实例的系统覆盖层里，各放各的文件。装了商店以后 `bridge <编号> verify` 照常通过，开机后的设置也照常做。
- **商店离不开桥带来的可写系统镜像开机**：
  - 用 `--no-bridge` 新建的实例装不了；管理器里这样的实例，「补全 Google Play 商店…」是灰的，提示要执行桥。
  - 装了商店的实例不要卸执行桥：卸了桥，实例就改回用 Google 的原始镜像开机，商店没了，系统里还会留下不配套的更新。管理器装的，`bridge <编号> uninstall` 会拒绝，要先移除商店；手动装的，管理器不认，不会拦（见[手动安装](#手动安装)），要自己先照[手动卸载](#手动卸载)卸掉商店再卸桥。
- **升级 ModAVD**：系统镜像版本不变时，实例的覆盖层不动，商店和执行桥一样留着，不用重装。
- **换系统镜像版本**：这一页的文件、偏移和校验值只对 r14 有效；管理器每个版本带的是它那一版对应的文件。以后 ModAVD 换了镜像版本，以那时的文档为准。

## 卸载

在实例的「更多操作」里点「移除 Google Play 商店…」，或者用命令行 `.\tools\modavd.exe playstore <i> uninstall`。管理器会先停用商店，去掉商店、Play 服务、GSF 从商店装的更新和放进去的文件，冷启动一次，再把镜像自带的占位应用恢复。

- 卸完以后 Play 服务回到镜像自带的 23.18，数据保留。商店给别的应用装过的更新（比如 Android System WebView）会留着。
- 根目录里的五个文件不删，下次再补全时直接用。
- 已经登录的 Google 账号会留在实例里，不想留就在安卓设置的「Passwords & accounts」（中文界面叫「密码和帐号」）里删掉。
- 手动装的，管理器的菜单里没有「移除」，照[手动卸载](#手动卸载)做。

## 手动安装

管理器和命令行用不了时，可以照下面的步骤自己装。装的是同样的五个文件，放在同样的位置。

::: warning 管理器不认手动装的
管理器只认自己装的商店（记在实例的 `mas-avd.json` 里），照这里手动装的它看不出来：实例卡片的菜单里还是「补全 Google Play 商店…」，没有「移除」和「复制 GSF ID」，`bridge <编号> uninstall` 也不拦。手动装的，登记设备用下面脚本的 `gsfid`，卸载照[手动卸载](#手动卸载)做。
:::

### 开始前确认

- ModAVD 0.36.0 或更新，实例带 arm64 执行桥（新建时没加 `--no-bridge` 就是带的）。只有带桥的实例按可写系统镜像开机，商店才放得进去。
- 电脑上要有约 5 GB 临时空间（压缩包 1.5 GB，解出来的 `system.img` 3.1 GB）；实例的数据盘要有约 3.5 GB 空间放临时文件。装完都可以删。
- 下面的命令都在 PowerShell 里运行。先进 ModAVD 文件夹，设好三个变量，后面的命令直接复制就行：

```powershell
cd D:\ModAVD        # 换成你的 ModAVD 文件夹
$i = 1              # 换成实例编号
$dl = 'D:\gplay'    # 放下载文件的文件夹，路径只用英文
New-Item -ItemType Directory -Force $dl | Out-Null
```

### 1. 下载 Play 版镜像并核对

```powershell
curl.exe -L -o "$dl\x86_64-34_r14.zip" https://dl.google.com/android/repository/sys-img/google_apis_playstore/x86_64-34_r14.zip
(Get-FileHash "$dl\x86_64-34_r14.zip" -Algorithm SHA1).Hash
```

- 文件 1,510,752,654 字节，SHA-1 要是 `01D32617FD1937E540FAF8731D70CF50E35AF854`。不一致就删掉重下。
- 把 `dl.google.com/android/repository/` 换成 `googledownloads.cn/android/repository/` 或 `mirrors.cloud.tencent.com/AndroidSDK/`，也能下到同一个文件。
- 这个镜像受 Google《Android 软件开发套件许可协议》约束，就是补全组件时显示、存在 `downloads\android-sdk-license.txt` 里的那一份。

### 2. 解出 system.img

```powershell
tar -xf "$dl\x86_64-34_r14.zip" -C $dl x86_64/system.img
```

得到 `$dl\x86_64\system.img`，3,101,687,808 字节。

### 3. 生成安装脚本

整段复制运行，会在 `$dl` 里生成 `playstore.sh`。它在实例里用 root 运行：只读挂上 `system.img` 里的两个分区，核对五个文件的 SHA-256，对上了才放进实例。

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

### 4. 装进实例

```powershell
.\tools\modavd.exe start $i
.\tools\modavd.exe shell $i "mkdir -p /data/local/tmp/playstore"
.\tools\modavd.exe adb $i -- push "$dl\x86_64\system.img" /data/local/tmp/playstore/system.img
.\tools\modavd.exe adb $i -- push "$dl\playstore.sh" /data/local/tmp/playstore/playstore.sh
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh install"
```

- 实例已经开着时，`start` 只报告一下状态，不会重开。
- 最后一行是 `OK: installed.` 才算放好了。是 `FAIL:` 的，按提示处理以后重跑这一行就行。

然后关机再开机，新放的文件冷启动以后才生效。不要在安卓里点重启：

```powershell
.\tools\modavd.exe stop $i
.\tools\modavd.exe start $i --window
```

### 5. 确认装好了

```powershell
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh status"
```

装好时显示：

```
play    /product/priv-app/Phonesky/Phonesky.apk
play    /product/priv-app/PrebuiltGmsCore/PrebuiltGmsCore.apk
play    /system_ext/priv-app/GoogleServicesFramework/GoogleServicesFramework.apk
play    /product/priv-app/PartnerSetupPrebuilt/PartnerSetupPrebuilt.apk
play    /product/etc/security/fsverity/play_store_fsi_cert.der
hidden  /product/app/LicenseChecker
com.android.vending: package:/product/priv-app/Phonesky/Phonesky.apk
```

最后一行过一会儿可能变成 `/data/app/...`：那是商店联网后自己更新了，正常。

然后在实例窗口的应用列表里打开「Play Store」（中文界面叫「Play 商店」），点「Sign in」，能进到 Google 的登录页就装好了。登录前先看上面的[登记设备](#登记设备)。

- 开机联网后，商店会马上把 Play 服务更新到最新版。更新装上的那一下商店会自己关掉，过一两分钟再打开就好。

### 6. 删掉临时文件

```powershell
.\tools\modavd.exe shell $i "rm /data/local/tmp/playstore/system.img"
Remove-Item "$dl\x86_64" -Recurse
```

- 实例里的 `playstore.sh` 留着，卸载时还要用，它很小。
- 压缩包要给别的实例装就留着，不要了就删掉。

### 手动卸载

```powershell
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh uninstall"
.\tools\modavd.exe stop $i
.\tools\modavd.exe start $i
.\tools\modavd.exe shell $i "su 0 sh /data/local/tmp/playstore/playstore.sh uninstall"
```

- 第一次运行先停用商店（免得它关机前又给自己装更新），去掉商店、Play 服务、GSF 从商店装的更新，删掉放进去的文件，恢复占位应用。第二次运行在冷启动以后，把占位应用重新启用。看到 `OK: the store is gone` 就卸干净了。
- 卸完以后 Play 服务回到镜像自带的 23.18，数据保留。商店给别的应用装过的更新（比如 Android System WebView）会留着。
- 实例里的 `playstore.sh` 已经删了的，先照第 3、4 步重新生成、推进去，`system.img` 不用推。
- 已经登录的 Google 账号会留在实例里，不想留就在安卓设置的「Passwords & accounts」（中文界面叫「密码和帐号」）里删掉。

## 为什么要这样装

- **直接 `adb install` 商店会失败**：镜像里已经有一个包名同为 `com.android.vending` 的系统应用，就是上面说的占位应用。签名不同，系统不让用商店去「更新」它。就算装上了，商店也要作为系统特权应用，才有装应用这些权限。
- **只放商店不够**：镜像自带的 Play 服务和 GSF 是用 Android 测试证书签的，商店是 Google 正式签名的。Google 的组件之间会互相查签名，对不上就不工作，日志里是 `requires Google Play Store, but its signature doesn't match that of Google Play services`。所以要把 Play 服务和 GSF 也换成 Play 版镜像里同版本、Google 签名的那两份。合作伙伴设置要写 GSF 的设置，签名也得跟着换。
- **网上的 GApps 刷机包**（MindTheGapps、NikGapps、OpenGApps 等）：
  - 没找到 Android 14 x86_64 的正式版本；
  - 它们是给 recovery 刷的，ModAVD 的实例没有 recovery，最后还是得照上面这样手动放文件；
  - 里面的 Play 服务和镜像自带的版本、签名都不一样，一样要换。
  - 从 Google 官方镜像里取，来源能核对，版本也和镜像是同一期。
- **当普通应用装的「谷歌三件套」**：撞上的就是第一条。

## 风险

- 这样装会改实例的系统分区。改的是实例自己的覆盖层，不动 Google 的原始镜像文件。出了问题可以照上面卸载；实例起不来的，只能删掉重建，游戏数据会丢。所以建议用新实例装。
- 设备没有通过 Play 保护机制认证。登记 GSF ID 以后 Google 应用能用，但 Play Integrity（完整性检查）多半过不了：镜像是 userdebug、测试密钥构建，还带 root。查完整性的游戏和应用可能不让运行或不让登录。
- 镜像里预装的其他 Google 应用（Gmail、YouTube、地图等）还是测试证书签名。合作伙伴设置就是因为这个在后台崩溃，所以一起换了；其他几个没测，换了 Play 服务以后可能用不了。
- 开机联网以后，商店会把自己和 Play 服务更新到最新版（实测 Play 服务从 23.18 更新到了 26.43），要下载几百 MB。
- Google《Android 软件开发套件许可协议》第 3.4 条不允许复制、修改 SDK 的组成部分，系统镜像也算在内。这样装商店不在这份协议允许的范围内，装不装由你自己决定。
