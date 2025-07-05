import re

with open("hymns.json", "r", encoding="utf-8") as f:
    data = f.read()

# Replace capital open O with bar (common forms)
data = re.sub(r"Ɔ̵|Ɔ̶|Ɔ̷|Ɔ̸|э", "Ɔ", data)
# Replace lowercase open o with bar (common forms)
data = re.sub(r"ɔ̵|ɔ̶|ɔ̷|ɔ̸|э", "ɔ", data)

with open("hymns.json", "w", encoding="utf-8") as f:
    f.write(data)
