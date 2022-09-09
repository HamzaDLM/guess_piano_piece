import requests
import os
import json

# get cwd path
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

file = os.path.join(__location__, "store-v2.json")

d = []
with open(file) as f:
    d = json.load(f)

for item in d:
    url = item['link']

    response = requests.get(url)
    name = url[29:]

    listOfWords = name.split('/', 1)
    if len(listOfWords) > 0: 
        strValue = listOfWords[1]
    print(strValue)

    open("tracks/" + strValue, "wb").write(response.content)
  