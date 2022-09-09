import hashlib
import os
import json

# get cwd path
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
file = os.path.join(__location__, "store-v2.json")


def hashing10(input):
    hash = hashlib.sha1(input.encode("UTF-8")).hexdigest()
    return hash[:10]


## Rename the links in store-v2
# d = []
# with open(file) as f:
#     d = json.load(f)

# for item in d:
#     print(item["link"])
#     link = item["link"]
#     item["link"] = hashing10(item['link']) + link[-4:]

# # print(json.dumps(d, indent=2))

##
directory = __location__

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    # checking if it is a file
    if os.path.isfile(f):
        hashed = hashing10(filename) + filename[-4:]
        new_name = f"{directory}\{hashed}"
        os.rename(f, new_name)
