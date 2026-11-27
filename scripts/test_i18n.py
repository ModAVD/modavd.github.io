import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

# CI runs this with python -I, which leaves the script's own directory off sys.path.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import i18n  # noqa: E402


def page(tmp, name, text):
    path = Path(tmp) / name
    path.write_text(text, encoding="utf-8")
    return i18n.parse(path)


class ContentCheckTest(unittest.TestCase):
    def signature(self, tmp, name, page_name, text):
        headings, links, blocks = page(tmp, name, text)
        return headings, links, blocks, i18n.link_set(page_name, links)

    def test_code_blocks_are_counted_and_fenced_text_is_ignored(self):
        with tempfile.TemporaryDirectory() as tmp:
            _, links, blocks = page(tmp, "a.md", "# T\n\n```sh\n[x](http://skipped)\n```\n\n~~~\nb\n~~~\n[y](http://kept)\n")
            self.assertEqual(blocks, 2)
            self.assertEqual([t for _, t in links], ["http://kept"])

    def test_same_content_in_both_languages_has_no_differences(self):
        with tempfile.TemporaryDirectory() as tmp:
            zh = self.signature(tmp, "zh.md", "guide/a.md",
                                "# 标题\n```sh\nx\n```\n[B](./b) ![i](/shot.png) [g](https://example.org/x/#中文)\n")
            en = self.signature(tmp, "en.md", "en/guide/a.md",
                                "# Title\n```sh\nx\n```\n[B](./b) ![i](/shot.png) [g](https://example.org/x/#english)\n")
            self.assertEqual(i18n.content_differences(zh, en), [])

    def test_different_blocks_and_links_are_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            zh = self.signature(tmp, "zh.md", "guide/a.md", "# T\n```\nx\n```\n[a](https://example.org/a)\n")
            en = self.signature(tmp, "en.md", "en/guide/a.md", "# T\n[b](https://example.org/b)\n")
            found = i18n.content_differences(zh, en)
            self.assertEqual(len(found), 3)
            self.assertIn("1 code blocks in Chinese, 0 in English", found)
            self.assertIn("links only in Chinese: https://example.org/a", found)
            self.assertIn("links only in English: https://example.org/b", found)

    def test_external_urls_ignore_anchor_and_readme_language(self):
        self.assertEqual(i18n.external("https://github.com/ModAVD/ModAVD#已实测的游戏"), "https://github.com/ModAVD/ModAVD")
        self.assertEqual(i18n.external("https://github.com/ModAVD/ModAVD/blob/main/README.en.md#tested-games"),
                         "https://github.com/ModAVD/ModAVD")
        self.assertEqual(i18n.external("https://github.com/ModAVD/ModAVD/blob/main/AGENTS.en.md"),
                         "https://github.com/ModAVD/ModAVD/blob/main/AGENTS.md")
        self.assertEqual(i18n.external("https://modavd.github.io/en/develop/"), "https://modavd.github.io/develop")

    def test_internal_links_compare_without_the_language_prefix(self):
        self.assertEqual(i18n.link_set("en/guide/a.md", [(1, "/en/guide/install")]),
                         i18n.link_set("guide/a.md", [(1, "/guide/install")]))


class StaleTest(unittest.TestCase):
    def test_which_side_fell_behind(self):
        self.assertIsNone(i18n.stale_side(None, (1, "a")))
        self.assertIsNone(i18n.stale_side((5, "same"), (5, "same")))
        self.assertIsNone(i18n.stale_side((5, "c1"), (5, "c2")))
        self.assertEqual(i18n.stale_side((9, "zh9"), (5, "en5")), "English page older than Chinese since zh9")
        self.assertEqual(i18n.stale_side((5, "zh5"), (9, "en9")), "Chinese page older than English since en9")

    def test_last_change_reads_git(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            git = ["git", "-c", "user.name=t", "-c", "user.email=t@users.noreply.github.com"]
            subprocess.run(["git", "init", "-q"], cwd=root, check=True)
            (root / "a.md").write_text("a", encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=root, check=True)
            subprocess.run([*git, "commit", "-qm", "x"], cwd=root, check=True)
            change = i18n.last_change(root / "a.md", root)
            self.assertEqual(len(change), 2)
            self.assertIsNone(i18n.last_change(root / "missing.md", root))


if __name__ == "__main__":
    unittest.main()
