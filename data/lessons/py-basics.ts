import type { Lesson } from "../types"

export const PYTHON_BASICS: Lesson = {
  id: "python-basics",
  title: "Python Basics",
  category: "Python",
  content: [
    {
      heading: "What is Python?",
      body: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in data science, machine learning, web development, and automation. Python is great for beginners because its syntax is clean and easy to understand."
    },
    {
      heading: "Your First Python Program",
      body: "Let's start with the classic 'Hello, World!' program. This simple program prints text to the screen.",
      code: `# This is a comment - Python ignores these
# Comments help explain what your code does

print("Hello, World!")  # This prints text to the screen
print("Welcome to Python!")

# You can also print numbers
print(42)
print(3.14)`,
      note: "The print() function is one of the most commonly used functions in Python. It displays output to the console."
    },
    {
      heading: "Variables - Storing Information",
      body: "Variables are like labeled boxes where you can store information. You put a value in a box (variable) and give it a name so you can use it later.",
      code: `# Creating variables - you don't need to declare type
name = "Alice"           # Text (string)
age = 25                 # Whole number (integer)
height = 5.8             # Decimal number (float)
is_student = True        # True/False (boolean)

# Using variables in print
print(name)              # Prints: Alice
print(age)               # Prints: 25

# Variables can change
age = 26                 # Updates age to 26
age = age + 1            # Now age becomes 27

# Multiple variables at once
x, y, z = 1, 2, 3        # x=1, y=2, z=3

# Variable naming rules:
# - Must start with letter or underscore
# - Can contain letters, numbers, underscores
# - Case sensitive (myVar and myvar are different)
# - Cannot use Python keywords (if, for, while, etc.)

# Good variable names (descriptive)
first_name = "John"
total_price = 99.99
is_available = True

# Bad variable names (don't use these)
# a = "John"           # Too vague
# 2nd = 10             # Can't start with number
# class = "Math"       # 'class' is a Python keyword`,
      note: "Choose descriptive variable names to make your code more readable and maintainable."
    },
    {
      heading: "Data Types - Different Kinds of Data",
      body: "Python has several built-in data types that store different kinds of information.",
      code: `# Integer (whole numbers)
age = 25
temperature = -5
count = 100

# Float (decimal numbers)
price = 19.99
pi = 3.14159
weight = 65.5

# String (text)
name = "Alice"
message = 'Hello World'
multi_line = """This is
a multi-line
string"""

# Boolean (True/False)
is_sunny = True
is_raining = False

# List (ordered collection)
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, 3.14, True]

# Tuple (ordered, unchangeable collection)
colors = ("red", "green", "blue")
coordinates = (10, 20)

# Dictionary (key-value pairs)
person = {
    "name": "Bob",
    "age": 30,
    "city": "New York"
}

# Checking type of a variable
print(type(age))        # <class 'int'>
print(type(name))       # <class 'str'>
print(type(is_sunny))   # <class 'bool'>`
    },
    {
      heading: "Working with Strings (Text)",
      body: "Strings are sequences of characters. You can manipulate them in many ways.",
      code: `# Creating strings
name = "Alice"
greeting = 'Hello'

# String concatenation (joining strings)
full_greeting = greeting + " " + name
print(full_greeting)  # Hello Alice

# String repetition
print("Ha" * 3)       # HaHaHa

# String methods
text = "  Hello World  "
print(text.upper())          # "  HELLO WORLD  "
print(text.lower())          # "  hello world  "
print(text.strip())          # "Hello World"
print(text.replace("World", "Python"))  # "  Hello Python  "

# String formatting methods
name = "Alice"
age = 25

# Method 1: f-strings (recommended)
print(f"My name is {name} and I am {age} years old")

# Method 2: format()
print("My name is {} and I am {} years old".format(name, age))

# Method 3: % formatting
print("My name is %s and I am %d years old" % (name, age))

# Getting string length
text = "Python"
print(len(text))  # 6

# Accessing characters (indexing)
print(text[0])    # P (first character)
print(text[-1])   # n (last character)

# Slicing strings (getting parts)
print(text[0:3])  # Pyt
print(text[2:])   # thon
print(text[::-1]) # nohtyP (reverse)`,
      note: "f-strings (formatted strings) are the modern and preferred way to format strings in Python."
    },
    {
      heading: "Numbers and Math Operations",
      body: "Python can perform all standard mathematical operations.",
      code: `# Basic arithmetic
a = 10
b = 3

print(a + b)    # 13 (addition)
print(a - b)    # 7 (subtraction)
print(a * b)    # 30 (multiplication)
print(a / b)    # 3.333... (division always returns float)
print(a // b)   # 3 (integer division - rounds down)
print(a % b)    # 1 (modulo - remainder)
print(a ** b)   # 1000 (exponent - 10 to the power of 3)

# Order of operations (PEMDAS)
result = (5 + 3) * 2 - 4 / 2
print(result)   # 14.0

# Math functions
import math  # Import the math module for advanced math

print(math.sqrt(16))      # 4.0 (square root)
print(math.pow(2, 3))     # 8.0 (2 to the power of 3)
print(math.floor(3.7))    # 3 (rounds down)
print(math.ceil(3.7))     # 4 (rounds up)
print(math.pi)            # 3.14159...
print(math.sin(math.pi/2)) # 1.0

# Rounding numbers
print(round(3.14))        # 3
print(round(3.78))        # 4
print(round(3.14159, 2))  # 3.14 (round to 2 decimals)

# Converting between types
x = 10
y = "20"
z = 3.14

print(int(y))           # 20 (string to integer)
print(float(x))         # 10.0 (integer to float)
print(str(z))           # "3.14" (float to string)`,
      note: "When you divide with /, the result is always a float. Use // for integer division when you need whole numbers."
    },
    {
      heading: "User Input - Getting Data from Users",
      body: "You can ask users for input using the input() function.",
      code: `# Simple user input
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Getting numbers (input() always returns a string)
age = input("Enter your age: ")
age = int(age)  # Convert string to integer
print(f"You are {age} years old")

# Getting a number with validation
try:
    age = int(input("Enter your age: "))
    print(f"Next year you will be {age + 1}")
except ValueError:
    print("Please enter a valid number!")

# Multiple inputs
first_name = input("First name: ")
last_name = input("Last name: ")
print(f"Your full name is {first_name} {last_name}")

# Input with default value
answer = input("Continue? (y/n): ") or "y"
print(f"You entered: {answer}")`,
      note: "Always convert user input to the appropriate type (int, float) when working with numbers."
    },
    {
      heading: "Comments - Making Your Code Understandable",
      body: "Comments are notes in your code that Python ignores. They help explain what your code does.",
      code: `# This is a single-line comment
print("Hello")  # This comment is on the same line

"""
This is a multi-line comment
It can span multiple lines
Python will ignore everything between the triple quotes
"""

# Good comment example:
# Calculate the average of three numbers
def calculate_average(num1, num2, num3):
    # Add all numbers together
    total = num1 + num2 + num3
    # Divide by the count (3) to get the average
    average = total / 3
    return average

# Bad comment example (too obvious):
# This adds 1 to x
x = x + 1

# Better:
# Increment the counter by 1
x = x + 1

# TODO comment - marks work to be done
# TODO: Add error handling for negative numbers
# TODO: Optimize this function for better performance`,
      note: "Good comments explain WHY, not WHAT. The code already shows what it does. Comments should explain the reasoning behind your approach."
    },
    {
      heading: "Basic Input/Output - Summary",
      body: "Here's a complete example that combines input, processing, and output:",
      code: `# A simple program that calculates age in months
print("Welcome to the Age Calculator!")
print("=" * 30)  # Prints a separator line

# Get user input
name = input("What is your name? ")
age = int(input("How old are you? "))  # Convert to integer

# Calculate months
months_old = age * 12
days_old = age * 365  # Approximately

# Display results
print(f"\\nHello {name}!")
print(f"You are {age} years old.")
print(f"That's approximately {months_old} months old.")
print(f"That's approximately {days_old} days old!")

# Ask if user wants to know more
more = input("\\nDo you want to know your age in minutes? (yes/no): ")

if more.lower() == "yes":
    minutes_old = age * 365 * 24 * 60  # Years * days * hours * minutes
    print(f"You are about {minutes_old:,} minutes old!")  # Adds commas for readability
else:
    print("Thanks for using the Age Calculator!")`
    }
  ]
}