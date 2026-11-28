# U3.0 Malay lexical normalisation revision: 2026-11-28
import json
import re
from datetime import datetime, timezone
from pathlib import Path
import argostranslate.package
import argostranslate.translate

INPUT=Path("tmp/u3-malay-learning-support-input.json")
OUTPUT=Path("data/languages/malay-learning-support-translations.js")

def install_pair(source,target):
    installed=argostranslate.translate.get_installed_languages()
    source_lang=next((x for x in installed if x.code==source),None)
    target_lang=next((x for x in installed if x.code==target),None)
    if source_lang and target_lang:
        try:
            source_lang.get_translation(target_lang)
            return
        except Exception:
            pass
    package=next((x for x in argostranslate.package.get_available_packages() if x.from_code==source and x.to_code==target),None)
    if package is None:
        raise RuntimeError(f"Argos model unavailable: {source}->{target}")
    argostranslate.package.install_from_path(package.download())

def translator(source,target):
    installed=argostranslate.translate.get_installed_languages()
    a=next(x for x in installed if x.code==source)
    b=next(x for x in installed if x.code==target)
    return a.get_translation(b)

def clean(value):
    return " ".join(str(value or "").replace("\\u0000","").split()).strip()

def normalise_malay(value):
    text=clean(value)
    # Convert common Indonesian lexical forms and pronoun constructions to
    # Malaysian Standard Malay before the strict residual-term check.
    text=re.sub(r"\b(dengan|untuk|kepada|daripada|dari|pada|bersama|milik)mu\b",
                lambda match:match.group(1)+" anda",text,flags=re.IGNORECASE)
    replacements=[
      (r"\baku\b","saya"),
      (r"\bkamu\b|\bkau\b","anda"),
      (r"\bkhawatir\b","risau"),
      (r"\b(?:halo)\b","helo"),
      (r"\bayolah\b","ayuh"),
      (r"\bayo\b","mari"),
      (r"\bteman\b","rakan"),
      (r"\bketemu\b","bertemu"),
      (r"\bkarena\b","kerana"),
      (r"\bbahwa\b","bahawa"),
      (r"\bberbeda\b","berbeza"),
      (r"\bcoba\b","cuba"),
      (r"\bkapan\b","bila"),
      (r"\bsilakan\b","sila"),
      (r"\baktivitas\b","aktiviti"),
      (r"\bkualitas\b","kualiti"),
      (r"\buniversitas\b","universiti"),
      (r"\bberpikir\b","berfikir"),
      (r"\bpikirkan\b","fikirkan"),
      (r"\bpikir\b","fikir"),
      (r"\bngomong\b","bercakap"),
      (r"\bmembutuhkan\b","memerlukan"),
      (r"\bbutuh\b","perlu"),
      (r"\bkalian\b","anda semua"),
      (r"\bdulu\b","dahulu"),
      (r"\bbisa\b(?!\s+(?:ular|racun|sengat|beracun))","dapat"),
      (r"\bkantor\b","pejabat"),
      (r"\bkalimat\b","ayat"),
      (r"\bbis\b","bas"),
      (r"\b(?:nggak|enggak)\b","tidak"),
      (r"\bbanget\b","sangat"),
      (r"\bapotek\b","farmasi"),
      (r"\bbahasan\b","huraian"),
      (r"\bANA\b","sebarang")
    ]
    for pattern,replacement in replacements:
        text=re.sub(pattern,lambda match:replacement.capitalize() if match.group(0)[:1].isupper() else replacement,text,flags=re.IGNORECASE)
    if re.search(r"\b(?:aku|kamu|kau|khawatir|halo|ayolah|ayo|teman|ketemu|karena|bahwa|berbeda|coba|kapan|silakan|aktivitas|kualitas|universitas|berpikir|pikir|ngomong|membutuhkan|butuh|kalian|dulu|kantor|kalimat|bis|nggak|enggak|banget|apotek|bahasan|ana)\b",text,flags=re.IGNORECASE):
        raise RuntimeError("Indonesian-only wording remains after Malay normalisation: "+text)
    return clean(text)
