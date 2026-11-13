# Image button text audit

Room 22's toilet menu is shared by entrances from Rooms 12, 184, 201, 451, 452, 503, 527 and 727. Its six actions now use EN/BG/ES selection-label overlays, including the disabled `peex` button; both disabled pee options keep their crossed-out artwork. The shared Cancel and Back selection buttons also use localized overlays across rooms, and Room 322's two direct Cancel calls now use the shared helper. Check fit and the crossed-out icons in the game.

The source scan in `tools/scan-image-labels.py` found **279 distinct `icon_*` images called through plain `sc.select()` in 49 room scripts** after the Room 22 conversion. Tesseract produced text candidates for 149 images. These are *review candidates*, not 149 confirmed missing translations: OCR mistakes icons for letters, some images have no text, and this scan does not inspect `nav.button()` or dynamic image paths. Re-run the script and visually inspect candidates before converting each action to `sc.selectLocalizedLabel()`; preserve the button name, index and disabled state.

The generated local queue is `tools/reports/image-label-audit-2026-11-13.tsv` (ignored by Git). Early text-bearing candidates include Rooms 4–5, 10, 14, 19, 125, 170, 172, 174 and 177. Continue in room-sized batches with visible artwork checks.
