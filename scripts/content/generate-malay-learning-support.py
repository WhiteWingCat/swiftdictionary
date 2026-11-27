import json
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
            english_to_malay_cache[intermediate]=clean(en_ms.translate(intermediate))
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
      "generatedAt":datetime.now(timezone.utc).isoformat(),
      "engine":"Argos Translate offline models: en-ms 1.9; zh-en 1.9 followed by en-ms 1.9",
      "provenance":"Machine-assisted drafts generated from original SwiftDictionary lesson and Quiz text. Human Malaysian Standard Malay review is pending.",
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
        for item in items:
            definition=translate(item.get("definition",""),code) if item.get("definition") else ""
            example=translate(item.get("example",""),code) if item.get("example") else ""
            if not definition and not example:
                raise RuntimeError("Flashcard inventory row has no translated content: "+code+"/"+item["word"])
            output["flashcards"][code][item["word"]]={"definitionMs":definition,"exampleMs":example}
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
