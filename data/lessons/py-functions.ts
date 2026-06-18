import type { Lesson } from "../types"

export const PYTHON_FUNCTIONS: Lesson = {
  id: "python-functions",
  title: "Functions in Python",
  category: "Python",
  content: [
    {
      heading: "Function Basics and Definitions",
      body: "Functions are reusable blocks of code. Use the `def` keyword to define them. Functions can have parameters, return values, and documentation strings.",
      code: `# Basic function definition
def greet(name):
    """Simple greeting function"""
    return f"Hello, {name}!"

# Function with multiple parameters
def add(a, b):
    return a + b

# Function with default parameters
def greet_person(name, greeting="Hello", punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet_person("Alice"))           # Hello, Alice!
print(greet_person("Bob", "Hi"))       # Hi, Bob!
print(greet_person("Charlie", "Hey", "?"))  # Hey, Charlie?

# Function with multiple return values
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([1, 2, 3, 4, 5])
print(minimum, maximum)  # 1 5

# Documenting functions (docstrings)
def calculate_average(numbers):
    """
    Calculate the average of a list of numbers.
    
    Args:
        numbers (list): List of numeric values
        
    Returns:
        float: The average of the numbers
        
    Raises:
        ValueError: If the list is empty
    """
    if not numbers:
        raise ValueError("Cannot calculate average of empty list")
    return sum(numbers) / len(numbers)

print(calculate_average.__doc__)  # Access docstring
help(calculate_average)  # Display help information`
    },
    {
      heading: "Arguments and Parameters",
      body: "Python functions support various parameter types: positional, keyword, default, variable-length, and keyword-only arguments.",
      code: `# Positional arguments (order matters)
def describe_person(name, age, city):
    return f"{name} is {age} years old from {city}"

# Keyword arguments (order doesn't matter)
print(describe_person(age=25, city="NYC", name="Alice"))

# Mixing positional and keyword (positional first)
print(describe_person("Bob", city="LA", age=30))

# Default parameters (must come after positional)
def create_user(name, age=18, city="Unknown"):
    return {"name": name, "age": age, "city": city}

print(create_user("Alice"))           # age=18, city="Unknown"
print(create_user("Bob", 25))         # age=25, city="Unknown"
print(create_user("Charlie", city="NYC"))  # age=18, city="NYC"

# Variable-length arguments (*args) - tuple of positional args
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all(10, 20))         # 30

# Variable-length keyword arguments (**kwargs) - dict of keyword args
def print_person(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_person(name="Alice", age=25, city="NYC", job="Engineer")

# Combining *args and **kwargs
def flexible_function(*args, **kwargs):
    print(f"Positional args: {args}")
    print(f"Keyword args: {kwargs}")

flexible_function(1, 2, 3, name="Alice", age=25)

# Keyword-only arguments (Python 3+)
def configure_server(host, port, *, debug=False, timeout=30):
    return {
        "host": host,
        "port": port,
        "debug": debug,
        "timeout": timeout
    }

# debug and timeout must be keyword arguments
config = configure_server("localhost", 8080, debug=True, timeout=60)

# Positional-only arguments (Python 3.8+)
def divide(a, b, /):
    """a and b must be positional-only"""
    return a / b

# This works: divide(10, 2)
# This fails: divide(a=10, b=2)  # TypeError

# Unpacking arguments
def add_three(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add_three(*numbers))  # Unpack list: 6

params = {"a": 10, "b": 20, "c": 30}
print(add_three(**params))  # Unpack dict: 60`
    },
    {
      heading: "Lambda Functions",
      body: "Lambda functions are anonymous, single-expression functions created with the `lambda` keyword. They're useful for short, simple operations.",
      code: `# Basic lambda syntax
square = lambda x: x ** 2
print(square(5))  # 25

# Lambda with multiple arguments
add = lambda a, b: a + b
print(add(3, 5))  # 8

# Lambda with conditional expression
max_value = lambda a, b: a if a > b else b
print(max_value(10, 20))  # 20

# Using lambda with map()
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Using lambda with filter()
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# Using lambda with sorted()
people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 20}
]
sorted_by_age = sorted(people, key=lambda p: p["age"])
print(sorted_by_age)

# Using lambda with reduce()
from functools import reduce
product = reduce(lambda x, y: x * y, numbers)
print(product)  # 120

# Lambda with default arguments (capturing values)
multipliers = [lambda x, i=i: x * i for i in range(5)]
print([m(2) for m in multipliers])  # [0, 2, 4, 6, 8]

# Limitations: lambda can only contain expressions, not statements
# Works: lambda x: x ** 2
# Doesn't work: lambda x: x = x + 1; return x`
    },
    {
      heading: "Decorators",
      body: "Decorators are functions that modify the behavior of other functions. They're a powerful feature for adding functionality like logging, timing, access control, and caching.",
      code: `# Basic decorator structure
def timer(func):
    """Decorator that measures execution time"""
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "Done"

print(slow_function())
# Output: slow_function took 1.0001 seconds
#         Done

# Decorator with arguments
def repeat(times):
    """Decorator that repeats a function n times"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(3)
def say_hello(name):
    return f"Hello, {name}!"

print(say_hello("Alice"))  # ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']

# Multiple decorators
def uppercase(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@timer
@uppercase
def get_message(name):
    return f"Hello, {name}!"

print(get_message("Bob"))  # HELLO, BOB! with timing

# Class-based decorator
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call {self.count} of {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # Call 1 of greet
print(greet("Bob"))    # Call 2 of greet

# Preserving function metadata with wraps
from functools import wraps

def logger(func):
    @wraps(func)  # Preserves function name and docstring
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logger
def example():
    """Example function documentation"""
    pass

print(example.__name__)  # example (not wrapper)
print(example.__doc__)   # Example function documentation

# Practical: Cache decorator (memoization)
def cache(func):
    """Cache results of function calls"""
    cached_results = {}
    @wraps(func)
    def wrapper(*args):
        if args in cached_results:
            return cached_results[args]
        result = func(*args)
        cached_results[args] = result
        return result
    return wrapper

@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(40))  # Fast with caching`
    },
    {
      heading: "Closures and Scopes",
      body: "Closures are functions that capture variables from their enclosing scope. Understanding scopes (local, enclosing, global, built-in) is crucial.",
      code: `# Global scope
x = 10  # Global variable

def outer():
    y = 20  # Enclosing variable
    
    def inner():
        z = 30  # Local variable
        return x + y + z  # Accesses all three scopes
    
    return inner

closure = outer()
print(closure())  # 60

# Modifying variables in different scopes
counter = 0  # Global

def increment():
    global counter  # Need global to modify global variable
    counter += 1
    return counter

print(increment())  # 1
print(increment())  # 2

# Nonlocal for enclosing scopes
def make_counter():
    count = 0
    
    def counter():
        nonlocal count  # Need nonlocal to modify enclosing variable
        count += 1
        return count
    
    return counter

counter = make_counter()
print(counter())  # 1
print(counter())  # 2

# Practical closure: Creating function factories
def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# Closure with state
def make_account(initial_balance):
    balance = initial_balance
    
    def deposit(amount):
        nonlocal balance
        balance += amount
        return balance
    
    def withdraw(amount):
        nonlocal balance
        if amount > balance:
            raise ValueError("Insufficient funds")
        balance -= amount
        return balance
    
    def get_balance():
        return balance
    
    return {"deposit": deposit, "withdraw": withdraw, "balance": get_balance}

account = make_account(100)
print(account["deposit"](50))   # 150
print(account["withdraw"](30))  # 120
print(account["balance"]())     # 120

# Common pitfall: Late binding in closures
def create_multipliers():
    return [lambda x: x * i for i in range(5)]

multipliers = create_multipliers()
print([m(2) for m in multipliers])  # [8, 8, 8, 8, 8] (all use i=4)

# Fix: Capture value by default argument
def create_multipliers_fixed():
    return [lambda x, i=i: x * i for i in range(5)]

multipliers = create_multipliers_fixed()
print([m(2) for m in multipliers])  # [0, 2, 4, 6, 8]`
    },
    {
      heading: "Generator Functions",
      body: "Generator functions use `yield` to produce a sequence of values lazily. They're memory-efficient for large sequences.",
      code: `# Basic generator
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

# Using generator
for num in count_up_to(5):
    print(num)  # 1, 2, 3, 4, 5

# Generator with multiple yields
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
print([next(fib) for _ in range(10)])  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Generator expression (like list comprehension but lazy)
squares_gen = (x**2 for x in range(10))
print(list(squares_gen))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Memory comparison: generator vs list
import sys
list_squares = [x**2 for x in range(1000000)]
gen_squares = (x**2 for x in range(1000000))
print(sys.getsizeof(list_squares))  # ~8MB
print(sys.getsizeof(gen_squares))   # ~112 bytes

# Generator with send() and close()
def interactive_gen():
    while True:
        received = yield
        print(f"Received: {received}")

gen = interactive_gen()
next(gen)  # Prime the generator
gen.send("Hello")  # Received: Hello
gen.send("World")  # Received: World
gen.close()  # Stop generator

# Generator as pipeline
def read_file_lines(filename):
    with open(filename, 'r') as file:
        for line in file:
            yield line.strip()

def filter_lines(lines, keyword):
    for line in lines:
        if keyword in line:
            yield line

# Efficient pipeline (lazy evaluation)
# lines = filter_lines(read_file_lines('data.txt'), 'error')

# Recursive generator for tree traversal
def traverse_tree(node):
    yield node['value']
    for child in node.get('children', []):
        yield from traverse_tree(child)  # yield from for delegation

tree = {
    'value': 1,
    'children': [
        {'value': 2, 'children': [{'value': 4}, {'value': 5}]},
        {'value': 3}
    ]
}
print(list(traverse_tree(tree)))  # [1, 2, 4, 5, 3]`
    },
    {
      heading: "Advanced Function Patterns",
      body: "Modern Python patterns including functools, partial functions, and functional programming techniques.",
      code: `from functools import partial, lru_cache, singledispatch

# Partial functions (fixing arguments)
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125

# LRU Cache (Least Recently Used) for expensive functions
@lru_cache(maxsize=128)
def expensive_function(n):
    import time
    time.sleep(1)  # Simulate expensive computation
    return n * n

# First call takes time, subsequent calls are instant
print(expensive_function(10))  # Takes ~1 second
print(expensive_function(10))  # Instant (cached)

# Single dispatch (polymorphic functions)
@singledispatch
def process_data(data):
    raise TypeError(f"Unsupported type: {type(data)}")

@process_data.register(int)
def _(data):
    return f"Processing integer: {data}"

@process_data.register(str)
def _(data):
    return f"Processing string: {data}"

@process_data.register(list)
def _(data):
    return f"Processing list of length {len(data)}"

print(process_data(42))        # Processing integer: 42
print(process_data("hello"))   # Processing string: hello
print(process_data([1, 2, 3])) # Processing list of length 3

# Type hints with functions
from typing import Callable, List, Optional, TypeVar, Union

T = TypeVar('T')

def map_function(
    func: Callable[[T], T],
    items: List[T],
    default: Optional[T] = None
) -> List[T]:
    return [func(item) if item else default for item in items]

# Functions as first-class citizens
def apply_operation(operation, x, y):
    return operation(x, y)

def add(x, y): return x + y
def multiply(x, y): return x * y

print(apply_operation(add, 5, 3))       # 8
print(apply_operation(multiply, 5, 3))  # 15

# Composition of functions
def compose(f, g):
    """Return a new function h = f(g(x))"""
    return lambda x: f(g(x))

def add_one(x): return x + 1
def double(x): return x * 2

add_one_then_double = compose(double, add_one)
double_then_add_one = compose(add_one, double)

print(add_one_then_double(5))  # double(add_one(5)) = double(6) = 12
print(double_then_add_one(5))  # add_one(double(5)) = add_one(10) = 11

# Context manager with function (using contextlib)
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"Elapsed: {end - start:.4f} seconds")

with timer():
    # Code block to time
    import time
    time.sleep(0.5)`
    },
    {
      heading: "Best Practices and Common Pitfalls",
      body: "Important guidelines, patterns, and common mistakes to avoid when working with functions.",
      code: `# 1. Mutable default arguments (common pitfall)
def append_to_list(value, lst=[]):  # Bad! Default list persists
    lst.append(value)
    return lst

# This will accumulate items across calls
print(append_to_list(1))  # [1]
print(append_to_list(2))  # [1, 2] (unexpected!)

# Correct approach
def append_to_list_fixed(value, lst=None):
    if lst is None:
        lst = []
    lst.append(value)
    return lst

# 2. Using *args and **kwargs for wrappers
def wrapper_function(*args, **kwargs):
    # Pass through to another function
    return actual_function(*args, **kwargs)

# 3. Docstring best practices
def calculate_total(prices, tax_rate=0.1):
    """
    Calculate total price including tax.
    
    Args:
        prices (list): List of item prices
        tax_rate (float, optional): Tax rate as decimal. Default 0.1 (10%)
    
    Returns:
        float: Total including tax
        
    Examples:
        >>> calculate_total([10, 20])
        33.0
        >>> calculate_total([5, 15], 0.08)
        21.6
    """
    subtotal = sum(prices)
    return subtotal * (1 + tax_rate)

# 4. Use descriptive function names
# Bad: def process(x): ...
# Good: def calculate_average(numbers): ...

# 5. Keep functions focused (Single Responsibility)
# Bad: Does many things
def process_user_data(user_data):
    # Validate, transform, save, send email, ...
    pass

# Good: Each function does one thing
def validate_user(user_data): pass
def transform_user_data(user_data): pass
def save_user(user_data): pass
def send_welcome_email(user): pass

# 6. Use type hints for clarity
def process_users(
    users: List[Dict[str, Union[str, int]]],
    filter_enabled: bool = True
) -> List[Dict[str, str]]:
    return [{"name": str(user["name"])} for user in users if filter_enabled]

# 7. Use keyword arguments for clarity
# Hard to understand
create_user("Alice", 25, "NYC", "alice@email.com", True)

# Clear and self-documenting
create_user(
    name="Alice",
    age=25,
    city="NYC",
    email="alice@email.com",
    is_active=True
)

# 8. Function composition with pipe-like patterns
from functools import reduce

def pipe(*functions):
    def apply(value):
        return reduce(lambda x, f: f(x), functions, value)
    return apply

# Chain functions together
process = pipe(
    str.strip,
    lambda x: x.lower(),
    lambda x: x.replace(" ", "_")
)

print(process("  Hello World  "))  # "hello_world"

# 9. Validate arguments early (fail fast)
def divide_numbers(a, b):
    if not isinstance(a, (int, float)):
        raise TypeError("a must be a number")
    if not isinstance(b, (int, float)):
        raise TypeError("b must be a number")
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# 10. Use meaningful return values
# Bad: Return None to indicate error
def find_user(user_id):
    return user_data.get(user_id) or None

# Good: Raise exceptions for errors
def find_user_robust(user_id):
    user = user_data.get(user_id)
    if user is None:
        raise ValueError(f"User {user_id} not found")
    return user`
    }
  ]
}