def main():
    data=json.loads(INPUT.read_text(encoding="utf-8"))
    argostranslate.package.update_package_index()
    install_pair("en","ms")
    install_pair("zh","en")
    en_ms=translator("en","ms")
    zh_en=translator("zh","en")
    source_cache={}
    english_to_malay_cache={}
    def translate(value,source):
        value=clean(value)
        if not value:
            return ""
        source_key=(source,value)
        if source_key in source_cache:
            return source_cache[source_key]
        intermediate=clean(zh_en.translate(value)) if source=="zh" else value
        if intermediate not in english_to_malay_cache:
            english_to_malay_cache[intermediate]=normalise_malay(en_ms.translate(intermediate))
        result=english_to_malay_cache[intermediate]
        if not result:
            raise RuntimeError("Empty Malay translation for "+intermediate[:80])
        source_cache[source_key]=result
        return result
    output={
      "schemaVersion":1,
      "targetLanguage":"ms",
      "status":"machine_assisted_draft",
      "reviewerId":None,
      "humanReviewStatus":"pending",
      "modelLicensingStatus":"pending_verification",
      "modelLicensingNote":"Verify the exact Argos model-package and upstream corpus licences and preserve required attribution before public redistribution.",
      "generatedAt":datetime.now(timezone.utc).isoformat(),
      "engine":"Argos Translate offline models: en-ms 1.9; zh-en 1.9 followed by en-ms 1.9",
      "provenance":"Machine-assisted drafts generated from original SwiftDictionary lesson, Quiz and Flashcard text. Human Malaysian Standard Malay review is pending.",
      "lessons":{"en":{},"zh":{}},
      "quiz":{"en":{},"zh":{}},
      "flashcards":{"en":{},"zh":{}}
    }
    counts={"lesson_practices":0,"lesson_strings":0,"quiz_questions":0,"quiz_strings":0,"flashcards":0,"flashcard_strings":0}
    for code,items in data["lessons"].items():
        for lesson in items:
            rows=[]
            for practice in lesson["practices"]:
                q=translate(practice["question"],code)
                options=[translate(x,code) for x in practice["options"]]
                if not q or len(options)!=len(practice["options"]) or any(not x for x in options):
                    raise RuntimeError(f"Incomplete lesson practice translation: {code}/{lesson['id']}/{practice['index']}")
                rows.append({"q":q,"options":options})
                counts["lesson_practices"]+=1
                counts["lesson_strings"]+=1+len(options)
            output["lessons"][code][lesson["id"]]=rows
    for code,items in data["quiz"].items():
        for q in items:
            translated={
              "promptLearning":translate(q["promptLearning"],code),
              "promptTranslation":translate(q["promptTranslation"],"zh" if code=="en" else "en"),
              "explanationLearning":translate(q["explanationLearning"],code),
              "explanationTranslation":translate(q["explanationTranslation"],"zh" if code=="en" else "en"),
              "options":{}
            }
            for option in q["options"]:
                translated["options"][option["id"]]={
                  "learning":translate(option["learning"],code),
                  "translation":translate(option["translation"],"zh" if code=="en" else "en")
                }
            required=[translated[k] for k in ["promptLearning","promptTranslation","explanationLearning","explanationTranslation"]]
            if any(not x for x in required) or any(not x["learning"] or not x["translation"] for x in translated["options"].values()):
                raise RuntimeError("Incomplete Quiz translation: "+q["id"])
            output["quiz"][code][q["id"]]=translated
            counts["quiz_questions"]+=1
            counts["quiz_strings"]+=4+2*len(q["options"])
    for code,items in data.get("flashcards",{}).items():
        seen_words=set()
        for item in items:
            word=item["word"]
            if word in seen_words:
                raise RuntimeError("Duplicate Flashcard support inventory row: "+code+"/"+word)
            seen_words.add(word)
            definition_source=item.get("definitionSource",code)
            if definition_source not in ("en","zh"):
                raise RuntimeError("Invalid Flashcard definition source: "+code+"/"+word)
            definition=translate(item.get("definition",""),definition_source) if item.get("definition") else ""
            example=translate(item.get("example",""),code) if item.get("example") else ""
            if not definition:
                raise RuntimeError("Flashcard inventory row has no translated definition: "+code+"/"+word)
            output["flashcards"][code][word]={"definitionMs":definition,"exampleMs":example}
            counts["flashcards"]+=1
            counts["flashcard_strings"]+=1+(1 if example else 0)
    js="/* Generated Malay learning-support translations. Machine-assisted drafts; human review pending. */\n"
    js+="window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS = "+json.dumps(output,ensure_ascii=False,indent=2)+";\n"
    OUTPUT.write_text(js,encoding="utf-8")
    counts["unique_source_texts"]=len(source_cache)
    counts["unique_english_to_malay_texts"]=len(english_to_malay_cache)
    print(json.dumps({"counts":counts,"output_bytes":OUTPUT.stat().st_size,"status":output["status"]},ensure_ascii=False))

if __name__=="__main__":
    main()
