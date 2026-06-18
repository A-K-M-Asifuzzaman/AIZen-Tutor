import type { Lesson } from "../types"

export const PYTHON_LISTS: Lesson = {
  id: "python-lists",
  title: "Lists and List Comprehension",
  category: "Python",
  content: [
    {
      heading: "List Basics and Creation",
      body: "Lists are ordered, mutable, and can contain mixed types. They're one of Python's most versatile data structures.",
      code: `# Creating lists
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, [1, 2], True]
nested = [[1, 2], [3, 4], [5, 6]]

# Using list() constructor
chars = list("hello")  # ['h', 'e', 'l', 'l', 'o']
ranged = list(range(5))  # [0, 1, 2, 3, 4]

# List repetition and concatenation
zeros = [0] * 5  # [0, 0, 0, 0, 0]
combined = [1, 2] + [3, 4]  # [1, 2, 3, 4]

# Check membership
print(3 in numbers)  # True
print(10 not in numbers)  # True

# Length and indexing
print(len(numbers))  # 5
print(numbers[0])    # First element: 1
print(numbers[-1])   # Last element: 5
print(numbers[-2])   # Second last: 4`
    },
    {
      heading: "List Methods - Adding and Removing",
      body: "Various methods to modify list contents with different behaviors.",
      code: `numbers = [1, 2, 3]

# Adding elements
numbers.append(4)              # [1, 2, 3, 4] (adds at end)
numbers.insert(1, 99)          # [1, 99, 2, 3, 4] (insert at index)
numbers.extend([5, 6])         # [1, 99, 2, 3, 4, 5, 6] (extend with iterable)

# Removing elements
numbers.remove(99)             # [1, 2, 3, 4, 5, 6] (removes first occurrence)
popped = numbers.pop()         # removes and returns 6
first = numbers.pop(0)         # removes and returns 1
del numbers[1:3]               # removes elements at indices 1-2

# Clear all
numbers.clear()                # []

# Difference between remove, pop, and del
# - remove(): removes by value (first occurrence)
# - pop(): removes by index (returns value)
# - del: removes by index or slice (no return)

# Deleting with slice assignment
nums = [1, 2, 3, 4, 5]
nums[1:4] = []  # [1, 5] (delete elements 1-3)`
    },
    {
      heading: "List Methods - Searching and Sorting",
      body: "Methods for finding elements and ordering lists.",
      code: `numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]

# Searching
print(numbers.index(5))        # 4 (first occurrence)
print(numbers.count(5))        # 2 (number of occurrences)

# Sorting (in-place)
numbers.sort()                 # [1, 1, 2, 3, 4, 5, 5, 6, 9]
numbers.sort(reverse=True)     # [9, 6, 5, 5, 4, 3, 2, 1, 1]

# Custom sort with key
words = ["apple", "Banana", "cherry", "Date"]
words.sort(key=str.lower)      # Case-insensitive sort
words.sort(key=len)            # Sort by length

# Sorted (returns new list)
sorted_numbers = sorted(numbers)  # Doesn't modify original

# Reverse
numbers.reverse()              # In-place reversal
reversed_iter = reversed(numbers)  # Returns iterator

# Complex sorting
people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 20}
]
people.sort(key=lambda p: p["age"])  # Sort by age
people.sort(key=lambda p: p["name"].lower())  # Sort by name
from operator import itemgetter
people.sort(key=itemgetter("age"))  # Using operator module`
    },
    {
      heading: "List Slicing Deep Dive",
      body: "Advanced slicing techniques with start, stop, and step parameters.",
      code: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Basic slicing [start:stop:step]
print(numbers[2:6])       # [2, 3, 4, 5]
print(numbers[:5])        # [0, 1, 2, 3, 4]
print(numbers[5:])        # [5, 6, 7, 8, 9]
print(numbers[::2])       # [0, 2, 4, 6, 8] (every 2nd)
print(numbers[1::2])      # [1, 3, 5, 7, 9] (every 2nd from index 1)

# Negative indices
print(numbers[-3:])       # [7, 8, 9] (last 3)
print(numbers[:-3])       # [0, 1, 2, 3, 4, 5, 6] (all except last 3)
print(numbers[-5:-2])     # [5, 6, 7]

# Reverse with step
print(numbers[::-1])      # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
print(numbers[::-2])      # [9, 7, 5, 3, 1]

# Modifying with slices
numbers[2:5] = [99, 98, 97]  # Replace elements 2-4
numbers[2:5] = []           # Delete elements 2-4
numbers[2:2] = [99, 98]     # Insert at index 2

# Extended slice assignment (must match length)
numbers[::2] = [100] * 5    # Replace every 2nd element (requires same length)

# Copying with slices
copy1 = numbers[:]          # Shallow copy
copy2 = numbers.copy()      # Also shallow copy

# Nested lists and deep copy
import copy
nested = [[1, 2], [3, 4]]
shallow = nested[:]         # References inner lists
deep = copy.deepcopy(nested)  # Independent copy`
    },
    {
      heading: "List Comprehensions - Advanced",
      body: "Powerful and concise list creation with comprehensions, including nested and conditional logic.",
      code: `# Basic comprehension
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition (filtering)
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# With if-else (ternary)
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
# ['even', 'odd', 'even', 'odd', 'even']

# Multiple conditions
result = [x for x in range(30) if x % 2 == 0 if x % 3 == 0]
# [0, 6, 12, 18, 24]

# Nested list comprehensions
matrix = [[j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [0, 1, 2], [0, 1, 2]]

# Flatten a matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Matrix transposition
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# Comprehension with enumerate
indexed = [(i, char) for i, char in enumerate("hello")]
# [(0, 'h'), (1, 'e'), (2, 'l'), (3, 'l'), (4, 'o')]

# Cartesian product
colors = ['red', 'blue']
sizes = ['S', 'M', 'L']
combinations = [(color, size) for color in colors for size in sizes]
# [('red', 'S'), ('red', 'M'), ('red', 'L'), ('blue', 'S'), ('blue', 'M'), ('blue', 'L')]

# Using walrus operator (Python 3.8+)
result = [y for x in range(10) if (y := x**2) > 20]
# [25, 36, 49, 64, 81]`
    },
    {
      heading: "List Operations and Built-in Functions",
      body: "Common operations and functions that work with lists.",
      code: `numbers = [3, 1, 4, 1, 5, 9, 2]

# Built-in functions
print(len(numbers))          # 7
print(max(numbers))          # 9
print(min(numbers))          # 1
print(sum(numbers))          # 25
print(sorted(numbers))       # [1, 1, 2, 3, 4, 5, 9]

# all() and any()
all_even = all(x % 2 == 0 for x in numbers)  # False
any_even = any(x % 2 == 0 for x in numbers)  # True

# zip() for combining lists
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
pairs = list(zip(names, ages))
# [('Alice', 25), ('Bob', 30), ('Charlie', 35)]

# enumerate() for index-value pairs
for i, value in enumerate(numbers):
    print(f"Index {i}: {value}")

# Map and filter (functional style)
squared = list(map(lambda x: x**2, numbers))
filtered = list(filter(lambda x: x > 3, numbers))

# Reduce (requires functools)
from functools import reduce
product = reduce(lambda x, y: x * y, numbers)`
    },
    {
      heading: "List Performance and Memory",
      body: "Understanding list internals for efficient programming.",
      code: `import sys
import time

# Memory usage
small_list = [1, 2, 3]
large_list = list(range(1000000))
print(sys.getsizeof(small_list))  # Memory in bytes
print(sys.getsizeof(large_list))

# Time complexity
# - Access: O(1)
# - Append: O(1) amortized
# - Insert/Delete at beginning: O(n)
# - Insert/Delete at end: O(1)
# - Search: O(n)

# Pre-allocating lists for performance
n = 1000000
# Slow: dynamic growth
slow = []
for i in range(n):
    slow.append(i)

# Fast: pre-allocate
fast = [0] * n
for i in range(n):
    fast[i] = i

# List vs array (for numeric data)
from array import array
arr = array('i', [1, 2, 3, 4, 5])  # More memory efficient for numbers

# Generator vs list for memory
def square_numbers(n):
    for i in range(n):
        yield i**2

# List: stores all values in memory
squares_list = [i**2 for i in range(1000000)]

# Generator: yields one value at a time
squares_gen = (i**2 for i in range(1000000))

# Queue-like operations (efficient)
from collections import deque
queue = deque([1, 2, 3])
queue.append(4)         # O(1)
queue.popleft()         # O(1) instead of O(n) for list pop(0)`
    },
    {
      heading: "Advanced List Patterns and Best Practices",
      body: "Common patterns, pitfalls, and best practices when working with lists.",
      code: `# 1. List unpacking
a, b, c = [1, 2, 3]
first, *rest = [1, 2, 3, 4, 5]  # first=1, rest=[2,3,4,5]
*rest, last = [1, 2, 3, 4, 5]  # rest=[1,2,3,4], last=5

# 2. Swapping variables
a, b = b, a  # Works with lists too
numbers[0], numbers[1] = numbers[1], numbers[0]

# 3. Removing duplicates while preserving order
def unique_ordered(lst):
    seen = set()
    return [x for x in lst if not (x in seen or seen.add(x))]

numbers = [1, 2, 2, 3, 3, 4, 1, 5]
unique = unique_ordered(numbers)  # [1, 2, 3, 4, 5]

# 4. Chunking a list
def chunk_list(lst, chunk_size):
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

chunks = chunk_list(list(range(10)), 3)  # [[0,1,2], [3,4,5], [6,7,8], [9]]

# 5. Flatten nested lists (arbitrary depth)
def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

nested = [1, [2, [3, 4], 5], 6]
flat = flatten(nested)  # [1, 2, 3, 4, 5, 6]

# 6. List as stack (LIFO)
stack = []
stack.append(1)  # Push
stack.append(2)
top = stack.pop()  # 2

# 7. List as queue (FIFO) - use deque for better performance
from collections import deque
queue = deque([1, 2, 3])
queue.append(4)  # Enqueue
front = queue.popleft()  # Dequeue - O(1)

# 8. Common pitfalls
# Pitfall 1: Aliasing
a = [1, 2, 3]
b = a  # Both reference same list
b.append(4)  # a also changes

# Correct: Create copy
b = a.copy()  # or a[:]

# Pitfall 2: Using mutable default arguments
def append_to_list(value, lst=[]):  # Bad - default list persists
    lst.append(value)
    return lst

def append_to_list(value, lst=None):  # Good
    if lst is None:
        lst = []
    lst.append(value)
    return lst

# 9. List filtering with list comprehension vs filter()
# List comprehension (faster, Pythonic)
result = [x for x in numbers if x > 3]

# filter() (functional style)
result = list(filter(lambda x: x > 3, numbers))

# 10. List rotation
def rotate_list(lst, n):
    n = n % len(lst)
    return lst[-n:] + lst[:-n]

numbers = [1, 2, 3, 4, 5]
rotated = rotate_list(numbers, 2)  # [4, 5, 1, 2, 3]`
    },
    {
      heading: "Type Hints with Lists",
      body: "Using type hints for better code documentation and IDE support.",
      code: `from typing import List, Optional, Union, Any, Iterator

# Basic type hints
def process_numbers(numbers: List[int]) -> List[int]:
    return [x * 2 for x in numbers]

def get_first_element(lst: List[Any]) -> Optional[Any]:
    return lst[0] if lst else None

# Mixed types
def process_mixed(data: List[Union[int, str]]) -> List[str]:
    return [str(item) for item in data]

# Nested lists
def flatten_matrix(matrix: List[List[int]]) -> List[int]:
    return [num for row in matrix for num in row]

# Generator type
def generate_squares(n: int) -> Iterator[int]:
    for i in range(n):
        yield i ** 2

# Custom type alias
UserList = List[Dict[str, Union[str, int]]]

# Python 3.9+ simplified typing
def process(items: list[int]) -> list[str]:  # No need for typing.List
    return [str(item) for item in items]

# Protocol for list-like objects
from typing import Protocol

class ListLike(Protocol):
    def __getitem__(self, index: int) -> Any: ...
    def __len__(self) -> int: ...

def process_list_like(obj: ListLike) -> None:
    print(len(obj))
    print(obj[0])

# Using with dataclasses
from dataclasses import dataclass

@dataclass
class DataContainer:
    items: List[int]
    processed: List[str]
    metadata: dict[str, Any]`
    }
  ]
}