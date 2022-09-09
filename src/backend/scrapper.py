from bs4 import BeautifulSoup
import requests
import json

URL = "http://www.piano-midi.de/haydn.htm"
page = requests.get(URL)
html_doc = page.text
soup = BeautifulSoup(html_doc, "html.parser")

# Titles
titles = []
for title in soup.find_all("h2"):
    titles.append(title.string.replace("\n", " "))

# Part
parts = []
for a in soup.find_all("table", {"class": "midi"}):
    for b in a.find_all("a"):
        if b.string != None and b.string != "♫":
            parts.append(b.string)
# href
hrefs = []
for a in soup.find_all("a", href=True):
    if a["href"].find("ogg") != -1:
        hrefs.append(a["href"])

numering = [3,4,3,3,3,2,3]
tracks = []
composer = "Haydn"

print(len(tracks))
print(len(titles))
print(len(hrefs))

for i in range(len(titles)):
    counter = numering[i]
    while counter > 0:
        tracks.append(
            {
                "composer": composer,
                "piece": titles[i][0:-7].replace("Opus", "Op").replace(" ,", ",")
                + "| "
                + parts[0],
                "link": "http://www.piano-midi.de/" + hrefs[0],
            }
        )
        hrefs.pop(0)
        parts.pop(0)
        counter -= 1

print(json.dumps(tracks, indent=2))
