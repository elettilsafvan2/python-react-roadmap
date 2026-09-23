// 42-Day Python + React Practical Fullstack Syllabus Data
// Enhanced with Interactive Quizzes, Run Sandbox & Subtask Checklists

const SYLLABUS_DATA = [
  {
    "id": "day-1",
    "day": 1,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Python Setup",
    "title": "Python & VS Code സെറ്റപ്പ് (Installation & First Script)",
    "summary": "കമ്പ്യൂട്ടറിൽ Python, VS Code ഇൻസ്റ്റാൾ ചെയ്യുകയും ആദ്യത്തെ കോഡ് റൺ ചെയ്യുകയും ചെയ്യുക.",
    "details": "തിയറി വായിക്കാതെ നേരിട്ട് കമ്പ്യൂട്ടറിൽ Python 3 ഇൻസ്റ്റാൾ ചെയ്യുക. VS Code-ൽ 'Python' എക്സ്റ്റൻഷൻ ആഡ് ചെയ്യുക. ടെർമിനലിൽ `python3 --version` എന്ന് അടിച്ച് ഇൻസ്റ്റാളേഷൻ ഉറപ്പാക്കുക.",
    "code": "# day1.py\nprint(\"Hello, Fullstack World!\")\n\n# ഇൻപുട്ട് വാങ്ങി ഔട്ട്പുട്ട് കാണിക്കുക\nname = input(\"നിങ്ങളുടെ പേര് എന്താണ്? \")\nprint(f\"സ്വാഗതം, {name}! നമുക്ക് പഠിച്ചു തുടങ്ങാം.\")",
    "codeLanguage": "python",
    "task": "VS Code തുറന്ന് ഒരു hello.py ഫയൽ ഉണ്ടാക്കി നിങ്ങളുടെ പേരും ലക്ഷ്യവും പ്രിന്റ് ചെയ്യുക.",
    "tip": "ടെർമിനൽ റൺ ചെയ്യാൻ VS Code-ൽ Ctrl + ` (ബാക്ക്ടിക്ക്) ഉപയോഗിക്കാം.",
    "resources": "python.org, VS Code Python Extension",
    "quiz": {
      "question": "Python-ൽ ടെക്സ്റ്റ് സ്ക്രീനിൽ കാണിക്കാൻ ഏത് ഫംഗ്ഷനാണ് ഉപയോഗിക്കുന്നത്?",
      "options": [
        "console.log()",
        "print()",
        "echo()",
        "System.out.print()"
      ],
      "correctIndex": 1,
      "explanation": "Python-ൽ ഔട്ട്പുട്ട് പ്രിന്റ് ചെയ്യാൻ built-in ഫംഗ്ഷനായ print() ആണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-1-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-1-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-1-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-2",
    "day": 2,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Variables & Types",
    "title": "വേരിയബിളുകളും ഡാറ്റാ ടൈപ്പുകളും (Variables & Data Types)",
    "summary": "വിവരങ്ങൾ കമ്പ്യൂട്ടർ മെമ്മറിയിൽ സൂക്ഷിക്കാൻ വേരിയബിളുകൾ ഉപയോഗിക്കുന്ന വിധം.",
    "details": "String (ടെക്സ്റ്റ്), Integer (പൂർണ്ണ സംഖ്യ), Float (ദശാംശം), Boolean (True/False) എന്നിവ മനസ്സിലാക്കുക. Python-ൽ ടൈപ്പ് പ്രത്യേകം പറയേണ്ടതില്ല (Dynamically typed).",
    "code": "# ഡാറ്റാ ടൈപ്പുകൾ\ncourse_name = \"Python + React Fullstack\"  # String\nduration_weeks = 6                         # Integer\nrating = 4.9                              # Float\nis_fun = True                             # Boolean\n\n# f-string ഉപയോഗിച്ച് പ്രിന്റ് ചെയ്യാം\nprint(f\"കോഴ്സ്: {course_name} | കാലാവധി: {duration_weeks} ആഴ്ചകൾ\")\nprint(f\"പഠനം രസകരമാണോ? {is_fun}\")",
    "codeLanguage": "python",
    "task": "ഒരു വ്യക്തിയുടെ പേര്, പ്രായം, പഠിക്കുന്ന കോഴ്സ് എന്നിവ സ്റ്റോർ ചെയ്ത് മനോഹരമായി പ്രിന്റ് ചെയ്യുന്ന ഒരു പ്രോഗ്രാം എഴുതുക.",
    "tip": "Python 3-ൽ f-string (f\"... {variable} ...\") ഫോർമാറ്റിംഗ് ആണ് ഏറ്റവും എളുപ്പമുള്ളതും ക്ലീനായതുമായ രീതി.",
    "resources": "Python Data Types Cheatsheet",
    "quiz": {
      "question": "Python 3-ൽ വേരിയബിളുകൾ സ്ട്രിംഗിനുള്ളിൽ എളുപ്പത്തിൽ ചേർക്കാൻ ഏറ്റവും മികച്ച രീതി ഏതാണ്?",
      "options": [
        "f-strings (f\"...\")",
        "printf()",
        "String.concat()",
        "% format only"
      ],
      "correctIndex": 0,
      "explanation": "Python 3-ൽ f-string (f\"ഹലോ {name}\") ആണ് ഏറ്റവും ക്ലീനും വേഗതയേറിയതുമായ ഫോർമാറ്റിംഗ്."
    },
    "subtasks": [
      {
        "id": "st-2-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-2-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-2-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-3",
    "day": 3,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Conditionals",
    "title": "കണ്ടീഷനുകൾ (if, elif, else & Operators)",
    "summary": "തീരുമാനങ്ങൾ എടുക്കാൻ കോഡിനെ പഠിപ്പിക്കുക (Logic Building).",
    "details": "ഒരു കണ്ടീഷൻ ശരിയാകുമ്പോൾ മാത്രം ഒരു ബ്ലോക്ക് കോഡ് പ്രവർത്തിപ്പിക്കാൻ if, elif, else ഉപയോഗിക്കുന്നു. Python ഇൻഡന്റേഷൻ (Indentation / 4 സ്പേസ്) വളരെ പ്രധാനമാണ്.",
    "code": "marks = int(input(\"നിങ്ങളുടെ മാർക്ക് നൽകുക (0-100): \"))\n\nif marks >= 90:\n    print(\"Grade: A+ (അടിപൊളി!)\")\nelif marks >= 75:\n    print(\"Grade: B (നല്ല പ്രകടനം)\")\nelif marks >= 50:\n    print(\"Grade: C (പാസ്സായിട്ടുണ്ട്)\")\nelse:\n    print(\"തോറ്റുപോയി, വിഷമിക്കേണ്ട വീണ്ടും ശ്രമിക്കുക!\")",
    "codeLanguage": "python",
    "task": "ഒരു ലളിതമായ പ്രായപരിശോധന പ്രോഗ്രാം (Age checker: ഡ്രൈവിംഗ് ലൈസൻസിന് അർഹതയുണ്ടോ ഇല്ലയോ എന്ന് പറയുന്ന കോഡ്) ഉണ്ടാക്കുക.",
    "tip": "Python-ൽ {} ബ്രാക്കറ്റുകൾക്ക് പകരം 4 സ്പേസ് തള്ളിയാണ് കോഡ് ബ്ലോക്ക് സൂചിപ്പിക്കുന്നത്.",
    "resources": "Python if/else logic",
    "quiz": {
      "question": "Python-ൽ if കണ്ടീഷൻ ശരിയായില്ലെങ്കിൽ അടുത്ത കണ്ടീഷൻ പരിശോധിക്കാൻ ഏത് കീവേഡ് ഉപയോഗിക്കുന്നു?",
      "options": [
        "else if",
        "elif",
        "then",
        "switch"
      ],
      "correctIndex": 1,
      "explanation": "Python-ൽ 'else if' എന്നതിന് പകരം 'elif' എന്നാണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-3-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-3-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-3-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-4",
    "day": 4,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Data Structures",
    "title": "പൈത്തൺ ലിസ്റ്റുകൾ (Lists & List Operations)",
    "summary": "ഒരു കൂട്ടം വിവരങ്ങൾ ക്രമമായി ഒരിടത്ത് സൂക്ഷിക്കാൻ Lists.",
    "details": "ലിസ്റ്റ് എന്നത് മാറ്റങ്ങൾ വരുത്താവുന്ന (Mutable) ഡാറ്റ കളക്ഷൻ ആണ്. ഐറ്റം ചേർക്കാൻ .append(), മാറ്റാൻ ഇൻഡക്സ് items[0], റിമൂവ് ചെയ്യാൻ .remove() അല്ലെങ്കിൽ pop() ഉപയോഗിക്കുന്നു.",
    "code": "# ലിസ്റ്റ് ഉണ്ടാക്കൽ\nskills = [\"HTML\", \"CSS\", \"Python\"]\n\n# പുതിയ സ്കിൽ ചേർക്കുന്നു\nskills.append(\"JavaScript\")\nskills.append(\"React\")\n\nprint(\"എന്റെ സ്കില്ലുകൾ:\", skills)\nprint(\"ആദ്യത്തെ സ്കിൽ:\", skills[0])\nprint(\"മൊത്തം സ്കില്ലുകൾ:\", len(skills))",
    "codeLanguage": "python",
    "task": "നിങ്ങൾ വാങ്ങാൻ ആഗ്രഹിക്കുന്ന 5 സാധനങ്ങളുടെ ഒരു ഷോപ്പിംഗ് ലിസ്റ്റ് ഉണ്ടാക്കി, അതിലേക്ക് പുതിയ ഒരെണ്ണം ആഡ് ചെയ്ത് പ്രിന്റ് ചെയ്യുക.",
    "tip": "Python-ൽ ഇൻഡക്സ് 0-ൽ നിന്നാണ് തുടങ്ങുന്നത്. അവസാനത്തെ ഐറ്റം കിട്ടാൻ skills[-1] ഉപയോഗിക്കാം.",
    "resources": "Python List Methods",
    "quiz": {
      "question": "Python ലിസ്റ്റിലേക്ക് പുതിയൊരു ഐറ്റം അവസാനമായി ചേർക്കാൻ ഏത് മെത്തേഡ് ഉപയോഗിക്കുന്നു?",
      "options": [
        "list.push()",
        "list.append()",
        "list.add()",
        "list.insert_end()"
      ],
      "correctIndex": 1,
      "explanation": "Python List-ലേക്ക് അവസാനം ഐറ്റം ആഡ് ചെയ്യാൻ .append() ആണ് ഉപയോഗിക്കുന്നത്. (JavaScript-ൽ ആണ് .push() ഉപയോഗിക്കുന്നത്)."
    },
    "subtasks": [
      {
        "id": "st-4-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-4-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-4-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-5",
    "day": 5,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Loops",
    "title": "ലൂപ്പുകൾ (for and while Loops)",
    "summary": "ഒരു കാര്യം വീണ്ടും വീണ്ടും ആവർത്തിക്കാൻ ലൂപ്പുകൾ ഉപയോഗിക്കാം.",
    "details": "ഒരു ലിസ്റ്റിലെ ഓരോ ഐറ്റവും എടുത്ത് വർക്ക് ചെയ്യാൻ for item in list: ലൂപ്പ് ഉപയോഗിക്കാം. നിശ്ചിത തവണ എണ്ണാൻ range() ഫംഗ്ഷൻ ഉപയോഗിക്കാം.",
    "code": "tasks = [\"പൈത്തൺ കോഡ് ചെയ്യുക\", \"ചായ കുടിക്കുക\", \"React പഠിക്കുക\", \"റിവ്യൂ ചെയ്യുക\"]\n\nprint(\"--- ഇന്നത്തെ ടാസ്കുകൾ ---\")\nfor index, task in enumerate(tasks, start=1):\n    print(f\"{index}. {task}\")\n\n# 1 മുതൽ 5 വരെയുള്ള സംഖ്യകൾ\nfor i in range(1, 6):\n    print(f\"സ്റ്റെപ്പ്: {i}\")",
    "codeLanguage": "python",
    "task": "1 മുതൽ 20 വരെയുള്ള സംഖ്യകളിൽ ഇരട്ട സംഖ്യകൾ (Even numbers) മാത്രം പ്രിന്റ് ചെയ്യുന്ന ഒരു ലൂപ്പ് എഴുതുക.",
    "tip": "enumerate(list) ഉപയോഗിച്ചാൽ ഐറ്റവും അതിന്റെ ക്രമനമ്പറും ഒരുമിച്ച് കിട്ടും.",
    "resources": "Python for loops",
    "quiz": {
      "question": "ഒരു ലിസ്റ്റിലെ ഓരോ ഐറ്റവും അതിന്റെ ഇൻഡക്സ് നമ്പറും ഒരുമിച്ച് കിട്ടാൻ ഏത് ഫംഗ്ഷൻ സഹായിക്കും?",
      "options": [
        "enumerate()",
        "range()",
        "counter()",
        "index_all()"
      ],
      "correctIndex": 0,
      "explanation": "for idx, item in enumerate(items): എന്ന് നൽകിയാൽ ഐറ്റത്തോടൊപ്പം അതിന്റെ ക്രമനമ്പറും ലഭിക്കും."
    },
    "subtasks": [
      {
        "id": "st-5-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-5-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-5-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-6",
    "day": 6,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1",
    "category": "Data Structures",
    "title": "ഡിക്ഷണറികൾ (Dictionaries - Key-Value Pairs)",
    "summary": "റിയൽ-വേൾഡ് ഡാറ്റ (JSON പോലെ) സൂക്ഷിക്കാൻ Dictionaries.",
    "details": "വെബ് ആപ്പുകളിൽ ബാക്ക്എൻഡിൽ നിന്ന് ഫ്രണ്ട്എൻഡിലേക്ക് അയക്കുന്ന ഡാറ്റ ഡിക്ഷണറി/JSON രൂപത്തിലാണ്. key: value ജോഡികളായാണ് ഇത് സൂക്ഷിക്കുന്നത്.",
    "code": "user_profile = {\n    \"id\": 101,\n    \"name\": \"നിങ്ങൾ\",\n    \"role\": \"Fullstack Developer\",\n    \"skills\": [\"Python\", \"Flask\", \"React\"],\n    \"is_active\": True\n}\n\n# വാല്യൂസ് എടുക്കൽ\nprint(f\"പേര്: {user_profile['name']}\")\nprint(f\"പ്രധാന സ്കിൽ: {user_profile['skills'][0]}\")\n\n# പുതിയ ഡാറ്റ ചേർക്കൽ\nuser_profile[\"country\"] = \"India\"\nprint(user_profile)",
    "codeLanguage": "python",
    "task": "ഒരു മൊബൈൽ ഫോണിന്റെ വിവരങ്ങൾ (Brand, Model, Price, Storage) അടങ്ങിയ ഒരു ഡിക്ഷണറി ഉണ്ടാക്കി അതിലെ വില അപ്‌ഡേറ്റ് ചെയ്യുക.",
    "tip": "കീ ഇല്ലെങ്കിൽ എറർ വരാതിരിക്കാൻ user_profile.get('age', 0) ഉപയോഗിക്കാം.",
    "resources": "Python Dictionaries & JSON",
    "quiz": {
      "question": "Python Dictionary-ൽ ഒരു കീ ഉണ്ടോ എന്ന് ഉറപ്പില്ലെങ്കിൽ എറർ വരാതെ വാല്യൂ എടുക്കാൻ ഏതാണ് നല്ലത്?",
      "options": [
        "dict[key]",
        "dict.get(key, default)",
        "dict.find(key)",
        "dict.value(key)"
      ],
      "correctIndex": 1,
      "explanation": "dict.get() ഉപയോഗിച്ചാൽ കീ ഇല്ലെങ്കിലും എറർ വരാതെ None അല്ലെങ്കിൽ നമ്മൾ നൽകുന്ന ഡിഫോൾട്ട് വാല്യൂ തിരികെ തരും."
    },
    "subtasks": [
      {
        "id": "st-6-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-6-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-6-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-7",
    "day": 7,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 1 Review",
    "category": "Review Project",
    "title": "വീക്ക് 1 മിനി പ്രോജക്റ്റ് (CLI Todo App in Python)",
    "summary": "പഠിച്ച ലിസ്റ്റുകളും ഡിക്ഷണറികളും ലൂപ്പുകളും വെച്ച് ഒരു ചെറിയ കമാൻഡ് ലൈൻ ടൂൾ.",
    "details": "ഇതുവരെ പഠിച്ച കാര്യങ്ങൾ ഒരുമിച്ച് ചേർത്ത് ഒരു ചെറിയ പ്രോജക്റ്റ് ചെയ്യുക. യൂസർക്ക് പുതിയ ടാസ്ക് ആഡ് ചെയ്യാനും, കാണാനും സാധിക്കുന്ന ഒരു പ്രോഗ്രാം.",
    "code": "# ലളിതമായ CLI Todo\ntodos = []\n\nwhile True:\n    print(\"\\n1. ടാസ്ക് ചേർക്കുക  2. കാണുക  3. പുറത്തുകടക്കുക\")\n    choice = input(\"തിരഞ്ഞെടുക്കുക: \")\n    \n    if choice == \"1\":\n        item = input(\"ടാസ്ക് എന്താണ്? \")\n        todos.append(item)\n        print(f\"'{item}' ചേർത്തു!\")\n    elif choice == \"2\":\n        print(\"\\nനിങ്ങളുടെ ടാസ്കുകൾ:\")\n        for idx, t in enumerate(todos, 1):\n            print(f\"{idx}. {t}\")\n    elif choice == \"3\":\n        print(\"നന്ദി, ബൈ!\")\n        break\n    else:\n        print(\"തെറ്റായ ഓപ്ഷൻ!\")",
    "codeLanguage": "python",
    "task": "ഈ കോഡ് നിങ്ങളുടെ VS Code-ൽ റൺ ചെയ്ത് സ്വയം പരീക്ഷിക്കുക.",
    "tip": "ഒരു കൺസെപ്റ്റ് പഠിച്ചാൽ ഉടൻ ചെറിയൊരു പ്രോജക്റ്റ് ഉണ്ടാക്കുന്നത് ഓർമ്മയിൽ നിൽക്കാൻ സഹായിക്കും.",
    "resources": "Python CLI Projects",
    "quiz": {
      "question": "ഒരു while loop എപ്പോൾ വരെയാണ് പ്രവർത്തിക്കുന്നത്?",
      "options": [
        "നിശ്ചിത തവണ മാത്രം",
        "നൽകിയ കണ്ടീഷൻ True ആയിരിക്കുന്നിടത്തോളം",
        "എപ്പോഴും ഒരു തവണ മാത്രം",
        "ലിസ്റ്റ് തീരുന്നത് വരെ"
      ],
      "correctIndex": 1,
      "explanation": "while loop-ലെ കണ്ടീഷൻ True ആയിരിക്കുന്നിടത്തോളം അത് വീണ്ടും വീണ്ടും പ്രവർത്തിച്ചു കൊണ്ടിരിക്കും. 'break' വഴി നിർത്താം."
    },
    "subtasks": [
      {
        "id": "st-7-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-7-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-7-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-8",
    "day": 8,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "Functions",
    "title": "ഫങ്ഷനുകൾ (Functions & Modular Code)",
    "summary": "കോഡ് ആവർത്തിക്കാതെ പുനരുപയോഗിക്കാൻ (Reusable Code) ഫങ്ഷനുകൾ.",
    "details": "def കീവേഡ് ഉപയോഗിച്ച് ഫങ്ഷൻ ഉണ്ടാക്കാം. ഇൻപുട്ട് പാരാമീറ്ററുകൾ നൽകാനും, return വഴി റിസൾട്ട് തിരികെ നൽകാനും പഠിക്കുക.",
    "code": "def calculate_discount(price, discount_percent):\n    \"\"\"വിലയിലെ ഡിസ്കൗണ്ട് കുറച്ച തുക കണക്കാക്കുന്നു\"\"\"\n    discount_amount = price * (discount_percent / 100)\n    final_price = price - discount_amount\n    return final_price\n\n# ഫങ്ഷൻ കോൾ ചെയ്യുന്നു\noffer_price = calculate_discount(1500, 20)\nprint(f\"ഓഫർ വില: ₹{offer_price}\")",
    "codeLanguage": "python",
    "task": "രണ്ട് സംഖ്യകൾ നൽകിയാൽ അവയുടെ തുകയും (Sum), ഗുണനഫലവും (Multiplication) നൽകുന്ന രണ്ട് ഫങ്ഷനുകൾ എഴുതുക.",
    "tip": "ഫങ്ഷനുകൾ എപ്പോഴും ഒരൊറ്റ ഉത്തരവാദിത്തം മാത്രം നിർവ്വഹിക്കാൻ ശ്രമിക്കുക (Single Responsibility).",
    "resources": "Python Functions",
    "quiz": {
      "question": "Python-ൽ ഒരു ഫങ്ഷൻ നിർവ്വചിക്കാൻ (define) ഉപയോഗിക്കുന്ന കീവേഡ് ഏതാണ്?",
      "options": [
        "function",
        "fn",
        "def",
        "func"
      ],
      "correctIndex": 2,
      "explanation": "Python-ൽ ഫങ്ഷനുകൾ 'def function_name():' എന്ന രീതിയിലാണ് ഡിഫൈൻ ചെയ്യുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-8-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-8-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-8-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-9",
    "day": 9,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "Modules & Packages",
    "title": "പൈത്തൺ മൊഡ്യൂളുകളും PIP പാക്കേജുകളും",
    "summary": "മറ്റുള്ളവർ ഉണ്ടാക്കിയ കോഡുകൾ (Libraries) നമ്മുടെ പ്രോജക്റ്റിൽ ഉപയോഗിക്കാൻ.",
    "details": "Python built-in modules (random, math, datetime, json) കൂടാതെ external packages ഇൻസ്റ്റാൾ ചെയ്യാൻ pip install ഉപയോഗിക്കുന്നത് പഠിക്കുക.",
    "code": "import datetime\nimport random\nimport json\n\n# ഇന്നത്തെ തീയതി\ntoday = datetime.date.today()\nprint(\"ഇന്നത്തെ തീയതി:\", today)\n\n# റാണ്ടം നമ്പർ\nlucky_number = random.randint(1, 100)\nprint(\"ഇന്നത്തെ ലക്കി നമ്പർ:\", lucky_number)\n\n# Python dict-നെ JSON string ആക്കുന്നു\ndata = {\"status\": \"success\", \"code\": 200}\njson_string = json.dumps(data)\nprint(\"JSON ഡാറ്റ:\", json_string)",
    "codeLanguage": "python",
    "task": "random മൊഡ്യൂൾ ഉപയോഗിച്ച് ഒരു ലളിതമായ Guess the Number ഗെയിം ഉണ്ടാക്കുക.",
    "tip": "ടെർമിനലിൽ pip --version അടിച്ച് pip ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക.",
    "resources": "Python Standard Library",
    "quiz": {
      "question": "Python-ൽ മറ്റൊരു ഫയലിലെ അല്ലെങ്കിൽ മൊഡ്യൂളിലെ കോഡ് എടുക്കാൻ ഏത് കീവേഡ് ഉപയോഗിക്കുന്നു?",
      "options": [
        "include",
        "require",
        "import",
        "using"
      ],
      "correctIndex": 2,
      "explanation": "Python-ൽ ലൈബ്രറികളും മൊഡ്യൂളുകളും കൊണ്ടുവരാൻ 'import module_name' ആണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-9-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-9-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-9-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-10",
    "day": 10,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "Virtual Environments",
    "title": "Virtual Environment (venv) സെറ്റപ്പ്",
    "summary": "ഓരോ പ്രോജക്റ്റിനും വേണ്ട ലൈബ്രറികൾ വേർതിരിച്ചു വെക്കാൻ venv.",
    "details": "പ്രോജക്റ്റുകൾ കൂട്ടിമുട്ടാതിരിക്കാൻ പൈത്തണിൽ വെർച്വൽ എൻവയോൺമെന്റ് നിർബന്ധമാണ്. python3 -m venv env ഉണ്ടാക്കലും ആക്ടിവേറ്റ് ചെയ്യലും പഠിക്കുക.",
    "code": "# Mac/Linux ടെർമിനലിൽ:\npython3 -m venv myenv\nsource myenv/bin/activate\n\n# Windows PowerShell-ൽ:\n# python -m venv myenv\n# myenv\\Scripts\\activate\n\n# venv ആക്റ്റീവ് ആയാൽ ടെർമിനലിൽ (myenv) എന്ന് കാണാം!\npip install flask",
    "codeLanguage": "bash",
    "task": "നിങ്ങളുടെ കമ്പ്യൂട്ടറിൽ ഒരു പുതിയ ഫോൾഡർ ഉണ്ടാക്കി അതിൽ myenv സെറ്റപ്പ് ചെയ്ത് ആക്റ്റീവ് ആക്കുക.",
    "tip": "venv ആക്റ്റീവ് ആയാൽ ഇൻസ്റ്റാൾ ചെയ്യുന്ന ലൈബ്രറികൾ സിസ്റ്റം മുഴുവൻ ബാധിക്കാതെ ആ ഫോൾഡറിൽ മാത്രം നിൽക്കും.",
    "resources": "Python venv documentation",
    "quiz": {
      "question": "എന്തിനാണ് പൈത്തണിൽ Virtual Environment (venv) ഉപയോഗിക്കുന്നത്?",
      "options": [
        "കോഡ് വേഗത്തിൽ ഓടിക്കാൻ",
        "ഓരോ പ്രോജക്റ്റിലെയും ലൈബ്രറികൾ തമ്മിൽ കൂട്ടിമുട്ടാതെ വേർതിരിച്ചു വെക്കാൻ",
        "പൈത്തൺ ഇൻസ്റ്റാൾ ചെയ്യാൻ",
        "ഡാറ്റാബേസ് ഉണ്ടാക്കാൻ"
      ],
      "correctIndex": 1,
      "explanation": "ഓരോ പ്രോജക്റ്റിനും ആവശ്യമായ ലൈബ്രറികൾ സുരക്ഷിതമായി പ്രത്യേകം സൂക്ഷിക്കാനാണ് venv ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-10-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-10-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-10-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-11",
    "day": 11,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "Flask Backend",
    "title": "ആദ്യത്തെ വെബ് സെർവർ (Hello Flask!)",
    "summary": "പൈത്തൺ വെച്ച് ലോക്കൽ വെബ് സെർവർ റൺ ചെയ്യുക.",
    "details": "ഫ്ലാസ്ക് (Flask) ഒരു ലൈറ്റ്വെയിറ്റ് പൈത്തൺ വെബ് ഫ്രെയിംവർക്ക് ആണ്. ബ്രൗസറിൽ നിങ്ങൾ ഒരു ലിങ്ക് അടിക്കുമ്പോൾ റിക്വസ്റ്റ് സ്വീകരിച്ച് മറുപടി കൊടുക്കാൻ Flask സെർവറിന് കഴിയും.",
    "code": "# app.py\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route(\"/\")\ndef home():\n    return \"<h1>ഹലോ! ഇത് എന്റെ ആദ്യത്തെ പൈത്തൺ വെബ് സെർവർ ആണ്!</h1>\"\n\n@app.route(\"/about\")\ndef about():\n    return \"<p>ഞാൻ പൈത്തൺ + റിയാക്ട് ഫുൾസ്റ്റാക്ക് പഠിക്കുകയാണ്.</p>\"\n\nif __name__ == \"__main__\":\n    app.run(debug=True, port=5000)",
    "codeLanguage": "python",
    "task": "ഈ കോഡ് app.py എന്ന് സേവ് ചെയ്ത് റൺ ചെയ്യുക. ബ്രൗസറിൽ http://127.0.0.1:5000 തുറന്ന് നോക്കുക.",
    "tip": "debug=True നൽകിയാൽ കോഡ് സേവ് ചെയ്യുമ്പോൾ സെർവർ തനിയെ റീസ്റ്റാർട്ട് ആകും.",
    "resources": "Flask Quickstart Guide",
    "quiz": {
      "question": "Flask-ൽ ഒരു URL റൂട്ട് നിർവ്വചിക്കാൻ ഉപയോഗിക്കുന്ന ഡെക്കറേറ്റർ ഏതാണ്?",
      "options": [
        "@app.route('/path')",
        "@app.get('/path')",
        "@route.create()",
        "@flask.url()"
      ],
      "correctIndex": 0,
      "explanation": "Flask-ൽ '@app.route('/url')' ഡെക്കറേറ്റർ വെച്ചാണ് ഏത് ലിങ്കിലാണ് ആ ഫങ്ഷൻ വർക്ക് ചെയ്യേണ്ടതെന്ന് പറയുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-11-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-11-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-11-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-12",
    "day": 12,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "REST API",
    "title": "ആദ്യത്തെ REST API (JSON Response)",
    "summary": "റിയാക്റ്റിന് വായിക്കാൻ പാകത്തിൽ JSON ഡാറ്റ നൽകുന്ന API നിർമ്മിക്കുക.",
    "details": "ഫ്രണ്ട്എൻഡും ബാക്ക്എൻഡും സംസാരിക്കുന്നത് JSON (JavaScript Object Notation) ഭാഷയിലാണ്. Flask-ൽ jsonify ഉപയോഗിച്ച് എളുപ്പത്തിൽ JSON API റിട്ടേൺ ചെയ്യാം.",
    "code": "from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n# ഡാറ്റാബേസിന് പകരമുള്ള സാമ്പിൾ ഡാറ്റ\ncourses = [\n    {\"id\": 1, \"title\": \"Python Basics\", \"status\": \"Completed\"},\n    {\"id\": 2, \"title\": \"Flask Backend\", \"status\": \"In Progress\"},\n    {\"id\": 3, \"title\": \"React Frontend\", \"status\": \"Upcoming\"}\n]\n\n@app.route(\"/api/courses\", methods=[\"GET\"])\ndef get_courses():\n    return jsonify({\n        \"success\": True,\n        \"count\": len(courses),\n        \"data\": courses\n    })\n\nif __name__ == \"__main__\":\n    app.run(debug=True, port=5000)",
    "codeLanguage": "python",
    "task": "സെർവർ റൺ ചെയ്ത് http://127.0.0.1:5000/api/courses ബ്രൗസറിൽ ഓപ്പൺ ചെയ്ത് JSON ഡാറ്റ കാണുക.",
    "tip": "ബ്രൗസറിൽ JSON ഭംഗിയായി കാണാൻ 'JSON Viewer' ക്രോം എക്സ്റ്റൻഷൻ ഉപയോഗിക്കാം.",
    "resources": "REST API Basics",
    "quiz": {
      "question": "ഫ്രണ്ട്എൻഡും ബാക്ക്എൻഡും പരസ്പരം വിവരങ്ങൾ കൈമാറാൻ സാധാരണയായി ഉപയോഗിക്കുന്ന ഫോർമാറ്റ് ഏതാണ്?",
      "options": [
        "XML മാത്രം",
        "JSON (JavaScript Object Notation)",
        "TXT ഫയൽ",
        "CSV"
      ],
      "correctIndex": 1,
      "explanation": "ആധുനിക വെബ് ഡെവലപ്‌മെന്റിൽ REST API വഴി ഡാറ്റ കൈമാറാൻ ഏറ്റവും കൂടുതൽ ഉപയോഗിക്കുന്നത് JSON ഫോർമാറ്റാണ്."
    },
    "subtasks": [
      {
        "id": "st-12-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-12-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-12-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-13",
    "day": 13,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Week 2",
    "category": "REST API",
    "title": "POST Requests (ഡാറ്റ സെർവറിലേക്ക് അയക്കൽ)",
    "summary": "യൂസർ ഫോമിൽ ടൈപ്പ് ചെയ്ത ഡാറ്റ സ്വീകരിച്ച് സൂക്ഷിക്കുക.",
    "details": "GET എന്നത് ഡാറ്റ വായിക്കാനും, POST എന്നത് പുതിയ ഡാറ്റ സെർവറിലേക്ക് അയക്കാനും ഉപയോഗിക്കുന്നു. request.get_json() വഴി വരുന്ന ഡാറ്റ എടുക്കാം.",
    "code": "from flask import Flask, request, jsonify\n\napp = Flask(__name__)\ntodos = [{\"id\": 1, \"task\": \"പൈത്തൺ പഠിക്കുക\"}]\n\n@app.route(\"/api/todos\", methods=[\"GET\"])\ndef get_todos():\n    return jsonify(todos)\n\n@app.route(\"/api/todos\", methods=[\"POST\"])\ndef add_todo():\n    data = request.get_json()\n    new_todo = {\n        \"id\": len(todos) + 1,\n        \"task\": data.get(\"task\")\n    }\n    todos.append(new_todo)\n    return jsonify({\"message\": \"ചേർത്തു!\", \"todo\": new_todo}), 201\n\nif __name__ == \"__main__\":\n    app.run(debug=True, port=5000)",
    "codeLanguage": "python",
    "task": "Postman അല്ലെങ്കിൽ VS Code Thunder Client ഉപയോഗിച്ച് POST റിക്വസ്റ്റ് അയച്ചു നോക്കുക.",
    "tip": "VS Code-ൽ 'Thunder Client' എന്ന ഫ്രീ എക്സ്റ്റൻഷൻ വഴി API ഈസിയായി ടെസ്റ്റ് ചെയ്യാം.",
    "resources": "HTTP Methods: GET vs POST",
    "quiz": {
      "question": "സെർവറിലേക്ക് പുതിയൊരു ഡാറ്റ അയക്കാനും സേവ് ചെയ്യാനും ഉപയോഗിക്കുന്ന HTTP മെത്തേഡ് ഏതാണ്?",
      "options": [
        "GET",
        "POST",
        "FETCH",
        "READ"
      ],
      "correctIndex": 1,
      "explanation": "ഡാറ്റ വായിക്കാൻ GET മെത്തേഡും, പുതിയ ഡാറ്റ സെർവറിലേക്ക് സമർപ്പിക്കാൻ POST മെത്തേഡുമാണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-13-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-13-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-13-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-14",
    "day": 14,
    "phase": 1,
    "phaseTitle": "Phase 1: Python Basics & Backend",
    "week": "Phase 1 Milestone",
    "category": "Backend Capstone",
    "title": "CORS ഉം ബാക്ക്എൻഡ് പൂർത്തീകരണവും (Flask CORS Setup)",
    "summary": "മറ്റൊരു പോർട്ടിൽ ഓടുന്ന React-ന് നമ്മുടെ API-യിൽ നിന്ന് ഡാറ്റ കൊടുക്കാൻ CORS അനുമതി നൽകുക.",
    "details": "സുരക്ഷാ കാരണങ്ങളാൽ ബ്രൗസറുകൾ പോർട്ട് 3000-ൽ നിന്ന് പോർട്ട് 5000-ലേക്ക് തനിയെ ഡാറ്റ എടുക്കാൻ സമ്മതിക്കില്ല (CORS Error). ഇതിന് flask-cors ഉപയോഗിക്കുന്നു.",
    "code": "# pip install flask-cors\nfrom flask import Flask, jsonify\nfrom flask_cors import CORS\n\napp = Flask(__name__)\nCORS(app)  # എല്ലാ ഫ്രണ്ട്എൻഡുകൾക്കും API ലഭ്യമാക്കുന്നു\n\n@app.route(\"/api/status\")\ndef status():\n    return jsonify({\"status\": \"Backend Ready for React!\", \"phase\": 1})\n\nif __name__ == \"__main__\":\n    app.run(debug=True, port=5000)",
    "codeLanguage": "python",
    "task": "flask-cors ഇൻസ്റ്റാൾ ചെയ്ത് നിങ്ങളുടെ ഫ്ലാസ്ക് ആപ്പിൽ CORS എനേബിൾ ചെയ്യുക.",
    "tip": "Phase 1 പൂർത്തിയായി! നിങ്ങൾക്ക് പൈത്തൺ അടിസ്ഥാനങ്ങളും സ്വന്തമായി ഒരു API ഉണ്ടാക്കാനും അറിയാം. അഭിനന്ദനങ്ങൾ!",
    "resources": "Flask-CORS documentation",
    "quiz": {
      "question": "എന്തുകൊണ്ടാണ് ഫ്രണ്ട്എൻഡിൽ നിന്ന് ബാക്ക്എൻഡിലേക്ക് റിക്വസ്റ്റ് അയക്കുമ്പോൾ CORS എറർ വരുന്നത്?",
      "options": [
        "ഇന്റർനെറ്റ് ഇല്ലാത്തതുകൊണ്ട്",
        "വ്യത്യസ്ത പോർട്ടുകളിലോ ഡൊമെയ്നുകളിലോ സുരക്ഷിതമല്ലാതെ ഡാറ്റ എടുക്കുന്നത് ബ്രൗസർ തടയുന്നത് കൊണ്ട്",
        "പൈത്തൺ സ്ലോ ആയതുകൊണ്ട്",
        "ഡാറ്റാബേസ് ഇല്ലാത്തതുകൊണ്ട്"
      ],
      "correctIndex": 1,
      "explanation": "സുരക്ഷ മുൻനിർത്തി ബ്രൗസറുകൾ വ്യത്യസ്ത ഒറിജിനുകൾ തമ്മിലുള്ള കമ്മ്യൂണിക്കേഷൻ തടയുന്നു. ഇതിന് Flask-ൽ flask-cors എനേബിൾ ചെയ്യണം."
    },
    "subtasks": [
      {
        "id": "st-14-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-14-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-14-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-15",
    "day": 15,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "Modern JS",
    "title": "മോഡേൺ ജാവാസ്ക്രിപ്റ്റ് (let, const & Arrow Functions)",
    "summary": "റിയാക്റ്റിന് അത്യാവശ്യമായ ആധുനിക ES6 ഫീച്ചറുകൾ മാത്രം വേഗത്തിൽ പഠിക്കുക.",
    "details": "ജാവാസ്ക്രിപ്റ്റ് മുഴുവൻ പഠിച്ച് സമയം കളയേണ്ടതില്ല. റിയാക്റ്റിൽ എപ്പോഴും ഉപയോഗിക്കുന്ന let, const, അമ്പടയാള ഫംഗ്ഷനുകൾ (Arrow Functions) എന്നിവ മനസ്സിലാക്കുക.",
    "code": "// വേരിയബിളുകൾ\nconst appName = \"React Learner\"; // മാറ്റാൻ പാടില്ലാത്തത്\nlet currentDay = 15;             // മാറ്റാവുന്ന വാല്യൂ\n\n// സാധാരണ ഫങ്ഷൻ\nfunction sayHello(name) {\n  return \"ഹലോ \" + name;\n}\n\n// മോഡേൺ Arrow Function (React-ൽ ഉപയോഗിക്കുന്നത്)\nconst sayHi = (name) => `ഹലോ ${name}! സ്വാഗതം!`;\n\nconsole.log(sayHi(\"സുഹൃത്തേ\"));",
    "codeLanguage": "javascript",
    "task": "രണ്ട് സംഖ്യകൾ ഗുണിക്കുന്ന ഒരു Arrow Function എഴുതി ബ്രൗസർ കൺസോളിൽ പ്രിന്റ് ചെയ്യുക.",
    "tip": "ബ്രൗസറിൽ F12 അല്ലെങ്കിൽ Inspect അടിച്ച് 'Console' ടാബിൽ നിങ്ങൾക്ക് JS കോഡ് നേരിട്ട് ടെസ്റ്റ് ചെയ്യാം.",
    "resources": "ES6 Arrow Functions MDN",
    "quiz": {
      "question": "ജാവാസ്ക്രിപ്റ്റിൽ ഒരിക്കലും മാറ്റാൻ പാടില്ലാത്ത വേരിയബിളുകൾ ഉണ്ടാക്കാൻ ഏത് കീവേഡ് ഉപയോഗിക്കുന്നു?",
      "options": [
        "var",
        "let",
        "const",
        "fixed"
      ],
      "correctIndex": 2,
      "explanation": "'const' ഉപയോഗിച്ച് ഡിക്ലയർ ചെയ്യുന്ന വേരിയബിളുകളുടെ വാല്യൂ പിന്നീട് മാറ്റാൻ (reassign) സാധിക്കില്ല."
    },
    "subtasks": [
      {
        "id": "st-15-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-15-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-15-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-16",
    "day": 16,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "Modern JS",
    "title": "അറേ മെത്തേഡുകൾ (map & filter)",
    "summary": "റിയാക്റ്റിൽ ലിസ്റ്റുകൾ കാണിക്കാൻ ഏറ്റവും കൂടുതൽ ഉപയോഗിക്കുന്ന map.",
    "details": "ഒരു കൂട്ടം ഡാറ്റയെ HTML ഘടകങ്ങളാക്കി മാറ്റാൻ റിയാക്റ്റിൽ for ലൂപ്പിന് പകരം .map() ആണ് ഉപയോഗിക്കുന്നത്. ഡാറ്റ സെർച്ച് ചെയ്യാനും ഒഴിവാക്കാനും .filter() ഉപയോഗിക്കുന്നു.",
    "code": "const numbers = [1, 2, 3, 4, 5];\n\n// ഓരോ സംഖ്യയെയും ഇരട്ടിയാക്കുന്നു (map)\nconst doubled = numbers.map(num => num * 2);\nconsole.log(\"Doubled:\", doubled); // [2, 4, 6, 8, 10]\n\n// ഇരട്ട സംഖ്യകൾ മാത്രം എടുക്കുന്നു (filter)\nconst evens = numbers.filter(num => num % 2 === 0);\nconsole.log(\"Evens:\", evens); // [2, 4]",
    "codeLanguage": "javascript",
    "task": "സാധനങ്ങളുടെ വിലകളുടെ ഒരു അറേ ഉണ്ടാക്കി, 100 രൂപയ്ക്ക് മുകളിലുള്ളവ മാത്രം .filter() ചെയ്യുക.",
    "tip": "React JSX-ൽ ലിസ്റ്റ് റെൻഡർ ചെയ്യാൻ 99% സമയത്തും .map() ആണ് ഉപയോഗിക്കുന്നത്.",
    "resources": "JavaScript Array Methods",
    "quiz": {
      "question": "ഒരു അറേയിലെ ഓരോ ഐറ്റത്തെയും മാറ്റി പുതിയൊരു അറേ ഉണ്ടാക്കാൻ റിയാക്റ്റിൽ ഏറ്റവും കൂടുതൽ ഉപയോഗിക്കുന്ന മെത്തേഡ് ഏതാണ്?",
      "options": [
        ".forEach()",
        ".map()",
        ".push()",
        ".filter()"
      ],
      "correctIndex": 1,
      "explanation": "React JSX-ൽ ലിസ്റ്റുകൾ റെൻഡർ ചെയ്യാൻ .map() മെത്തേഡാണ് ഉപയോഗിക്കുന്നത്. ഇത് ഓരോ ഐറ്റത്തിനും അനുയോജ്യമായ JSX തിരികെ നൽകും."
    },
    "subtasks": [
      {
        "id": "st-16-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-16-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-16-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-17",
    "day": 17,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "Modern JS",
    "title": "ഡീസ്ട്രക്ചറിംഗും സ്പ്രെഡ് ഓപ്പറേറ്ററും (Destructuring & Spread)",
    "summary": "ഒബ്‌ജക്റ്റിൽ നിന്നും അറേയിൽ നിന്നും ഡാറ്റ എളുപ്പത്തിൽ വലിച്ചെടുക്കൽ.",
    "details": "React Props കൈകാര്യം ചെയ്യുമ്പോൾ Destructuring അത്യാവശ്യമാണ്. const { name, age } = user; അതുപോലെ അറേ അല്ലെങ്കിൽ ഒബ്ജക്റ്റ് കോപ്പി ചെയ്യാൻ ... (Spread) ഉപയോഗിക്കുന്നു.",
    "code": "const user = { name: \"അൻവർ\", role: \"Dev\", city: \"Kochi\" };\n\n// Destructuring (ലളിതമായി വേരിയബിളുകളാക്കാം)\nconst { name, role } = user;\nconsole.log(`${name} ഒരു ${role} ആണ്`);\n\n// Spread Operator (...)\nconst skills = [\"Python\", \"Flask\"];\nconst updatedSkills = [...skills, \"React\", \"Tailwind\"];\nconsole.log(updatedSkills);",
    "codeLanguage": "javascript",
    "task": "ഒരു കാറിന്റെ വിവരങ്ങൾ അടങ്ങിയ ഒബ്ജക്റ്റിൽ നിന്ന് ബ്രാൻഡും മോഡലും Destructure ചെയ്ത് പ്രിന്റ് ചെയ്യുക.",
    "tip": "... ഓപ്പറേറ്റർ React-ൽ സ്റ്റേറ്റ് അപ്‌ഡേറ്റ് ചെയ്യുമ്പോൾ പുതിയ ഒബ്ജക്റ്റ് ഉണ്ടാക്കാൻ ഉപയോഗിക്കുന്നു.",
    "resources": "Destructuring Assignment MDN",
    "quiz": {
      "question": "React Props എപ്പോഴും ഏത് തരത്തിലുള്ളതാണ്?",
      "options": [
        "Mutable (മാറ്റാൻ കഴിയുന്നത്)",
        "Read-only (വായിക്കാൻ മാത്രം കഴിയുന്നത്)",
        "Global",
        "Private"
      ],
      "correctIndex": 1,
      "explanation": "Props എപ്പോഴും Read-only ആണ്. ചൈൽഡ് കമ്പോണന്റിൽ ഇരുന്ന് Props നേരിട്ട് മാറ്റാൻ പാടില്ല."
    },
    "subtasks": [
      {
        "id": "st-17-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-17-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-17-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-18",
    "day": 18,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "Vite & React Setup",
    "title": "ആദ്യത്തെ റിയാക്ട് ആപ്പ് (Vite + React Setup)",
    "summary": "Vite ടൂൾ ഉപയോഗിച്ച് സൂപ്പർ ഫാസ്റ്റായി ഒരു React പ്രോജക്റ്റ് ആരംഭിക്കുക.",
    "details": "പഴയ Create-React-App ഉപേക്ഷിക്കുക, ഇപ്പോൾ ഇൻഡസ്ട്രിയിൽ ഏറ്റവും വേഗതയേറിയ ടൂളാണ് Vite. Node.js ഇൻസ്റ്റാൾ ചെയ്ത ശേഷം ഒറ്റ കമാൻഡ് കൊണ്ട് ആപ്പ് റെഡിയാക്കാം.",
    "code": "# ടെർമിനലിൽ അടിക്കുക:\nnpm create vite@latest my-react-app -- --template react\n\n# ഫോൾഡറിലേക്ക് മാറുക:\ncd my-react-app\n\n# ഡിപൻഡൻസികൾ ഇൻസ്റ്റാൾ ചെയ്യുക:\nnpm install\n\n# ആപ്പ് റൺ ചെയ്യുക:\nnpm run dev\n# ഇനി ബ്രൗസറിൽ http://localhost:5173 തുറക്കുക!",
    "codeLanguage": "bash",
    "task": "നിങ്ങളുടെ കമ്പ്യൂട്ടറിൽ Vite വഴി ഒരു പുതിയ React ആപ്പ് ഉണ്ടാക്കി ബ്രൗസറിൽ റൺ ചെയ്ത് നോക്കുക.",
    "tip": "Node.js ഇല്ലെങ്കിൽ nodejs.org-ൽ നിന്ന് LTS വേർഷൻ ഇൻസ്റ്റാൾ ചെയ്യുക.",
    "resources": "Vitejs.dev Guide",
    "quiz": {
      "question": "നിലവിൽ React പ്രോജക്റ്റുകൾ ഏറ്റവും വേഗത്തിൽ ബിൽഡ് ചെയ്യാനും റൺ ചെയ്യാനും ഇൻഡസ്ട്രിയിൽ ഉപയോഗിക്കുന്ന ടൂൾ ഏതാണ്?",
      "options": [
        "Create React App",
        "Vite",
        "Webpack CLI",
        "Grunt"
      ],
      "correctIndex": 1,
      "explanation": "ആധുനിക വെബ്ബ് വികസനത്തിൽ Create-React-App കാലഹരണപ്പെട്ടു; Vite ആണ് മിന്നൽ വേഗതയുള്ള ആധുനിക ടൂൾ."
    },
    "subtasks": [
      {
        "id": "st-18-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-18-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-18-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-19",
    "day": 19,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "React Basics",
    "title": "കമ്പോണന്റുകളും JSX ഉം (Components & JSX)",
    "summary": "വെബ്‌സൈറ്റിനെ ലെഗോ ബ്ലോക്കുകൾ (Lego blocks) പോലെ ഭാഗങ്ങളാക്കി മാറ്റൽ.",
    "details": "React-ൽ എല്ലാം കമ്പോണന്റുകളാണ് (Header, Card, Button). JSX എന്നാൽ ജാവാസ്ക്രിപ്റ്റിന്റെ ഉള്ളിൽ HTML എഴുതുന്ന രസകരമായ രീതിയാണ്.",
    "code": "// src/Header.jsx\nfunction Header() {\n  return (\n    <header style={{ padding: \"20px\", background: \"#1e1e2f\", color: \"white\" }}>\n      <h1>എന്റെ പോർട്ട്‌ഫോളിയോ</h1>\n      <p>Python & React Fullstack Developer</p>\n    </header>\n  );\n}\n\nexport default Header;",
    "codeLanguage": "javascript",
    "task": "ഒരു ProfileCard.jsx കമ്പോണന്റ് ഉണ്ടാക്കി അതിൽ നിങ്ങളുടെ പേരും ഫോട്ടോയും ഒരു ബട്ടണും വെക്കുക.",
    "tip": "JSX-ൽ class എന്നതിന് പകരം className എന്നാണ് ഉപയോഗിക്കേണ്ടത്.",
    "resources": "React JSX in Detail",
    "quiz": {
      "question": "React JSX-ൽ HTML 'class' എന്നതിന് പകരം എന്താണ് ഉപയോഗിക്കുന്നത്?",
      "options": [
        "class",
        "className",
        "styleClass",
        "cssClass"
      ],
      "correctIndex": 1,
      "explanation": "ജാവാസ്ക്രിപ്റ്റിൽ 'class' എന്നത് റിസർവ്ഡ് കീവേഡ് ആയതുകൊണ്ട് JSX-ൽ 'className' എന്നാണ് നൽകേണ്ടത്."
    },
    "subtasks": [
      {
        "id": "st-19-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-19-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-19-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-20",
    "day": 20,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3",
    "category": "React Basics",
    "title": "പ്രോപ്സ് വഴി ഡാറ്റ കൈമാറൽ (React Props)",
    "summary": "ഒരു പേരന്റ് കമ്പോണന്റിൽ നിന്ന് ചൈൽഡ് കമ്പോണന്റിലേക്ക് ഡാറ്റ നൽകുക.",
    "details": "Props എന്നാൽ കമ്പോണന്റുകൾക്ക് നൽകുന്ന ഇൻപുട്ട് വിവരങ്ങളാണ്. ഒരേ കമ്പോണന്റ് വെച്ച് വ്യത്യസ്ത ഡാറ്റ കാണിക്കാൻ Props സഹായിക്കുന്നു.",
    "code": "// SkillBadge.jsx\nfunction SkillBadge({ name, level }) {\n  return (\n    <div style={{ border: \"1px solid #ccc\", padding: \"10px\", margin: \"5px\" }}>\n      <h4>{name}</h4>\n      <small>ലെവൽ: {level}</small>\n    </div>\n  );\n}\n\n// App.jsx-ൽ ഉപയോഗിക്കുന്ന വിധം:\n// <SkillBadge name=\"Python\" level=\"Intermediate\" />\n// <SkillBadge name=\"React\" level=\"Beginner\" />",
    "codeLanguage": "javascript",
    "task": "ഒരു CourseCard കമ്പോണന്റ് ഉണ്ടാക്കി ടൈറ്റിലും വിലയും Props ആയി പാസ്സ് ചെയ്തു കാണിക്കുക.",
    "tip": "Props എപ്പോഴും Read-only ആണ്, അതിനെ നേരിട്ട് മാറ്റാൻ ശ്രമിക്കരുത്.",
    "resources": "React Props Documentation",
    "quiz": {
      "question": "React-ൽ ഒരു കമ്പോണന്റിലേക്ക് വിവരങ്ങൾ പുറത്തുനിന്ന് നൽകാൻ എന്ത് ഉപയോഗിക്കുന്നു?",
      "options": [
        "Props (Properties)",
        "State",
        "Hooks",
        "Redux"
      ],
      "correctIndex": 0,
      "explanation": "പേരന്റ് കമ്പോണന്റിൽ നിന്ന് ചൈൽഡ് കമ്പോണന്റിലേക്ക് ഡാറ്റ നൽകാൻ Props ഉപയോഗിക്കുന്നു."
    },
    "subtasks": [
      {
        "id": "st-20-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-20-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-20-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-21",
    "day": 21,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 3 Review",
    "category": "React Lists",
    "title": "ലിസ്റ്റുകൾ റെൻഡർ ചെയ്യലും key പ്രോപ്പർട്ടിയും",
    "summary": "അറേയിലെ ഡാറ്റ കമ്പോണന്റുകളാക്കി മാറ്റാൻ .map() ഉപയോഗിക്കുക.",
    "details": "ഒരു അറേ ഓഫ് ഒബ്ജക്റ്റുകൾ എടുത്ത് JSX-ലേക്ക് മാപ്പ് ചെയ്യുക. React ഓരോ എലമെന്റിനെയും തിരിച്ചറിയാൻ ഒരു യുണീക്ക് key പ്രോപ്പർട്ടി ആവശ്യപ്പെടുന്നു.",
    "code": "function SkillList() {\n  const skills = [\n    { id: 1, title: \"Python\" },\n    { id: 2, title: \"Flask\" },\n    { id: 3, title: \"React\" }\n  ];\n\n  return (\n    <ul>\n      {skills.map((skill) => (\n        <li key={skill.id}>{skill.title}</li>\n      ))}\n    </ul>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "5 പുസ്തകങ്ങളുടെ പേരുകളുള്ള ഒരു ലിസ്റ്റ് ഉണ്ടാക്കി React-ൽ മനോഹരമായി റെൻഡർ ചെയ്യുക.",
    "tip": "എപ്പോഴും ഓരോ ഐറ്റത്തിനും key={item.id} നൽകാൻ മറക്കരുത്.",
    "resources": "Rendering Lists in React",
    "quiz": {
      "question": "React-ൽ .map() ഉപയോഗിച്ച് ലിസ്റ്റുകൾ റെൻഡർ ചെയ്യുമ്പോൾ ഓരോ എലമെന്റിനും നിർബന്ധമായും നൽകേണ്ട പ്രോപ്പർട്ടി ഏതാണ്?",
      "options": [
        "id",
        "key",
        "index",
        "name"
      ],
      "correctIndex": 1,
      "explanation": "React വെർച്വൽ ഡോമിന് മാറ്റങ്ങൾ വേഗത്തിൽ തിരിച്ചറിയാൻ ഓരോ ലിസ്റ്റ് ഐറ്റത്തിനും യുണീക്കായ 'key' പ്രോപ്പർട്ടി അത്യാവശ്യമാണ്."
    },
    "subtasks": [
      {
        "id": "st-21-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-21-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-21-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-22",
    "day": 22,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "React State",
    "title": "സ്റ്റേറ്റ് മാനേജ്‌മെന്റ് (Introduction to useState)",
    "summary": "സ്ക്രീനിലെ മാറ്റങ്ങൾ തത്സമയം കാണിക്കാൻ State.",
    "details": "ഒരു സാധാരണ വേരിയബിൾ മാറിയാൽ സ്ക്രീൻ റീ-റെൻഡർ ആകില്ല. എന്നാൽ React-ന്റെ useState മാറുമ്പോൾ UI തനിയെ അപ്‌ഡേറ്റ് ആകുന്നു.",
    "code": "import { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div style={{ textAlign: \"center\", padding: \"20px\" }}>\n      <h2>കൗണ്ടർ: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>കൂട്ടുക (+)</button>\n      <button onClick={() => setCount(count - 1)} style={{ marginLeft: \"10px\" }}>\n        കുറയ്ക്കുക (-)\n      </button>\n    </div>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "ഈ Counter കമ്പോണന്റ് ഉണ്ടാക്കി ഒരു 'Reset' ബട്ടൺ കൂടി ആഡ് ചെയ്യുക.",
    "tip": "setCount ഉപയോഗിക്കുമ്പോൾ മാത്രമേ സ്ക്രീൻ പുതിയ വാല്യൂവോടെ റീഫ്രഷ് ആകൂ.",
    "resources": "React useState Hook",
    "quiz": {
      "question": "React-ൽ ഒരു വേരിയബിളിന്റെ വാല്യൂ മാറുമ്പോൾ സ്ക്രീൻ തനിയെ റീ-റെൻഡർ ആകാൻ ഏത് ഹുക്ക് ഉപയോഗിക്കുന്നു?",
      "options": [
        "useEffect",
        "useState",
        "useRef",
        "useMemo"
      ],
      "correctIndex": 1,
      "explanation": "കമ്പോണന്റിൽ ഡാറ്റാ മാറ്റങ്ങൾ തത്സമയം സ്ക്രീനിൽ പ്രതിഫലിപ്പിക്കാൻ useState ഹുക്കാണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-22-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-22-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-22-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-23",
    "day": 23,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "React State",
    "title": "ഫോമുകളും ഇൻപുട്ട് ഹാൻഡ്‌ലിംഗും (Controlled Inputs)",
    "summary": "യൂസർ ടൈപ്പ് ചെയ്യുന്നത് State-ലേക്ക് എടുക്കുക.",
    "details": "HTML ഇൻപുട്ടിൽ ടൈപ്പ് ചെയ്യുമ്പോൾ onChange വഴി അത് React State-ൽ സ്റ്റോർ ചെയ്ത് കൈകാര്യം ചെയ്യുന്ന രീതി (Controlled Components).",
    "code": "import { useState } from \"react\";\n\nfunction NameGreeter() {\n  const [name, setName] = useState(\"\");\n\n  return (\n    <div>\n      <input\n        type=\"text\"\n        placeholder=\"നിങ്ങളുടെ പേര് ടൈപ്പ് ചെയ്യുക\"\n        value={name}\n        onChange={(e) => setName(e.target.value)}\n      />\n      <p>ഹലോ, {name || \"സുഹൃത്തേ\"}!</p>\n    </div>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "ഒരു ഇൻപുട്ട് ബോക്സും ബട്ടണും വെച്ച്, ബട്ടൺ ഞെക്കുമ്പോൾ മാത്രം പേര് കാണിക്കുന്ന ഒരു ഫോം ഉണ്ടാക്കുക.",
    "tip": "e.target.value വഴിയാണ് ഇൻപുട്ടിൽ ടൈപ്പ് ചെയ്ത അക്ഷരങ്ങൾ കിട്ടുന്നത്.",
    "resources": "React Form Handling",
    "quiz": {
      "question": "React ഇൻപുട്ട് ഫീൽഡിൽ യൂസർ ടൈപ്പ് ചെയ്യുന്ന അക്ഷരങ്ങൾ എങ്ങനെയാണ് ലഭിക്കുന്നത്?",
      "options": [
        "e.target.value",
        "e.input.text",
        "document.getValue()",
        "e.data"
      ],
      "correctIndex": 0,
      "explanation": "onChange ഇവന്റിലെ ഇവന്റ് ഒബ്ജക്റ്റിൽ നിന്ന് 'e.target.value' വഴിയാണ് ടൈപ്പ് ചെയ്ത ടെക്സ്റ്റ് ലഭിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-23-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-23-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-23-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-24",
    "day": 24,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "React Projects",
    "title": "React Todo App (Adding & Deleting Items)",
    "summary": "State-ലേക്ക് പുതിയ ഐറ്റങ്ങൾ ചേർക്കാനും കളയാനും പഠിക്കുക.",
    "details": "Array State എങ്ങനെ അപ്‌ഡേറ്റ് ചെയ്യാം (setTodos([...todos, newTodo])) എന്നും, ഒരു ഐറ്റം എങ്ങനെ ഡിലീറ്റ് ചെയ്യാം (.filter()) എന്നും മനസ്സിലാക്കുക.",
    "code": "import { useState } from \"react\";\n\nfunction MiniTodo() {\n  const [todos, setTodos] = useState([\"പൈത്തൺ പഠിച്ചു\", \"റിയാക്ട് ആരംഭിച്ചു\"]);\n  const [input, setInput] = useState(\"\");\n\n  const addTodo = () => {\n    if (!input.trim()) return;\n    setTodos([...todos, input]);\n    setInput(\"\");\n  };\n\n  const removeTodo = (indexToDelete) => {\n    setTodos(todos.filter((_, idx) => idx !== indexToDelete));\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map((todo, idx) => (\n          <li key={idx}>\n            {todo} <button onClick={() => removeTodo(idx)}>❌</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "ഈ Todo കോഡ് ചെയ്ത് ഓരോ ടാസ്കിനും പൂർത്തിയായെങ്കിൽ 'Done' എന്ന് സ്ട്രൈക്ക് ത്രൂ (<s>) ആവുന്ന ഫീച്ചർ ചേർക്കുക.",
    "tip": "സ്റ്റേറ്റ് അറേ മാറ്റുമ്പോൾ നിലവിലുള്ള അറേ നേരിട്ട് മാറ്റാതെ പുതിയൊരു അറേ ഉണ്ടാക്കണം ([...todos, newItem]).",
    "resources": "Updating Arrays in React State",
    "quiz": {
      "question": "React-ൽ State അറേയിലേക്ക് പുതിയൊരു ഐറ്റം ചേർക്കാൻ അനുയോജ്യമായ രീതി ഏതാണ്?",
      "options": [
        "todos.push(newItem)",
        "setTodos([...todos, newItem])",
        "setTodos(todos.add(newItem))",
        "todos = newItem"
      ],
      "correctIndex": 1,
      "explanation": "React സ്റ്റേറ്റ് നേരിട്ട് മ്യൂട്ടേറ്റ് ചെയ്യരുത് (No direct mutation). സ്പ്രെഡ് ഓപ്പറേറ്റർ (...) ഉപയോഗിച്ച് പുതിയ അറേ നൽകണം."
    },
    "subtasks": [
      {
        "id": "st-24-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-24-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-24-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-25",
    "day": 25,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "React Hooks",
    "title": "useEffect Hook & Lifecycle",
    "summary": "കമ്പോണന്റ് ലോഡ് ആകുമ്പോൾ കോഡ് റൺ ചെയ്യാൻ useEffect.",
    "details": "പേജ് ലോഡ് ആകുമ്പോൾ ബാക്ക്എൻഡിൽ നിന്ന് ഡാറ്റ കൊണ്ടുവരാനോ അല്ലെങ്കിൽ ലോക്കൽ സ്റ്റോറേജ് ചെക്ക് ചെയ്യാനോ useEffect ഉപയോഗിക്കുന്നു.",
    "code": "import { useState, useEffect } from \"react\";\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    console.log(\"കമ്പോണന്റ് സ്ക്രീനിൽ വന്നു!\");\n    const interval = setInterval(() => {\n      setSeconds((prev) => prev + 1);\n    }, 1000);\n\n    // ക്ലീനപ്പ് ഫംഗ്ഷൻ\n    return () => clearInterval(interval);\n  }, []); // [] നൽകിയാൽ തുടക്കത്തിൽ ഒരു തവണ മാത്രം റൺ ചെയ്യും\n\n  return <h3>ഓടിയ സെക്കൻഡുകൾ: {seconds}</h3>;\n}",
    "codeLanguage": "javascript",
    "task": "പേജ് ലോഡ് ആകുമ്പോൾ ബ്രൗസറിന്റെ ടൈറ്റിലിൽ 'സ്വാഗതം!' എന്ന് മാറ്റുന്ന ഒരു useEffect എഴുതുക (document.title = ...).",
    "tip": "ഡിപൻഡൻസി അറേ [] കാലിയായി നൽകിയാൽ ആ കമ്പോണന്റ് മൗണ്ട് ആകുമ്പോൾ ഒരൊറ്റ തവണ മാത്രമേ ആ കോഡ് റൺ ചെയ്യൂ.",
    "resources": "React useEffect Guide",
    "quiz": {
      "question": "ഒരു React കമ്പോണന്റ് സ്ക്രീനിൽ ആദ്യമായി ലോഡ് ആകുമ്പോൾ മാത്രം ഒരു കോഡ് റൺ ചെയ്യാൻ useEffect-ന്റെ ഡിപൻഡൻസി അറേയിൽ എന്ത് നൽകണം?",
      "options": [
        "യാതൊന്നും നൽകരുത്",
        "ശൂന്യമായ അറേ ([])",
        "[null]",
        "[true]"
      ],
      "correctIndex": 1,
      "explanation": "useEffect-ൽ ഡിപൻഡൻസി അറേ കാലിയായി ([]) നൽകിയാൽ കമ്പോണന്റ് മൗണ്ട് ആകുമ്പോൾ ഒരൊറ്റ തവണ മാത്രമേ അത് റൺ ചെയ്യൂ."
    },
    "subtasks": [
      {
        "id": "st-25-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-25-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-25-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-26",
    "day": 26,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "React Styling",
    "title": "മോഡേൺ CSS & സ്റ്റൈലിംഗ് (CSS Modules & Flexbox)",
    "summary": "നിങ്ങളുടെ റിയാക്റ്റ് ആപ്പിന് പ്രൊഫഷണൽ ലുക്ക് നൽകുക.",
    "details": "CSS ക്ലാസുകൾ കമ്പോണന്റുകൾക്ക് നൽകി മനോഹരമായ കാർഡുകളും ഗ്രിഡുകളും ഉണ്ടാക്കുക. Flexbox ഉപയോഗിച്ച് എലമെന്റുകൾ കൃത്യമായി സെന്റർ ചെയ്യുക.",
    "code": "/* Card.css */\n.card-container {\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);\n  padding: 24px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  transition: transform 0.2s ease;\n}\n\n.card-container:hover {\n  transform: translateY(-4px);\n}",
    "codeLanguage": "css",
    "task": "നിങ്ങളുടെ പ്രോജക്റ്റിൽ ഒരു ഡാർക്ക് മോഡ് കാർഡിന് വേണ്ട CSS സ്റ്റൈലുകൾ എഴുതി നോക്കുക.",
    "tip": "മോഡേൺ വെബ് ഡിസൈനിൽ border-radius, സൂക്ഷ്മമായ box-shadow, ക്ലീൻ പാഡിംഗ് എന്നിവ പ്രീമിയം ലുക്ക് നൽകും.",
    "resources": "CSS Flexbox in 15 Minutes",
    "quiz": {
      "question": "CSS-ൽ എലമെന്റുകൾ കൃത്യമായി സെന്റർ ചെയ്യാനും നിരയായി ക്രമീകരിക്കാനും ഏറ്റവും മികച്ച ലേഔട്ട് ഏതാണ്?",
      "options": [
        "Table",
        "Flexbox (display: flex)",
        "Float",
        "Inline-block"
      ],
      "correctIndex": 1,
      "explanation": "Flexbox (display: flex; justify-content: center; align-items: center;) ആണ് മോഡേൺ എലമെന്റ് അലൈൻമെന്റിന് ഉത്തമം."
    },
    "subtasks": [
      {
        "id": "st-26-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-26-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-26-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-27",
    "day": 27,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Week 4",
    "category": "Client Storage",
    "title": "ലോക്കൽ സ്റ്റോറേജ് (localStorage Persistence)",
    "summary": "റീഫ്രഷ് ചെയ്താലും ഡാറ്റ മാഞ്ഞുപോകാതെ ബ്രൗസറിൽ സൂക്ഷിക്കുക.",
    "details": "localStorage.setItem() ഉം localStorage.getItem() ഉം ഉപയോഗിച്ച് യൂസറുടെ വിവരങ്ങളും ടാസ്കുകളും ബ്രൗസറിൽ സേവ് ചെയ്തു വെക്കാൻ പഠിക്കുക.",
    "code": "// ഡാറ്റ സേവ് ചെയ്യാൻ\nconst saveToBrowser = (key, data) => {\n  localStorage.setItem(key, JSON.stringify(data));\n};\n\n// ഡാറ്റ തിരിച്ചെടുക്കാൻ\nconst getFromBrowser = (key) => {\n  const saved = localStorage.getItem(key);\n  return saved ? JSON.parse(saved) : null;\n};",
    "codeLanguage": "javascript",
    "task": "നിങ്ങളുടെ മുൻപത്തെ Todo ആപ്പിൽ ടാസ്കുകൾ ലോക്കൽ സ്റ്റോറേജിലേക്ക് സേവ് ചെയ്ത് റീഫ്രഷ് ചെയ്താലും കാണുന്ന രീതിയിലേക്ക് അപ്‌ഡേറ്റ് ചെയ്യുക.",
    "tip": "ലോക്കൽ സ്റ്റോറേജിൽ സ്ട്രിംഗ് മാത്രമേ സേവ് ചെയ്യാൻ പറ്റൂ, അതിനാൽ JSON.stringify() ചെയ്യണം.",
    "resources": "Window.localStorage MDN",
    "quiz": {
      "question": "ബ്രൗസർ റീഫ്രഷ് ചെയ്താലും ഡാറ്റ നിലനിർത്താൻ ക്ലയന്റ് സൈഡിൽ ഏതാണ് ഉപയോഗിക്കുന്നത്?",
      "options": [
        "RAM",
        "localStorage",
        "Session cache only",
        "TempFiles"
      ],
      "correctIndex": 1,
      "explanation": "Window.localStorage ഉപയോഗിച്ച് യൂസറുടെ ബ്രൗസറിൽ പെർമനെന്റായി ഡാറ്റ സൂക്ഷിക്കാം."
    },
    "subtasks": [
      {
        "id": "st-27-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-27-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-27-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-28",
    "day": 28,
    "phase": 2,
    "phaseTitle": "Phase 2: Modern JavaScript & React",
    "week": "Phase 2 Milestone",
    "category": "React Milestone",
    "title": "Phase 2 പൂർത്തീകരണം (React Portfolio Shell)",
    "summary": "നിങ്ങൾ ഇതുവരെ ചെയ്ത എല്ലാ കമ്പോണന്റുകളും ചേർത്തുവെച്ച് ഒരു റിയാക്റ്റ് വെബ് ഷെൽ.",
    "details": "Header, Skills list, Interactive Todo, About Me സെക്ഷനുകൾ അടങ്ങിയ ഒരു ഫ്രണ്ട്എൻഡ് ഡാഷ്‌ബോർഡ് പൂർത്തിയാക്കുക.",
    "code": "// App.jsx\nimport Header from \"./Header\";\nimport SkillList from \"./SkillList\";\nimport MiniTodo from \"./MiniTodo\";\n\nfunction App() {\n  return (\n    <div className=\"app-layout\">\n      <Header />\n      <main>\n        <SkillList />\n        <MiniTodo />\n      </main>\n    </div>\n  );\n}\n\nexport default App;",
    "codeLanguage": "javascript",
    "task": "ഒരു പൂർണ്ണമായ ഫ്രണ്ട്എൻഡ് ആപ്പ് റൺ ചെയ്ത് കാണുക.",
    "tip": "ഗംഭീരം! നിങ്ങൾ React അടിസ്ഥാനങ്ങളും State-ഉം വിജയകരമായി പൂർത്തിയാക്കി. ഇനി ബാക്ക്എൻഡും ഫ്രണ്ട്എൻഡും പരസ്പരം കണക്റ്റ് ചെയ്യാം!",
    "resources": "React Developer Roadmap",
    "quiz": {
      "question": "ഒരു വലിയ React ആപ്ലിക്കേഷനിൽ ആപ്പ് ലേഔട്ട് വൃത്തിയായി ക്രമീകരിക്കാൻ എന്ത് രീതിയാണ് സ്വീകരിക്കുന്നത്?",
      "options": [
        "എല്ലാം ഒരൊറ്റ ഫയലിൽ എഴുതുക",
        "Header, Sidebar, Main, Footer എന്നിവയെ പ്രത്യേക കമ്പോണന്റുകളാക്കി വിഭജിക്കുക",
        "HTML ഫയലുകൾ ലിങ്ക് ചെയ്യുക",
        "Inline styles മാത്രം ഉപയോഗിക്കുക"
      ],
      "correctIndex": 1,
      "explanation": "റീയൂസബിൾ ആയ പ്രത്യേക കമ്പോണന്റുകളാക്കി വിഭജിക്കുന്നതാണ് React-ന്റെ പ്രധാന കരുത്ത്."
    },
    "subtasks": [
      {
        "id": "st-28-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-28-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-28-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-29",
    "day": 29,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "API Integration",
    "title": "പൈത്തൺ ബാക്ക്എൻഡിലേക്ക് React കണക്റ്റ് ചെയ്യൽ (fetch / axios)",
    "summary": "React-ൽ നിന്ന് Flask API വിളിച്ചു ഡാറ്റ സ്ക്രീനിൽ കാണിക്കുക.",
    "details": "ബ്രൗസറിലെ built-in fetch() ഉപയോഗിച്ച് Flask സെർവറിലെ /api/status അല്ലെങ്കിൽ /api/courses എൻഡ്പോയിന്റിൽ നിന്ന് ഡാറ്റ വാങ്ങി റിയാക്റ്റ് സ്റ്റേറ്റിൽ വെക്കുക.",
    "code": "import { useState, useEffect } from \"react\";\n\nfunction CourseViewer() {\n  const [courses, setCourses] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(\"http://127.0.0.1:5000/api/courses\")\n      .then((res) => res.json())\n      .then((data) => {\n        setCourses(data.data);\n        setLoading(false);\n      })\n      .catch((err) => console.error(\"Error:\", err));\n  }, []);\n\n  if (loading) return <p>ഡാറ്റ ലോഡ് ആകുന്നു...</p>;\n\n  return (\n    <div>\n      <h3>പൈത്തൺ സെർവറിൽ നിന്ന് കിട്ടിയ കോഴ്സുകൾ:</h3>\n      <ul>\n        {courses.map((c) => (\n          <li key={c.id}>{c.title} - <b>{c.status}</b></li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "Flask സെർവർ ഓൺ ചെയ്തു വെക്കുക, React-ൽ നിന്ന് fetch വിളിച്ച് ഡാറ്റ കാണിക്കുക.",
    "tip": "CORS എറർ വന്നാൽ Flask-ൽ CORS(app) ഇട്ടിട്ടുണ്ടോ എന്ന് ഉറപ്പുവരുത്തുക.",
    "resources": "Using Fetch API with React",
    "quiz": {
      "question": "React-ൽ നിന്ന് ബാക്ക്എൻഡ് REST API-യിലേക്ക് HTTP റിക്വസ്റ്റ് അയക്കാൻ ബ്രൗസറിലുള്ള ബിൽറ്റ്-ഇൻ API ഏതാണ്?",
      "options": [
        "fetch()",
        "http.get()",
        "curl()",
        "request()"
      ],
      "correctIndex": 0,
      "explanation": "ആധുനിക ബ്രൗസറുകളിൽ എക്സ്റ്റേണൽ ലൈബ്രറികൾ ഇല്ലാതെ തന്നെ ഡാറ്റ ഫെച്ച് ചെയ്യാൻ ബിൽറ്റ്-ഇൻ fetch() API ഉണ്ട്."
    },
    "subtasks": [
      {
        "id": "st-29-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-29-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-29-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-30",
    "day": 30,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "Fullstack CRUD",
    "title": "React ഫോമിൽ നിന്ന് Flask-ലേക്ക് ഡാറ്റ അയക്കൽ (POST from UI)",
    "summary": "React-ൽ യൂസർ ടൈപ്പ് ചെയ്യുന്നത് പൈത്തൺ സെർവറിലേക്ക് അയച്ചു സേവ് ചെയ്യുക.",
    "details": "React ഫോമിലെ onSubmit ഇവന്റിൽ fetch(url, { method: 'POST', body: JSON.stringify(...) }) ഉപയോഗിച്ച് ഡാറ്റ ബാക്ക്എൻഡിലേക്ക് അയക്കുക.",
    "code": "const handleAddTodo = async (newText) => {\n  const response = await fetch(\"http://127.0.0.1:5000/api/todos\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify({ task: newText })\n  });\n\n  const savedData = await response.json();\n  console.log(\"സെർവർ മറുപടി:\", savedData);\n  // UI അപ്‌ഡേറ്റ് ചെയ്യുക\n};",
    "codeLanguage": "javascript",
    "task": "React ഇൻപുട്ടിൽ ഒരു ടാസ്ക് ടൈപ്പ് ചെയ്ത് ബട്ടൺ ഞെക്കുമ്പോൾ അത് പൈത്തൺ സെർവറിൽ പ്രിന്റ് ആകുന്നുണ്ടോ എന്ന് പരിശോധിക്കുക.",
    "tip": "POST ചെയ്യുമ്പോൾ headers: { 'Content-Type': 'application/json' } നൽകാൻ മറക്കരുത്.",
    "resources": "Fullstack POST Requests",
    "quiz": {
      "question": "React-ൽ നിന്ന് POST റിക്വസ്റ്റ് വഴി JSON അയക്കുമ്പോൾ ഹെഡറിൽ ഏതാണ് ഉൾപ്പെടുത്തേണ്ടത്?",
      "options": [
        "'Content-Type': 'application/json'",
        "'Accept': 'text/html'",
        "'Type': 'post'",
        "'Data': 'json'"
      ],
      "correctIndex": 0,
      "explanation": "നമ്മൾ അയക്കുന്നത് JSON ഡാറ്റയാണെന്ന് സെർവറിന് മനസ്സിലാവാൻ Content-Type: application/json നൽകണം."
    },
    "subtasks": [
      {
        "id": "st-30-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-30-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-30-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-31",
    "day": 31,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "Database",
    "title": "ഡാറ്റാബേസ് പരിചയം (SQLite & SQLAlchemy ORM)",
    "summary": "സെർവർ ഓഫ് ചെയ്താലും ഡാറ്റ പോകാതിരിക്കാൻ സ്ഥിരമായ ഡാറ്റാബേസ്.",
    "details": "പൈത്തണിന്റെ കൂടെ തന്നെയുള്ള ലളിതമായ ഫയൽ ഡാറ്റാബേസ് ആണ് SQLite. ഇത് ഉപയോഗിക്കാൻ അധികം സെറ്റപ്പ് ആവശ്യമില്ല. Flask-SQLAlchemy വഴി പൈത്തൺ ക്ലാസുകൾ ടേബിളുകളാക്കാം.",
    "code": "# pip install flask-sqlalchemy\nfrom flask import Flask\nfrom flask_sqlalchemy import SQLAlchemy\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'\ndb = SQLAlchemy(app)\n\n# ടേബിൾ മോഡൽ\nclass Task(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    title = db.Column(db.String(200), nullable=False)\n    done = db.Column(db.Boolean, default=False)\n\n# ഡാറ്റാബേസ് ഉണ്ടാക്കുന്നു\nwith app.app_context():\n    db.create_all()",
    "codeLanguage": "python",
    "task": "ഈ കോഡ് റൺ ചെയ്യുമ്പോൾ നിങ്ങളുടെ ഫോൾഡറിൽ database.db എന്ന ഫയൽ വരുന്നത് കാണുക.",
    "tip": "SQLite തുടക്കക്കാർക്ക് ഏറ്റവും മികച്ച ചോയ്‌സ് ആണ്; സെർവർ ഇൻസ്റ്റാൾ ചെയ്യേണ്ടതില്ല, ഒരു ഫയൽ മാത്രം മതി!",
    "resources": "Flask-SQLAlchemy Documentation",
    "quiz": {
      "question": "തുടക്കക്കാർക്ക് സെർവർ ഇൻസ്റ്റാൾ ചെയ്യാതെ തന്നെ ഒരൊറ്റ ഫയലിൽ ഉപയോഗിക്കാൻ പറ്റിയ ലളിതമായ റിലേഷണൽ ഡാറ്റാബേസ് ഏതാണ്?",
      "options": [
        "Oracle Enterprise",
        "SQLite",
        "Hadoop",
        "Cassandra"
      ],
      "correctIndex": 1,
      "explanation": "SQLite ഒരൊറ്റ ഫയലിലാണ് ഡാറ്റ സൂക്ഷിക്കുന്നത്. സെർവർ കോൺഫിഗറേഷൻ ആവശ്യമില്ലാത്തതിനാൽ തുടക്കക്കാർക്ക് ഏറ്റവും അനുയോജ്യമാണ്."
    },
    "subtasks": [
      {
        "id": "st-31-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-31-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-31-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-32",
    "day": 32,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "Fullstack CRUD",
    "title": "പൂർണ്ണമായ CRUD API (Create, Read, Update, Delete)",
    "summary": "ഒരു യഥാർത്ഥ ബാക്ക്എൻഡിന് വേണ്ട 4 പ്രധാന കാര്യങ്ങൾ ഡാറ്റാബേസിൽ ചെയ്യുക.",
    "details": "Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE) എന്നീ നാല് പ്രവർത്തനങ്ങൾ Flask + SQLite വെച്ച് ചെയ്യുക.",
    "code": "@app.route(\"/api/tasks/<int:id>\", methods=[\"DELETE\"])\ndef delete_task(id):\n    task = Task.query.get_or_404(id)\n    db.session.delete(task)\n    db.session.commit()\n    return jsonify({\"message\": \"ടാസ്ക് നീക്കം ചെയ്തു!\"})\n\n@app.route(\"/api/tasks/<int:id>\", methods=[\"PUT\"])\ndef toggle_task(id):\n    task = Task.query.get_or_404(id)\n    task.done = not task.done\n    db.session.commit()\n    return jsonify({\"message\": \"സ്റ്റാറ്റസ് മാറ്റി!\", \"done\": task.done})",
    "codeLanguage": "python",
    "task": "ഒരു ടാസ്ക് ഡിലീറ്റ് ചെയ്യാനും 'Done' സ്റ്റാറ്റസ് മാറ്റാനുമുള്ള റൂട്ടുകൾ പൂർത്തിയാക്കുക.",
    "tip": "ഡാറ്റാബേസിൽ മാറ്റങ്ങൾ വരുത്തുമ്പോൾ db.session.commit() വിളിക്കാൻ വിട്ടുപോകരുത്.",
    "resources": "REST API CRUD Operations",
    "quiz": {
      "question": "CRUD എന്നതിന്റെ പൂർണ്ണരൂപം എന്താണ്?",
      "options": [
        "Compile, Run, Update, Deploy",
        "Create, Read, Update, Delete",
        "Connect, Route, Unload, Disconnect",
        "Client, Router, URL, Database"
      ],
      "correctIndex": 1,
      "explanation": "ഒരു ഡാറ്റാബേസ് സിസ്റ്റത്തിലെ പ്രധാന 4 പ്രവർത്തനങ്ങളാണ് Create (POST), Read (GET), Update (PUT), Delete (DELETE)."
    },
    "subtasks": [
      {
        "id": "st-32-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-32-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-32-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-33",
    "day": 33,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "Error Handling",
    "title": "എറർ ഹാൻഡ്‌ലിംഗും ലോഡിംഗ് സ്റ്റേറ്റുകളും (UX Polish)",
    "summary": "സെർവർ ഡൗൺ ആയാലോ എറർ വന്നാലോ യൂസർക്ക് മനോഹരമായ മെസ്സേജ് നൽകുക.",
    "details": "നെറ്റ്‌വർക്ക് പോയാൽ സ്ക്രീൻ ഫ്രീസ് ആവാതിരിക്കാൻ try...catch ഉപയോഗിക്കുക. ഡാറ്റ വരുന്നത് വരെ സ്പിന്നറോ ലോഡിംഗ് സ്കെലിറ്റണോ കാണിക്കുക.",
    "code": "const [error, setError] = useState(null);\nconst [isLoading, setIsLoading] = useState(false);\n\nconst fetchData = async () => {\n  setIsLoading(true);\n  setError(null);\n  try {\n    const res = await fetch(\"http://127.0.0.1:5000/api/tasks\");\n    if (!res.ok) throw new Error(\"സെർവറിൽ നിന്ന് ഡാറ്റ കിട്ടിയില്ല!\");\n    const data = await res.json();\n    setTasks(data);\n  } catch (err) {\n    setError(err.message);\n  } finally {\n    setIsLoading(false);\n  }\n};",
    "codeLanguage": "javascript",
    "task": "നിങ്ങളുടെ ആപ്പിൽ സെർവർ ഓഫ് ആയിരിക്കുമ്പോൾ 'സെർവർ ബന്ധം നഷ്ടപ്പെട്ടു' എന്ന് ചുവന്ന നിറത്തിൽ മുന്നറിയിപ്പ് നൽകുന്ന കണ്ടീഷൻ വെക്കുക.",
    "tip": "നല്ലൊരു ഡെവലപ്പർ എപ്പോഴും എററുകൾ പ്രതീക്ഷിച്ചു കോഡ് എഴുതും.",
    "resources": "Handling Async Errors in React",
    "quiz": {
      "question": "JavaScript-ൽ അസിൻക്രണസ് (Async) കോഡുകളിൽ വരുന്ന എററുകൾ കൈകാര്യം ചെയ്യാൻ ഏത് ബ്ലോക്ക് ഉപയോഗിക്കുന്നു?",
      "options": [
        "if...else",
        "try...catch",
        "check...fail",
        "verify...error"
      ],
      "correctIndex": 1,
      "explanation": "നെറ്റ്‌വർക്ക് തകരാറുകളോ എററുകളോ ഉണ്ടായാൽ വെബ്‌സൈറ്റ് ക്രാഷ് ആവാതിരിക്കാൻ try...catch ബ്ലോക്കിൽ എററുകൾ പിടിച്ചെടുക്കുന്നു."
    },
    "subtasks": [
      {
        "id": "st-33-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-33-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-33-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-34",
    "day": 34,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5",
    "category": "Git & Version Control",
    "title": "Git & GitHub-ലേക്ക് കോഡ് പുഷ് ചെയ്യൽ",
    "summary": "നിങ്ങളുടെ പ്രോജക്റ്റുകൾ സുരക്ഷിതമായി GitHub-ൽ സൂക്ഷിക്കുക (റെസ്യൂമേയ്ക്ക് അത്യാവശ്യം).",
    "details": "ഗിറ്റ് (Git) ഉപയോഗിച്ച് കോഡ് കമ്മിറ്റ് ചെയ്യാനും, GitHub-ൽ പുതിയൊരു റിപോസിറ്ററി ഉണ്ടാക്കി കോഡ് അപ്‌ലോഡ് ചെയ്യാനും പഠിക്കുക.",
    "code": "# ഗിറ്റ് ആരംഭിക്കുക\ngit init\ngit add .\ngit commit -m \"Initial commit of Python React fullstack app\"\n\n# GitHub റിപോസിറ്ററി ലിങ്ക് ചെയ്ത് പുഷ് ചെയ്യുക\n# git remote add origin https://github.com/your-username/my-project.git\n# git branch -M main\n# git push -u origin main",
    "codeLanguage": "bash",
    "task": "GitHub-ൽ നിങ്ങളുടെ അക്കൗണ്ട് തുടങ്ങി ഇന്നത്തെ കോഡ് ഒരു പുതിയ റിപോസിറ്ററിയിലേക്ക് പുഷ് ചെയ്യുക.",
    "tip": ".env ഫയലുകളും myenv/ വെർച്വൽ എൻവയോൺമെന്റും GitHub-ൽ പോകാതിരിക്കാൻ .gitignore ഫയൽ നിർബന്ധമായും ചേർക്കുക.",
    "resources": "Git Cheat Sheet",
    "quiz": {
      "question": "Git-ൽ നിങ്ങൾ ചെയ്ത മാറ്റങ്ങൾ ആദ്യമായി സേവ് ചെയ്യാൻ (Snapshot) ഏത് കമാൻഡ് ഉപയോഗിക്കുന്നു?",
      "options": [
        "git upload",
        "git commit -m 'message'",
        "git push",
        "git save"
      ],
      "correctIndex": 1,
      "explanation": "git add . ചെയ്ത ശേഷം ലോക്കൽ ഹിസ്റ്ററിയിൽ സേവ് ചെയ്യാൻ git commit ആണ് ഉപയോഗിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-34-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-34-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-34-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-35",
    "day": 35,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 5 Review",
    "category": "Weekly Review",
    "title": "ഫുൾസ്റ്റാക്ക് ആർക്കിടെക്ചർ റിവ്യൂ",
    "summary": "React (Client) -> HTTP REST Request -> Python Flask (Server) -> SQLite (DB) ഫ്ലോ.",
    "details": "ഒരു യൂസർ ബട്ടൺ ക്ലിക്ക് ചെയ്യുമ്പോൾ മുതൽ ഡാറ്റാബേസിൽ ഡാറ്റ എത്തി തിരികെ സ്ക്രീനിൽ വരുന്നതുവരെയുള്ള സമഗ്രമായ ഒഴുക്ക് മനസ്സിലുറപ്പിക്കുക.",
    "code": "/*\n  Fullstack Data Flow:\n  [ React Frontend (UI) ]\n         │  ▲\n   Fetch │  │ JSON Response\n   (POST)│  │\n         ▼  │\n  [ Flask Backend (API) ]\n         │  ▲\n   SQL   │  │ Results\n         ▼  │\n  [ SQLite Database ]\n*/",
    "codeLanguage": "javascript",
    "task": "ഈ ഡാറ്റാ ഫ്ലോ ഒരു പേപ്പറിൽ അല്ലെങ്കിൽ ഡ്രോയിംഗ് ടൂളിൽ സ്വയം വരച്ചു നോക്കുക.",
    "tip": "ഈ ഫ്ലോ വ്യക്തമായാൽ പിന്നെ ഏത് ഫുൾസ്റ്റാക്ക് പ്രോജക്റ്റും നിങ്ങൾക്കൊരു വെല്ലുവിളിയാവില്ല.",
    "resources": "Fullstack Architecture Overview",
    "quiz": {
      "question": "ഒരു ഫുൾസ്റ്റാക്ക് ആപ്പിൽ ഡാറ്റാ ഒഴുക്ക് (Data Flow) ഏത് ദിശയിലാണ് നടക്കുന്നത്?",
      "options": [
        "Database -> UI directly",
        "UI (React) -> REST API (Flask) -> Database (SQLite/PostgreSQL)",
        "Server -> Client without API",
        "Random flow"
      ],
      "correctIndex": 1,
      "explanation": "യൂസർ ഇന്റർഫേസിൽ നിന്ന് API വഴി സെർവറിലേക്കും, അവിടെ നിന്ന് ഡാറ്റാബേസിലേക്കുമാണ് സുരക്ഷിതമായ ഒഴുക്ക് നടക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-35-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-35-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-35-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-36",
    "day": 36,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Capstone Project",
    "title": "ഫൈനൽ പ്രോജക്റ്റ് പ്ലാനിംഗ് (Fullstack Notes & Task App)",
    "summary": "നിങ്ങളുടെ സ്വന്തം പ്രോജക്റ്റിന്റെ സവിശേഷതകളും ഡാറ്റാബേസ് സ്കീമയും ഡിസൈൻ ചെയ്യുക.",
    "details": "ഒരു സമ്പൂർണ്ണ ഫുൾസ്റ്റാക്ക് ആപ്പ്: യൂസർമാർക്ക് കുറിപ്പുകൾ (Notes) എഴുതി വെക്കാം, കാറ്റഗറി തിരഞ്ഞെടുക്കാം, തിരയാം (Search), ഡിലീറ്റ് ചെയ്യാം.",
    "code": "# Project Plan:\n# 1. Backend: Flask REST API + SQLite (Notes Table: id, title, content, category, created_at)\n# 2. Frontend: React + Modern CSS + Search Bar + Category Filter + Responsive Cards\n# 3. Connection: Axios / Fetch with live auto-refresh",
    "codeLanguage": "python",
    "task": "നിങ്ങളുടെ ഫൈനൽ പ്രോജക്റ്റിന് എന്തൊക്കെ ഫീച്ചറുകൾ വേണമെന്ന് ഒരു ലിസ്റ്റ് എഴുതി തയ്യാറാക്കുക.",
    "tip": "ആദ്യം ലളിതമായ ഫീച്ചറുകൾ മാത്രം ചെയ്ത് തീർക്കുക (MVP - Minimum Viable Product).",
    "resources": "Software Project Planning",
    "quiz": {
      "question": "ഒരു സോഫ്റ്റ്‌വെയർ വികസിപ്പിക്കുമ്പോൾ 'MVP' എന്നാൽ എന്താണ്?",
      "options": [
        "Most Valuable Programmer",
        "Minimum Viable Product",
        "Maximum Visual Presentation",
        "Main View Port"
      ],
      "correctIndex": 1,
      "explanation": "MVP എന്നാൽ ഏറ്റവും അത്യാവശ്യമായ ഫീച്ചറുകൾ മാത്രമുള്ള ഒരു പ്രോഡക്റ്റ് ഉണ്ടാക്കി വേഗത്തിൽ ടെസ്റ്റ് ചെയ്യുന്ന രീതിയാണ്."
    },
    "subtasks": [
      {
        "id": "st-36-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-36-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-36-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-37",
    "day": 37,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Capstone Project",
    "title": "ഫൈനൽ പ്രോജക്റ്റ്: ബാക്ക്എൻഡ് പൂർത്തീകരണം",
    "summary": "Notes ആപ്പിന് വേണ്ട എല്ലാ API എൻഡ്പോയിന്റുകളും Flask-ൽ പൂർത്തിയാക്കുക.",
    "details": "GET /api/notes, POST /api/notes, PUT /api/notes/<id>, DELETE /api/notes/<id> എന്നീ എൻഡ്പോയിന്റുകൾ എഴുതി Thunder Client വഴി ടെസ്റ്റ് ചെയ്യുക.",
    "code": "# sample endpoint\n@app.route(\"/api/notes\", methods=[\"GET\"])\ndef get_all_notes():\n    search_query = request.args.get(\"q\", \"\")\n    if search_query:\n        notes = Note.query.filter(Note.title.contains(search_query)).all()\n    else:\n        notes = Note.query.order_by(Note.id.desc()).all()\n    return jsonify([{\"id\": n.id, \"title\": n.title, \"content\": n.content} for n in notes])",
    "codeLanguage": "python",
    "task": "ബാക്ക്എൻഡിൽ സെർച്ച് ഫീച്ചർ ഉൾപ്പെടെയുള്ള API റൂട്ടുകൾ കോഡ് ചെയ്യുക.",
    "tip": "ഡാറ്റ ക്രമീകരിക്കാൻ order_by(Note.id.desc()) കൊടുത്താൽ പുതിയ നോട്ടുകൾ ആദ്യം വരും.",
    "resources": "Flask Querying",
    "quiz": {
      "question": "ബാക്ക്എൻഡ് API-കൾ ഫ്രണ്ട്എൻഡ് ഇല്ലാതെ തന്നെ ടെസ്റ്റ് ചെയ്യാൻ ഡെവലപ്പർമാർ ഉപയോഗിക്കുന്ന ജനപ്രിയ ടൂൾ ഏതാണ്?",
      "options": [
        "VS Code Thunder Client അല്ലെങ്കിൽ Postman",
        "Excel",
        "Notepad",
        "Photoshop"
      ],
      "correctIndex": 0,
      "explanation": "Thunder Client അല്ലെങ്കിൽ Postman വഴി ബാക്ക്എൻഡ് റൂട്ടുകളിലേക്ക് നേരിട്ട് GET, POST റിക്വസ്റ്റുകൾ അയച്ചു നോക്കാം."
    },
    "subtasks": [
      {
        "id": "st-37-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-37-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-37-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-38",
    "day": 38,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Capstone Project",
    "title": "ഫൈനൽ പ്രോജക്റ്റ്: ഫ്രണ്ട്എൻഡ് UI നിർമ്മാണം",
    "summary": "മനോഹരമായ കാർഡുകളും മോഡൽ ഫോമും ഉള്ള പ്രൊഫഷണൽ React ഇന്റർഫേസ്.",
    "details": "ഹെഡർ, സെർച്ച് ബാർ, കാറ്റഗറി ടാഗുകൾ, പുതിയ നോട്ട് ആഡ് ചെയ്യാനുള്ള ഫോം, റെസ്‌പോൺസീവ് ഗ്രിഡ് ലേഔട്ട് എന്നിവ ഒരുക്കുക.",
    "code": "// NoteCard.jsx\nfunction NoteCard({ note, onDelete }) {\n  return (\n    <div className=\"note-card\">\n      <div className=\"note-header\">\n        <h4>{note.title}</h4>\n        <button onClick={() => onDelete(note.id)} className=\"delete-btn\">🗑️</button>\n      </div>\n      <p>{note.content}</p>\n      <span className=\"badge\">{note.category || \"General\"}</span>\n    </div>\n  );\n}",
    "codeLanguage": "javascript",
    "task": "NoteCard, NoteForm എന്നീ രണ്ട് കമ്പോണന്റുകൾ ഉണ്ടാക്കി സ്റ്റൈൽ ചെയ്യുക.",
    "tip": "മൊബൈലിലും ലാപ്ടോപ്പിലും നല്ല ഭംഗിയുള്ള ഗ്രിഡ് ലേഔട്ട് നൽകാൻ CSS Grid ഉപയോഗിക്കുക (grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))).",
    "resources": "CSS Grid in React",
    "quiz": {
      "question": "CSS-ൽ കാർഡുകൾ തുല്യ അകലത്തിൽ ഗ്രിഡായി ക്രമീകരിക്കാൻ ഏത് പ്രോപ്പർട്ടി ഉപയോഗിക്കുന്നു?",
      "options": [
        "display: grid",
        "display: inline",
        "float: left",
        "position: static"
      ],
      "correctIndex": 0,
      "explanation": "CSS Grid (display: grid; grid-template-columns: ...) റെസ്‌പോൺസീവ് കാർഡുകൾ ക്രമീകരിക്കാൻ ഏറ്റവും മികച്ചതാണ്."
    },
    "subtasks": [
      {
        "id": "st-38-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-38-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-38-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-39",
    "day": 39,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Capstone Project",
    "title": "ഫൈനൽ പ്രോജക്റ്റ്: ബാക്ക്എൻഡും ഫ്രണ്ട്എൻഡും കൂട്ടിയോജിപ്പിക്കൽ",
    "summary": "ബാക്ക്എൻഡിലേക്ക് പുതിയ നോട്ടുകൾ പോസ്റ്റ് ചെയ്യുകയും തത്സമയം UI അപ്‌ഡേറ്റ് ആകുകയും ചെയ്യുക.",
    "details": "യൂസർ ഫോമിൽ ടൈപ്പ് ചെയ്ത് 'Save Note' ഞെക്കുമ്പോൾ ഡാറ്റാബേസിൽ പോയി സ്റ്റോർ ആയി സ്ക്രീനിൽ കാർഡായി പ്രത്യക്ഷപ്പെടുന്നു.",
    "code": "const handleCreateNote = async (newNote) => {\n  const res = await fetch(\"http://127.0.0.1:5000/api/notes\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(newNote)\n  });\n  if (res.ok) {\n    const created = await res.json();\n    setNotes([created, ...notes]); // ഉടൻ ലിസ്റ്റിൽ ചേർക്കുന്നു\n  }\n};",
    "codeLanguage": "javascript",
    "task": "ഫ്രണ്ട്എൻഡും ബാക്ക്എൻഡും കണക്റ്റ് ചെയ്ത് ആദ്യത്തെ നോട്ട് സേവ് ചെയ്തു കാണുക.",
    "tip": "ഒരു നോട്ട് ആഡ് ചെയ്ത ഉടൻ ലിസ്റ്റിലേക്ക് നേരിട്ട് ചേർത്താൽ വീണ്ടും പേജ് റീഫ്രഷ് ചെയ്യേണ്ടി വരില്ല (Optimistic UI update).",
    "resources": "React Fullstack Integration",
    "quiz": {
      "question": "യൂസർ പുതിയൊരു ഡാറ്റ സേവ് ചെയ്യുമ്പോൾ വീണ്ടും പേജ് റീഫ്രഷ് ചെയ്യാതെ സ്ക്രീനിൽ ഉടനടി അപ്‌ഡേറ്റ് ചെയ്യുന്ന രീതിക്ക് എന്താണ് പറയുന്നത്?",
      "options": [
        "Static Rendering",
        "Optimistic UI Update",
        "Hard Reload",
        "Lazy Loading"
      ],
      "correctIndex": 1,
      "explanation": "സെർവറിൽ നിന്ന് ഡാറ്റ വരുന്നത് വരെ കാത്തുനിൽക്കാതെ ഫ്രണ്ട്എൻഡ് സ്റ്റേറ്റിൽ ഉടൻ ആഡ് ചെയ്ത് വേഗത നൽകുന്ന രീതിയാണിത്."
    },
    "subtasks": [
      {
        "id": "st-39-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-39-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-39-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-40",
    "day": 40,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Polish & Security",
    "title": "യൂസർ എക്സ്പീരിയൻസ് മെച്ചപ്പെടുത്തലും സുരക്ഷയും",
    "summary": "ആനിമേഷനുകൾ, ടോസ്റ്റ് മെസ്സേജുകൾ, സുരക്ഷിതമായ ഇൻപുട്ട് വാലിഡേഷൻ.",
    "details": "ഒരു നോട്ട് സേവ് ആകുമ്പോൾ 'സേവ് ചെയ്തു!' എന്ന ചെറിയ ടോസ്റ്റ് നോട്ടിഫിക്കേഷൻ കാണിക്കുക. ഒഴിഞ്ഞ ഇൻപുട്ടുകൾ സബ്മിറ്റ് ചെയ്യുന്നത് തടയുക.",
    "code": "// Toast Notification helper\nconst showNotification = (msg) => {\n  const toast = document.createElement(\"div\");\n  toast.className = \"toast-message\";\n  toast.innerText = msg;\n  document.body.appendChild(toast);\n  setTimeout(() => toast.remove(), 2500);\n};",
    "codeLanguage": "javascript",
    "task": "നിങ്ങളുടെ ആപ്പിൽ ഡിലീറ്റ് ചെയ്യുമ്പോൾ 'ശരിക്കും ഡിലീറ്റ് ചെയ്യണോ?' എന്നൊരു കൺഫർമേഷൻ അലർട്ട് വെക്കുക.",
    "tip": "ചെറിയ മൈക്രോ-ആനിമേഷനുകളും ഫീഡ്ബാക്കുകളുമാണ് ഒരു വെബ്‌സൈറ്റിനെ പ്രൊഫഷണൽ ആക്കുന്നത്.",
    "resources": "Modern Web UX Guidelines",
    "quiz": {
      "question": "വെബ്‌സൈറ്റിൽ യൂസർക്ക് ഒരു പ്രവർത്തി വിജയകരമായി പൂർത്തിയായി എന്ന് പെട്ടെന്ന് കാണിച്ചു മാഞ്ഞുപോകുന്ന ചെറിയ സന്ദേശങ്ങൾക്ക് എന്ത് പറയുന്നു?",
      "options": [
        "Modal",
        "Toast Notification",
        "Tooltip",
        "Popup window"
      ],
      "correctIndex": 1,
      "explanation": "Toast നോട്ടിഫിക്കേഷനുകൾ സ്ക്രീനിന്റെ അടിയിലോ മുകളിലോ വന്ന് 2-3 സെക്കൻഡിനുള്ളിൽ തനിയെ മാഞ്ഞുപോകുന്നവയാണ്."
    },
    "subtasks": [
      {
        "id": "st-40-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-40-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-40-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-41",
    "day": 41,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Week 6",
    "category": "Deployment",
    "title": "ആപ്പ് ഇന്റർനെറ്റിൽ ലൈവ് ആക്കൽ (Deployment Basics)",
    "summary": "നിങ്ങളുടെ പ്രോജക്റ്റ് ലോകത്തിലെ ആർക്കും കാണാൻ പാകത്തിൽ ലൈവ് ഹോസ്റ്റ് ചെയ്യുക.",
    "details": "React ഫ്രണ്ട്എൻഡ് Vercel അല്ലെങ്കിൽ Netlify വഴി സൗജന്യമായി ഹോസ്റ്റ് ചെയ്യാം. Python ബാക്ക്എൻഡ് Render അല്ലെങ്കിൽ Railway വഴി ലൈവാക്കാം.",
    "code": "# React പ്രൊഡക്ഷൻ ബിൽഡ് ഉണ്ടാക്കാൻ:\nnpm run build\n\n# dist ഫോൾഡർ Vercel-ലേക്ക് നേരിട്ട് ഡ്രാഗ് & ഡ്രോപ്പ് ചെയ്യുകയോ, \n# അല്ലെങ്കിൽ GitHub റിപോസിറ്ററി Vercel-ലേക്ക് കണക്റ്റ് ചെയ്യുകയോ ചെയ്യാം!",
    "codeLanguage": "bash",
    "task": "നിങ്ങളുടെ React ഫ്രണ്ട്എൻഡ് Vercel-ൽ ഹോസ്റ്റ് ചെയ്ത് ഒരു ലൈവ് ലിങ്ക് സ്വന്തമാക്കുക.",
    "tip": "റെസ്യൂമേയിൽ വെറുതെ GitHub ലിങ്ക് നൽകുന്നതിനേക്കാൾ ലൈവ് വെബ്‌സൈറ്റ് ലിങ്ക് നൽകുന്നത് ഇന്റർവ്യൂവറെ ആകർഷിക്കും.",
    "resources": "Deploying React on Vercel",
    "quiz": {
      "question": "React ഫ്രണ്ട്എൻഡ് പ്രോജക്റ്റുകൾ സൗജന്യമായി ഒറ്റ ക്ലിക്കിൽ ഇന്റർനെറ്റിൽ ഹോസ്റ്റ് ചെയ്യാൻ ഏറ്റവും മികച്ച പ്ലാറ്റ്‌ഫോം ഏതാണ്?",
      "options": [
        "Vercel അല്ലെങ്കിൽ Netlify",
        "XAMPP",
        "CPanel only",
        "Apache local"
      ],
      "correctIndex": 0,
      "explanation": "Vercel ഉം Netlify ഉം GitHub-മായി കണക്റ്റ് ചെയ്താൽ തനിയെ ബിൽഡ് ചെയ്ത് ലോകമെമ്പാടും ലൈവ് ലിങ്ക് നൽകുന്നു."
    },
    "subtasks": [
      {
        "id": "st-41-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-41-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-41-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  },
  {
    "id": "day-42",
    "day": 42,
    "phase": 3,
    "phaseTitle": "Phase 3: Fullstack Connection & Capstone",
    "week": "Graduation!",
    "category": "Career & Portfolio",
    "title": "റെസ്യൂമേയും പോർട്ട്‌ഫോളിയോയും (You are a Fullstack Developer!)",
    "summary": "നിങ്ങൾ സ്വന്തമായി ഫുൾസ്റ്റാക്ക് ഡെവലപ്‌മെന്റ് വിജയകരമായി പഠിച്ചെടുത്തു!",
    "details": "നിങ്ങൾ നിർമ്മിച്ച പ്രോജക്റ്റുകളുടെ ലിങ്കും, സ്ക്രീൻഷോട്ടുകളും, പഠിച്ച ടെക്നോളജികളും (Python, Flask, REST API, SQLite, JavaScript, React, Git) ഉൾപ്പെടുത്തി റെസ്യൂമേയും LinkedIn പ്രൊഫൈലും അപ്‌ഡേറ്റ് ചെയ്യുക.",
    "code": "/*\n  🎓 സർട്ടിഫിക്കറ്റ് ഓഫ് കംപ്ലീഷൻ:\n  നിങ്ങൾ Python + React ഫുൾസ്റ്റാക്ക് റോഡ്‌മാപ്പ് വിജയകരമായി പൂർത്തിയാക്കി!\n  - 14 Days Python & Backend\n  - 14 Days JavaScript & React\n  - 14 Days Integration & Project\n  \n  ഇനി തുടർന്ന് സ്വന്തം ഐഡിയകൾ കോഡ് ചെയ്തു മുന്നേറുക!\n*/",
    "codeLanguage": "javascript",
    "task": "നിങ്ങളുടെ LinkedIn-ൽ പ്രോജക്റ്റിന്റെ ചെറിയൊരു ഡെമോ വീഡിയോ അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട് പോസ്റ്റ് ചെയ്ത് അനുഭവം പങ്കുവെക്കുക.",
    "tip": "തുടർച്ചയായി കോഡ് ചെയ്യുക, ആഴ്ചയിൽ ഒന്നെങ്കിലും ചെറിയൊരു ഫീച്ചർ പഠിക്കുന്നത് തുടരുക!",
    "resources": "Software Developer Portfolio Tips",
    "quiz": {
      "question": "ഒരു ജൂനിയർ ഫുൾസ്റ്റാക്ക് ഡെവലപ്പർക്ക് ജോലി ലഭിക്കാൻ ഏറ്റവും കൂടുതൽ സഹായിക്കുന്നത് എന്താണ്?",
      "options": [
        "തിയറി മനപ്പാഠമാക്കൽ",
        "സ്വന്തമായി നിർമ്മിച്ച ലൈവ് പ്രോജക്റ്റുകളും GitHub കോഡ് ലിങ്കുകളും",
        "സർട്ടിഫിക്കറ്റുകൾ മാത്രം",
        "സോഷ്യൽ മീഡിയ ഫോളോവേഴ്സ്"
      ],
      "correctIndex": 1,
      "explanation": "നിങ്ങൾ സ്വന്തമായി കോഡ് ചെയ്തുണ്ടാക്കിയ വർക്കിംഗ് പ്രോജക്റ്റുകളാണ് ഇന്റർവ്യൂവറെ ഏറ്റവും കൂടുതൽ ആകർഷിക്കുന്നത്."
    },
    "subtasks": [
      {
        "id": "st-42-1",
        "text": "കോഡ് സ്നിപ്പറ്റ് പ്ലേഗ്രൗണ്ടിൽ റൺ ചെയ്തു ഔട്ട്പുട്ട് നിരീക്ഷിക്കുക"
      },
      {
        "id": "st-42-2",
        "text": "ടാസ്ക് അനുസരിച്ച് കോഡിൽ സ്വന്തമായി മാറ്റം വരുത്തുക"
      },
      {
        "id": "st-42-3",
        "text": "ക്വിസ് പൂർത്തിയാക്കി ഇന്നത്തെ പ്രോഗ്രസ്സ് ഉറപ്പാക്കുക"
      }
    ]
  }
];
