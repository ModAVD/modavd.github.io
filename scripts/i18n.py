"""Check that the Chinese pages (docs/) and the English pages (docs/en/) match.

- every page exists in both languages, at the same path;
- both versions have the same headings: same levels, same order, same explicit {#id};
- links into the site stay in their own language (English pages link to /en/..., Chinese pages do not);
- every #anchor in a link to a page of this site exists in that page.

With --base <ref> it also warns about pages changed since <ref> in one language only.

Run from anywhere: python scripts/i18n.py [--base origin/main]
"""
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
FENCE = re.compile(r"^\s*(```|~~~)")
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*(?:\{#([^}\s]+)\})?\s*$")
LINK = re.compile(r"\]\(([^)\s]+)\)")
FRONT_LINK = re.compile(r"^\s*(?:-\s*)?link:\s*(\S+)\s*$")
SPECIAL = re.compile(r"[\s~`!@#$%^&*()\-_+=\[\]{}|\\;:\"'“”‘’<>,.?/]+")


def slugify(text):
    """The anchor VitePress (@mdit-vue/shared) gives a heading."""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[`*]", "", text)
    text = "".join(c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c))
    text = re.sub(r"[\u0000-\u001f]", "", text)
    text = re.sub(r"-{2,}", "-", SPECIAL.sub("-", text)).strip("-")
    return re.sub(r"^(\d)", r"_\1", text).lower()


def parse(path):
    """Headings as (level, explicit id, anchor) and links as (line, target), skipping code blocks."""
    headings, links, seen, fence = [], [], {}, None
    lines = path.read_text(encoding="utf-8").splitlines()
    front = lines.index("---", 1) if lines and lines[0] == "---" else 0
    for number, line in enumerate(lines, 1):
        if number <= front:
            match = FRONT_LINK.match(line)
            links += [(number, match.group(1))] if match else []
            continue
        match = FENCE.match(line)
        if match:
            fence = None if fence == match.group(1) else (fence or match.group(1))
            continue
        if fence:
            continue
        match = HEADING.match(line)
        if match:
            anchor = match.group(3) or slugify(match.group(2))
            count = seen.get(anchor, 0)
            seen[anchor] = count + 1
            headings.append((len(match.group(1)), match.group(3), anchor if count == 0 else f"{anchor}-{count}"))
        links += [(number, target) for target in LINK.findall(line)]
    return headings, links


def resolve(page, target):
    """The page a link points to, relative to docs/; None for links to other sites."""
    if re.match(r"^[a-z]+:", target):
        return None
    path = target.split("#")[0]
    if not path:
        return page
    parts = [] if path.startswith("/") else page.split("/")[:-1]
    for part in path.split("/"):
        if part == "..":
            parts = parts[:-1]
        elif part not in (".", ""):
            parts.append(part)
    rel = "/".join(parts)
    if path.endswith("/") or not rel:
        return (rel + "/index.md").lstrip("/")
    return rel if rel.endswith(".md") else re.sub(r"\.html$", "", rel) + ".md"


def main():
    pages = {p.relative_to(DOCS).as_posix() for p in DOCS.rglob("*.md") if ".vitepress" not in p.parts}
    zh = {p for p in pages if not p.startswith("en/")}
    en = {p[3:] for p in pages if p.startswith("en/")}
    errors = [f"docs/{p}: no English page docs/en/{p}" for p in sorted(zh - en)]
    errors += [f"docs/en/{p}: no Chinese page docs/{p}" for p in sorted(en - zh)]
    parsed = {p: parse(DOCS / p) for p in pages}

    for p in sorted(zh & en):
        a = [(level, hid) for level, hid, _ in parsed[p][0]]
        b = [(level, hid) for level, hid, _ in parsed["en/" + p][0]]
        if a != b:
            errors.append(f"docs/en/{p}: headings differ from docs/{p} (level, {{#id}}): {a} vs {b}")

    for p in sorted(pages):
        for number, target in parsed[p][1]:
            dest = resolve(p, target)
            if dest is None:
                continue
            if dest.startswith("en/") != p.startswith("en/"):
                errors.append(f"docs/{p}:{number}: {target} leads to the other language")
            if "#" not in target:
                continue
            if dest not in parsed:
                errors.append(f"docs/{p}:{number}: {target}: no page docs/{dest}")
            elif target.split("#", 1)[1] not in {anchor for _, _, anchor in parsed[dest][0]}:
                errors.append(f"docs/{p}:{number}: {target}: no such heading in docs/{dest}")

    if "--base" in sys.argv:
        base = sys.argv[sys.argv.index("--base") + 1]
        diff = subprocess.run(["git", "diff", "--name-only", f"{base}...HEAD", "--", "docs"], cwd=DOCS.parent,
                              capture_output=True, text=True, encoding="utf-8", check=True).stdout.split()
        changed = {p[len("docs/"):] for p in diff if p.endswith(".md")}
        for p in sorted(changed):
            other = p[3:] if p.startswith("en/") else "en/" + p
            if other not in changed and (DOCS / other).exists():
                print(f"::warning file=docs/{p}::docs/{p} changed but docs/{other} did not."
                      " Update the other language too, or say in the PR why not.")

    for error in errors:
        print(error)
    print(f"{len(zh)} Chinese pages, {len(en)} English pages, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
