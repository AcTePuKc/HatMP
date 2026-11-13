"""List text-bearing selection art still passed to sc.select (manual review queue)."""

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re
import shutil
import subprocess


ROOT = Path(__file__).resolve().parent.parent
ROOMS = ROOT / "scripts" / "room"
IMAGES = ROOT / "images" / "room"
PATTERN = re.compile(
    r"sc\.select\(\s*['\"][^'\"]+['\"]\s*,\s*['\"]([^'\"]+\.(?:png|webp))['\"]",
    re.MULTILINE,
)


def candidates():
    found = {}
    for script in ROOMS.glob("room*.js"):
        source = script.read_text(encoding="utf-8")
        for match in PATTERN.finditer(source):
            image = match.group(1)
            if "/icon_" not in image:
                continue
            line = source.count("\n", 0, match.start()) + 1
            found.setdefault(image, []).append(f"{script.name}:{line}")
    return found


def read_label(item):
    image, places = item
    file = IMAGES / image
    if not file.exists():
        return image, places, "[image missing]"
    result = subprocess.run(
        ["tesseract", str(file), "stdout", "--psm", "6"],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    label = " ".join(result.stdout.split())
    return image, places, label


def main():
    if not shutil.which("tesseract"):
        raise SystemExit("Tesseract is needed to inspect text in button artwork.")
    found = candidates()
    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(read_label, sorted(found.items())))
    print(f"{len(found)} distinct icon images in {len({p.split(':')[0] for v in found.values() for p in v})} room scripts")
    for image, places, label in results:
        if label:
            print(f"{image}\t{label}\t{', '.join(places)}")


if __name__ == "__main__":
    main()
