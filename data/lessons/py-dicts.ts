import { Lesson } from "../types"

export const PYTHON_DICTS: Lesson = {
  id: "python-dicts",
  title: "Dictionaries",
  category: "Python",
  content: [
    {
      heading: "Dictionary Basics",
      body: "Dictionaries store key-value pairs. Keys must be immutable (strings, numbers, tuples). Values can be any type. Python 3.7+ maintains insertion order.",
      code: `# Creating dictionaries
empty = {}
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York",
    "hobbies": ["reading", "coding"],
    "address": {
        "street": "123 Main St",
        "zip": "10001"
    }
}

# Accessing values
print(person["name"])           # Alice
print(person.get("age"))        # 25
print(person.get("zip", "N/A")) # N/A (default value)

# Using setdefault
person.setdefault("country", "USA")  # Adds if key doesn't exist
print(person["country"])  # USA

# Adding/updating values
person["email"] = "alice@email.com"
person["age"] = 26

# Update with another dictionary
person.update({"phone": "123-4567", "age": 27})

# Removing items
del person["city"]
email = person.pop("email")
last_item = person.popitem()  # removes and returns last item (Python 3.7+)

# Clearing
person.clear()  # removes all items

# Iterating
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

for key in person.keys():
    print(key)

for value in person.values():
    print(value)`
    },
    {
      heading: "Dictionary Comprehensions",
      body: "Create dictionaries concisely using comprehensions with filtering and transformations.",
      code: `# Basic comprehension
squares = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# With condition (filtering)
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Conditional values
parity = {x: "even" if x % 2 == 0 else "odd" for x in range(6)}
# {0: 'even', 1: 'odd', 2: 'even', 3: 'odd', 4: 'even', 5: 'odd'}

# Swapping keys and values
original = {"a": 1, "b": 2, "c": 3}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# Nested comprehension
matrix = {i: {j: i*j for j in range(3)} for i in range(3)}
# {0: {0: 0, 1: 0, 2: 0}, 1: {0: 0, 1: 1, 2: 2}, 2: {0: 0, 1: 2, 2: 4}}

# Merging with comprehension
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = {**dict1, **dict2}  # Python 3.5+ unpacking
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# Merging with update (Python 3.9+)
merged = dict1 | dict2  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}`
    },
    {
      heading: "DefaultDict and Counter",
      body: "Specialized dictionary types from collections module for common use cases.",
      code: `from collections import defaultdict, Counter

# DefaultDict: Auto-initializes missing keys
word_count = defaultdict(int)
text = "hello world hello python world"
for word in text.split():
    word_count[word] += 1
# {'hello': 2, 'world': 2, 'python': 1}

# DefaultDict with list
groups = defaultdict(list)
for num in [1, 2, 3, 4, 5, 6]:
    groups["even" if num % 2 == 0 else "odd"].append(num)
# {'odd': [1, 3, 5], 'even': [2, 4, 6]}

# Custom default factory
def default_value():
    return {"count": 0, "total": 0}
stats = defaultdict(default_value)
stats["A"]["count"] += 1

# Counter: Counting hashable objects
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
count = Counter(words)
# Counter({'apple': 3, 'banana': 2, 'orange': 1})

# Most common items
print(count.most_common(2))  # [('apple', 3), ('banana', 2)]

# Counter operations
c1 = Counter(a=3, b=2, c=1)
c2 = Counter(a=1, b=2, c=3)
print(c1 + c2)  # Counter({'a': 4, 'b': 4, 'c': 4})
print(c1 - c2)  # Counter({'a': 2})
print(c1 & c2)  # Intersection: Counter({'a': 1, 'b': 2, 'c': 1})
print(c1 | c2)  # Union: Counter({'a': 3, 'b': 2, 'c': 3})

# Update and subtract
count.update(["apple", "orange"])
count.subtract(["banana", "apple"])`
    },
    {
      heading: "OrderedDict and ChainMap",
      body: "OrderedDict maintains order (pre-Python 3.7). ChainMap combines multiple dictionaries.",
      code: `from collections import OrderedDict, ChainMap

# OrderedDict (pre-Python 3.7, still useful for reordering)
od = OrderedDict()
od["a"] = 1
od["b"] = 2
od["c"] = 3
print(od)  # OrderedDict([('a', 1), ('b', 2), ('c', 3)])

# Move to end or beginning
od.move_to_end("b")  # Move 'b' to end
od.move_to_end("a", last=False)  # Move 'a' to beginning

# ChainMap: Multiple dictionaries as one
defaults = {"theme": "dark", "language": "en"}
user_config = {"theme": "light", "timezone": "UTC"}
config = ChainMap(user_config, defaults)

print(config["theme"])      # 'light' (from user_config)
print(config["language"])   # 'en' (from defaults)
print(config["timezone"])   # 'UTC' (from user_config)

# New dict in chain
config = config.new_child({"debug": True})
print(config["debug"])  # True

# Accessing underlying maps
print(config.maps)  # [{'debug': True}, {'theme': 'light'}, {'theme': 'dark', 'language': 'en'}]`
    },
    {
      heading: "Dictionary Views and Advanced Methods",
      body: "View objects provide dynamic views of dictionary entries.",
      code: `d = {"a": 1, "b": 2, "c": 3}

# Views are dynamic - they reflect changes
keys_view = d.keys()
values_view = d.values()
items_view = d.items()

print(list(keys_view))   # ['a', 'b', 'c']
d["d"] = 4
print(list(keys_view))   # ['a', 'b', 'c', 'd'] (updated!)

# Set operations on views (Python 3.9+)
d1 = {"a": 1, "b": 2, "c": 3}
d2 = {"b": 20, "c": 3, "d": 4}

# Keys intersection
common_keys = d1.keys() & d2.keys()  # {'b', 'c'}

# Keys difference
diff_keys = d1.keys() - d2.keys()    # {'a'}

# Items intersection
common_items = d1.items() & d2.items()  # {('c', 3)}

# Dictionary union (Python 3.9+)
merged = d1 | d2  # {'a': 1, 'b': 20, 'c': 3, 'd': 4}

# In-place merge (Python 3.9+)
d1 |= d2  # d1 is now {'a': 1, 'b': 20, 'c': 3, 'd': 4}

# fromkeys: Create dict with default values
keys = ["a", "b", "c"]
default_dict = dict.fromkeys(keys, 0)  # {'a': 0, 'b': 0, 'c': 0}

# Sorting dictionaries
sorted_by_key = dict(sorted(d.items()))
sorted_by_value = dict(sorted(d.items(), key=lambda item: item[1]))`
    },
    {
      heading: "Working with Nested Dictionaries",
      body: "Accessing and manipulating nested dictionary structures.",
      code: `# Deep nested dictionaries
data = {
    "users": {
        "alice": {
            "age": 25,
            "email": "alice@email.com",
            "preferences": {
                "theme": "dark",
                "notifications": True
            }
        },
        "bob": {
            "age": 30,
            "email": "bob@email.com",
            "preferences": {
                "theme": "light",
                "notifications": False
            }
        }
    },
    "settings": {
        "default_theme": "dark"
    }
}

# Safe nested access
def get_nested(d, keys, default=None):
    for key in keys:
        if isinstance(d, dict) and key in d:
            d = d[key]
        else:
            return default
    return d

alice_theme = get_nested(data, ["users", "alice", "preferences", "theme"])
print(alice_theme)  # 'dark'

# Using try/except
try:
    notification = data["users"]["alice"]["preferences"]["notifications"]
except KeyError:
    notification = False

# Using recursion for nested updates
def update_nested(d, keys, value):
    for key in keys[:-1]:
        d = d.setdefault(key, {})
    d[keys[-1]] = value

update_nested(data, ["users", "alice", "phone"], "123-4567")

# Flatten nested dictionary
def flatten_dict(d, parent_key="", sep="_"):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

flat = flatten_dict(data)
# {'users_alice_age': 25, 'users_alice_email': 'alice@email.com', ...}`
    },
    {
      heading: "Advanced Dictionary Techniques",
      body: "Hash table internals, performance considerations, and advanced patterns.",
      code: `# Dictionary keys must be hashable (immutable)
# Valid keys: strings, numbers, tuples
valid = {
    "name": "value",
    42: "number",
    (1, 2): "tuple"
}

# Invalid: lists, dictionaries, sets
# invalid = {[1, 2]: "list"}  # TypeError

# Performance: O(1) average, O(n) worst-case
# Memory considerations
import sys

small_dict = {"a": 1, "b": 2}
large_dict = {i: i**2 for i in range(1000)}
print(sys.getsizeof(small_dict))  # Memory usage
print(sys.getsizeof(large_dict))

# __missing__ method for custom dict behaviors
class AutoKeyDict(dict):
    def __missing__(self, key):
        self[key] = f"auto_{key}"
        return self[key]

auto = AutoKeyDict()
print(auto["unknown"])  # 'auto_unknown'
print(auto)  # {'unknown': 'auto_unknown'}

# Dictionary as switch/case (Python 3.10+ match statement alternative)
def dispatch(x):
    switcher = {
        "add": lambda a, b: a + b,
        "sub": lambda a, b: a - b,
        "mul": lambda a, b: a * b
    }
    return switcher.get(x, lambda a, b: None)

# Using dict for memoization (caching)
def fibonacci(n, cache={}):
    if n in cache:
        return cache[n]
    if n < 2:
        return n
    cache[n] = fibonacci(n-1, cache) + fibonacci(n-2, cache)
    return cache[n]

print(fibonacci(50))  # Fast with caching

# Key transformation
def transform_keys(d, func):
    return {func(k): v for k, v in d.items()}

original = {"a": 1, "b": 2}
upper_keys = transform_keys(original, str.upper)  # {'A': 1, 'B': 2}`
    },
    {
      heading: "Dictionary Type Hints and Best Practices",
      body: "Modern Python typing for dictionaries and best practices.",
      code: `from typing import Dict, List, Union, Optional, TypedDict
from typing_extensions import Required, NotRequired  # Python 3.11+

# Basic typing
def process_user(data: Dict[str, Union[str, int, List[str]]]) -> Dict[str, int]:
    """Process user data and return statistics."""
    result = {"total_keys": len(data)}
    for key, value in data.items():
        if isinstance(value, list):
            result[f"{key}_length"] = len(value)
    return result

# TypedDict for structured dictionaries
class UserPreferences(TypedDict):
    theme: str
    notifications: bool
    language: NotRequired[str]  # Optional key

class User(TypedDict):
    name: Required[str]
    age: int
    email: str
    preferences: UserPreferences

# Type-safe dictionary creation
user: User = {
    "name": "Alice",
    "age": 25,
    "email": "alice@email.com",
    "preferences": {
        "theme": "dark",
        "notifications": True,
        "language": "en"  # Optional
    }
}

# Best Practices
# 1. Use get() instead of direct access when key might be missing
value = user.get("missing_key", "default")

# 2. Use defaultdict for counting/grouping
from collections import defaultdict
groups = defaultdict(list)

# 3. Use dict comprehension for clarity
squares = {x: x**2 for x in range(10)}

# 4. Avoid using dict as a variable name
# 5. Use unpacking for merging (Python 3.5+)
merged = {**dict1, **dict2}

# 6. Use | operator for merging (Python 3.9+)
merged = dict1 | dict2

# 7. Consider using dataclasses for complex structured data
from dataclasses import dataclass

@dataclass
class UserData:
    name: str
    age: int
    email: str
    preferences: dict

# 8. Be mindful of memory when storing large dictionaries
# 9. Use __slots__ with custom dict-like classes for memory optimization
class SmallDict:
    __slots__ = ["data"]
    def __init__(self):
        self.data = {}`
    }
  ]
}