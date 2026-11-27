# What to do when antivirus software flags ModAVD

Antivirus software can occasionally report a ModAVD file as a trojan. Use the steps below to verify where the file came from and that it is intact before you decide whether to allow it.

## Why this happens

ModAVD programs do not have commercial code signing. Machine-learning rules in some antivirus products can occasionally classify an unsigned program as a trojan. Windows Defender and Kaspersky have both produced this kind of false positive.

## Verify that the download is genuine

1. ModAVD is distributed through two channels only: the [ModAVD Releases](https://github.com/ModAVD/ModAVD/releases) page on GitHub and MirrorChyan. Download the archive from one of them. The checksum list to check against is always `SHA256SUMS.txt` on the GitHub release page; use it for a download from MirrorChyan too.
2. Open PowerShell in the folder where you saved the archive and run the following command, replacing the file name with the one you downloaded:

   ```powershell
   Get-FileHash .\ModAVD-<version>-win-x64.zip -Algorithm SHA256
   ```

3. Compare the `Hash` in the command output with the hash for that file in `SHA256SUMS.txt`. `Get-FileHash` prints uppercase letters while `SHA256SUMS.txt` uses lowercase, so ignore case when you compare; every character must otherwise be the same. Continue only when they match. If they do not, delete the archive and download it again from the GitHub release page.

## Allowing a file in Windows Defender

### Restore a quarantined file

1. Open Windows Security → **Virus & threat protection** → **Protection history**.
2. Find the entry for ModAVD. Open its details and confirm that the path and file name belong to the release archive you just verified.
3. Choose **Actions** → **Allow on device** or **Restore**, then follow the prompts.

### Add an exclusion

1. Open Windows Security → **Virus & threat protection** → **Manage settings** → **Exclusions** → **Add or remove exclusions**.
2. Choose **Add an exclusion** → **Folder**, then select the extracted ModAVD root folder.
3. Save the setting and run ModAVD again.

Add an exclusion only for the ModAVD root folder. Do not exclude an entire drive or your whole user profile.

## Add a trusted item in Kaspersky

1. Open Kaspersky and go to **Settings** → **Security settings** → **Threats and Exclusions** → **Manage exclusions**. The menu names can vary slightly between product versions.
2. Click **Add** and select the extracted ModAVD root folder.
3. Confirm that files in this folder are trusted or excluded from scanning, then save the setting and run ModAVD again.

Add only the ModAVD root folder. Do not trust an entire drive.

## Report a false positive

Open an issue in the [ModAVD repository](https://github.com/ModAVD/ModAVD/issues) and include:

- the antivirus product and version;
- the detection name (for example, the reported trojan name);
- the blocked file name and the release version;
- if possible, the `SHA256SUMS.txt` result and a screenshot of the detection.
