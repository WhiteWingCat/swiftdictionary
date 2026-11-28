import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import argostranslate.package
import argostranslate.translate

INPUT = Path("tmp/u3-malay-dictionary-translation-input.json")
OUTPUT = Path("data/languages/malay-dictionary-translations.js")

def install_pair(source_code, target_code):
    available = argostranslate.package.get_available_packages()
    package = next((item for item in available if item.from_code == source_code and item.to_code == target_code), None)
    if package is None:
        raise RuntimeError(f"Argos model not found: {source_code}->{target_code}")
    installed = argostranslate.translate.get_installed_languages()
    if any(lang.code == source_code for lang in installed) and any(lang.code == target_code for lang in installed):
        # Still verify that this exact direction is installed below.
        pass
    existing = next((item for item in installed if item.code == source_code), None)
    if existing:
        try:
            existing.get_translation(next(lang for lang in installed if lang.code == target_code))
            return
        except Exception:
            pass
    package_path = package.download()
    argostranslate.package.install_from_path(package_path)

def get_translation(source_code, target_code):
    installed = argostranslate.translate.get_installed_languages()
    source = next((lang for lang in installed if lang.code == source_code), None)
    target = next((lang for lang in installed if lang.code == target_code), None)
    if source is None or target is None:
        raise RuntimeError(f"Missing installed Argos language: {source_code}->{target_code}")
    return source.get_translation(target)

def clean(text):
    return " ".join(str(text or "").replace("\u0000", "").split()).strip()

def normalise_malay(text):
    value = clean(text)
    replacements = [
        (r"\baku\b", "saya"),
        (r"\bbisa\b(?!\s+(?:ular|racun|sengat|beracun))", "dapat"),
        (r"\bkantor\b", "pejabat"),
        (r"\bkalimat\b", "ayat"),
        (r"\bbis\b", "bas"),
        (r"\b(?:nggak|enggak)\b", "tidak"),
        (r"\bbanget\b", "sangat"),
        (r"\bapotek\b", "farmasi"),
        (r"\bbahasan\b", "huraian"), (r"\bANA\b", "sebarang")
    ]
    for pattern, replacement in replacements:
        value = re.sub(pattern, lambda match: replacement.capitalize() if match.group(0)[:1].isupper() else replacement, value, flags=re.IGNORECASE)
    if re.search(r"\b(?:aku|bisa(?!\s+(?:ular|racun|sengat|beracun))|kantor|kalimat|bis|nggak|enggak|banget|apotek|bahasan|ana)\b", value, flags=re.IGNORECASE):
        raise RuntimeError("Indonesian-only wording remains after Malay normalisation: " + value)
    return clean(value)

def main():
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    argostranslate.package.update_package_index()
    install_pair("en", "ms")
    install_pair("zh", "en")
    en_ms = get_translation("en", "ms")
    zh_en = get_translation("zh", "en")

    def translate(text, source):
        text = clean(text)
        if not text:
            raise RuntimeError("Refusing to create an empty translation")
        if source == "zh":
            text = clean(zh_en.translate(text))
        result = normalise_malay(en_ms.translate(text))
        if not result:
            raise RuntimeError("Argos returned an empty Malay translation")
        return result

    result = {
        "schemaVersion": 1,
        "targetLanguage": "ms",
        "engine": "Argos Translate (offline models: en-ms 1.9; zh-en 1.9 followed by en-ms 1.9)",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "machine_assisted_draft",
        "reviewerId": None,
        "provenance": "Generated locally in GitHub Actions from SwiftDictionary's original-authored Dictionary definitions. No DBP/PRPM/Kamus Dewan text or third-party dictionary entries were imported. Human Malaysian Standard Malay review is pending.",
        "languages": {"en": {}, "zh": {}}
    }

    totals = {"en": {"entries": 0, "senses": 0, "manual": 0}, "zh": {"entries": 0, "senses": 0, "manual": 0}}
    for language_key, records in (("en", data["english"]), ("zh", data["chinese"])):
        for entry in records:
            senses = []
            for sense in entry["senses"]:
                text = sense.get("manualTranslation") or translate(sense["sourceText"], sense["sourceLanguage"])
                if sense.get("manualTranslation"):
                    totals[language_key]["manual"] += 1
                senses.append({
                    "id": sense["id"],
                    "definitionMs": text,
                    "translationStatus": "machine_assisted_draft",
                    "sourceLanguage": sense["sourceLanguage"]
                })
                totals[language_key]["senses"] += 1
            headword_source = entry["word"]
            headword_ms = translate(headword_source, language_key)
            result["languages"][language_key][entry["word"]] = {
                "entryId": entry["id"],
                "headwordMs": headword_ms,
                "translationStatus": "machine_assisted_draft",
                "senses": senses
            }
            totals[language_key]["entries"] += 1

    expected = {"en": (1316, 1931), "zh": (725, 825)}
    for key, (entries, senses) in expected.items():
        if totals[key]["entries"] != entries or totals[key]["senses"] != senses:
            raise RuntimeError(f"Coverage mismatch for {key}: {totals[key]}")
        for word, entry in result["languages"][key].items():
            if not entry["headwordMs"] or len(entry["senses"]) == 0:
                raise RuntimeError(f"Incomplete translation for {key}/{word}")
            if any(not item["definitionMs"] for item in entry["senses"]):
                raise RuntimeError(f"Missing sense translation for {key}/{word}")

    js = "/* Generated Malay target-language Dictionary translations. Machine-assisted drafts; human review pending. */\n"
    js += "window.SWIFT_DICTIONARY_MS_TRANSLATIONS = " + json.dumps(result, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT.write_text(js, encoding="utf-8")
    print(json.dumps({"coverage": totals, "output_bytes": OUTPUT.stat().st_size, "status": result["status"]}, ensure_ascii=False))

if __name__ == "__main__":
    main()
