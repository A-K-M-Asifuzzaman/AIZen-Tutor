import type { Lesson } from "../types"

export const PYTHON_MODULES: Lesson = {
  id: "python-modules",
  title: "Modules and Packages",
  category: "Python",
  content: [
    {
      heading: "Module Basics and Import Statements",
      body: "Python modules are files containing Python code that can be reused. The `import` statement allows you to use code from other modules.",
      code: `# Different import styles
import math  # Import entire module
from datetime import datetime  # Import specific item
from random import randint, choice  # Import multiple items
import os.path as path_ops  # Import with alias
from collections import defaultdict, Counter  # Import with alias

# Using imported items
print(math.sqrt(16))  # 4.0
print(datetime.now())  # Current time
print(randint(1, 10))  # Random integer between 1-10
print(choice(['a', 'b', 'c']))  # Random choice

# Import all items (generally discouraged)
from math import *
print(sin(0))  # 0.0

# Dynamic imports
module_name = "math"
import importlib
math_module = importlib.import_module(module_name)
print(math_module.sqrt(25))  # 5.0

# Creating your own module (save as my_module.py)
# my_module.py:
"""
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159
"""

# Importing your own module
# import my_module
# print(my_module.greet("Alice"))  # Hello, Alice!
# print(my_module.add(5, 3))  # 8

# Module reloading (during development)
# import importlib
# import my_module
# importlib.reload(my_module)  # Reload after changes

# __name__ == "__main__" pattern
if __name__ == "__main__":
    print("This script is being run directly")
    # Code here only runs when script is executed directly, not when imported

# Module search path
import sys
print(sys.path)  # List of directories where Python looks for modules

# Adding custom module paths
# sys.path.append("/path/to/your/modules")`
    },
    {
      heading: "Python Standard Library - Essential Modules",
      body: "Python comes with a rich standard library covering many common programming tasks.",
      code: `import os
import sys
import re
import math
import random
import time
import json
import pickle
import csv
import hashlib
import argparse
import logging
from datetime import datetime, timedelta
from collections import defaultdict, Counter, deque
from itertools import chain, product, permutations
from functools import reduce, lru_cache

# OS and File System
print(os.getcwd())  # Current working directory
print(os.listdir())  # List files in current directory
# os.mkdir("new_folder")  # Create directory
# os.rename("old.txt", "new.txt")  # Rename file
# os.remove("file.txt")  # Delete file
# os.path.exists("file.txt")  # Check if file exists
# os.path.join("folder", "file.txt")  # Platform-agnostic path joining

# System information
print(sys.version)  # Python version
print(sys.platform)  # OS platform
print(sys.argv)  # Command-line arguments

# Regular Expressions
text = "Hello 123 World 456"
numbers = re.findall(r'\\d+', text)
print(numbers)  # ['123', '456']

email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
emails = re.findall(email_pattern, "Contact us at test@example.com or support@test.com")
print(emails)

# Math operations
print(math.pi)  # 3.14159...
print(math.e)  # 2.71828...
print(math.factorial(5))  # 120
print(math.comb(5, 2))  # 10 (combinations)
print(math.gcd(48, 18))  # 6 (greatest common divisor)

# Random operations
random.seed(42)  # For reproducible results
print(random.random())  # Random float [0, 1)
print(random.randint(1, 100))  # Random integer
print(random.choice(['a', 'b', 'c']))  # Random choice
print(random.sample(range(10), 3))  # Random sample without replacement
random.shuffle([1, 2, 3, 4, 5])  # Shuffle in place

# Time operations
print(time.time())  # Unix timestamp
print(time.sleep(1))  # Sleep for 1 second
print(time.strftime("%Y-%m-%d %H:%M:%S"))  # Format current time

# Date and Time operations
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))
future = now + timedelta(days=7, hours=2)
print(future - now)  # Time delta

# JSON operations
data = {"name": "Alice", "age": 25}
json_string = json.dumps(data)  # Convert to JSON
parsed = json.loads(json_string)  # Parse JSON
print(parsed)

# File operations with JSON
# with open("data.json", "w") as f:
#     json.dump(data, f)
# with open("data.json", "r") as f:
#     loaded_data = json.load(f)

# Pickle (Python object serialization)
# import pickle
# with open("data.pkl", "wb") as f:
#     pickle.dump(data, f)
# with open("data.pkl", "rb") as f:
#     loaded = pickle.load(f)

# CSV operations
# with open("data.csv", "w", newline="") as f:
#     writer = csv.writer(f)
#     writer.writerow(["Name", "Age"])
#     writer.writerow(["Alice", 25])

# Hashing
text = "Hello World"
hash_object = hashlib.md5(text.encode())
print(hash_object.hexdigest())  # MD5 hash

# Command line arguments
# python script.py --name Alice --age 25
parser = argparse.ArgumentParser()
parser.add_argument("--name", help="Your name")
parser.add_argument("--age", type=int, help="Your age")
# args = parser.parse_args()
# print(args.name, args.age)

# Logging
logging.basicConfig(level=logging.INFO)
logging.info("This is an info message")
logging.warning("This is a warning")
logging.error("This is an error")

# Collections
# defaultdict: auto-initializes missing keys
counts = defaultdict(int)
counts["a"] += 1
print(counts)  # {'a': 1}

# Counter: counting objects
counter = Counter(['a', 'b', 'a', 'c', 'b', 'a'])
print(counter)  # Counter({'a': 3, 'b': 2, 'c': 1})

# deque: efficient queue operations
queue = deque([1, 2, 3])
queue.append(4)
queue.appendleft(0)
print(queue)  # deque([0, 1, 2, 3, 4])
print(queue.popleft())  # 0

# itertools: powerful iteration tools
print(list(chain([1, 2], [3, 4])))  # [1, 2, 3, 4]
print(list(product([1, 2], ['a', 'b'])))  # [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
print(list(permutations([1, 2, 3], 2)))  # [(1, 2), (1, 3), (2, 1), ...]

# functools
result = reduce(lambda x, y: x + y, [1, 2, 3, 4, 5])  # 15

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(40))  # Fast with caching`
    },
    {
      heading: "Creating and Organizing Packages",
      body: "A package is a directory with an __init__.py file. Packages can contain subpackages and modules.",
      code: `# Package structure:
"""
my_package/
    __init__.py          # Package initialization
    module1.py           # Module with functions
    module2.py           # Another module
    subpackage/          # Subpackage
        __init__.py      # Subpackage init
        module3.py       # Module inside subpackage
    data/                # Non-code data files
        config.json
    tests/               # Tests for the package
        test_module1.py
    requirements.txt     # Dependencies
    setup.py            # Package installation
    README.md           # Documentation
"""

# __init__.py example:
"""
# Package metadata
__version__ = "1.0.0"
__author__ = "Your Name"

# Import commonly used items to simplify imports
from .module1 import important_function
from .module2 import helper_function

# Control what's imported with 'from package import *'
__all__ = ['important_function', 'helper_function']

# Package initialization code
print(f"Loading package version {__version__}")
"""

# Using the package
# from my_package import important_function
# from my_package.module1 import specific_function
# from my_package.subpackage.module3 import nested_function

# Relative imports within the package
# In module1.py:
# from .module2 import helper  # Same package
# from ..subpackage.module3 import nested  # Parent package
# from . import module2  # Same package

# Package metadata (__init__.py)
"""
__all__ = ['module1', 'module2']  # Exported names
__version__ = '1.0.0'
__author__ = 'Your Name'
__license__ = 'MIT'
"""

# __main__.py for executable packages
# python -m my_package
# In my_package/__main__.py:
"""
if __name__ == "__main__":
    print("Running package as main")
    # Package entry point
"""

# Package discovery
# import pkgutil
# for module_info in pkgutil.iter_modules():
#     print(module_info.name)

# Namespace packages (Python 3.3+)
# Split packages across multiple directories
"""
# Directory structure:
project1/
    my_package/
        module1.py
project2/
    my_package/
        module2.py

# Both directories in sys.path
# my_package becomes a namespace package
# Can access: my_package.module1 and my_package.module2
"""`
    },
    {
      heading: "Third-Party Package Management",
      body: "Using pip to install and manage external packages from PyPI (Python Package Index).",
      code: `# Install packages
# pip install numpy
# pip install pandas
# pip install requests
# pip install flask

# Install specific version
# pip install numpy==1.21.0

# Install from requirements.txt
# pip install -r requirements.txt

# Create requirements.txt
# pip freeze > requirements.txt

# Install in development mode (editable)
# pip install -e .

# Uninstall packages
# pip uninstall numpy

# List installed packages
# pip list

# Show package info
# pip show numpy

# Using virtual environments (recommended)
# python -m venv venv
# source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows
# pip install numpy

# Using third-party packages
import requests
import numpy as np
import pandas as pd

# Requests - HTTP library
response = requests.get("https://api.github.com")
print(response.status_code)
print(response.json()[:2])  # First two users

# NumPy - numerical computing
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())  # 3.0
print(arr * 2)  # [2, 4, 6, 8, 10]

# Pandas - data analysis
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35]
})
print(df.describe())

# Flask - web framework
# from flask import Flask
# app = Flask(__name__)
# @app.route('/')
# def home():
#     return 'Hello, World!'
# app.run()

# Common useful packages:
# - numpy: Numerical computing
# - pandas: Data manipulation and analysis
# - requests: HTTP requests
# - flask/django: Web frameworks
# - pytest: Testing framework
# - black: Code formatter
# - mypy: Type checking
# - pylint: Code linting
# - jupyter: Interactive notebooks`
    },
    {
      heading: "Module and Package Best Practices",
      body: "Guidelines for creating clean, maintainable, and well-structured modules and packages.",
      code: `# 1. Module structure template
"""
# module_template.py
# Module docstring explaining purpose and usage
"""
Module description goes here.
Example: This module provides utilities for data processing.
"""

import os
import sys
from collections import defaultdict

# Constants (UPPER_CASE)
DEFAULT_TIMEOUT = 30
MAX_RETRIES = 3

# Private functions (leading underscore)
def _helper_function():
    # Internal use only
    pass

# Public functions
def public_function():
    """Function docstring with explanation."""
    pass

# Class definitions
class DataProcessor:
    """Class docstring with description."""
    def __init__(self):
        pass

# Module-level logger
import logging
logger = logging.getLogger(__name__)

# Avoid wildcard imports (from module import *)
# Define __all__ to control exports
__all__ = ['public_function', 'DataProcessor']

# Version information
__version__ = '1.0.0'

# Main guard
if __name__ == '__main__':
    # Code for testing the module
    pass
"""

# 2. Package structure best practices
"""
my_package/
    __init__.py          # Keep it minimal
    core.py             # Main functionality
    utils.py            # Utility functions
    exceptions.py       # Custom exceptions
    constants.py        # Constants
    models.py          # Data models
    services.py        # Business logic
    config.py          # Configuration
    tests/             # Tests (separate directory)
        test_core.py
        test_utils.py
    docs/              # Documentation
    examples/          # Example usage
    scripts/           # Command-line scripts
    data/              # Data files
"""

# 3. Import best practices
# Good
import os
import sys
from datetime import datetime
from collections import defaultdict

# Avoid
# from module import *  # Pollutes namespace

# Group imports:
# 1. Standard library
# 2. Third-party packages
# 3. Local imports

import json
import re

import numpy as np
import pandas as pd

from my_package import utils

# 4. Managing dependencies
"""
# pyproject.toml (modern approach)
[tool.poetry.dependencies]
python = "^3.9"
numpy = "^1.21.0"
pandas = "^1.3.0"
requests = "^2.26.0"

# requirements.txt (traditional approach)
numpy>=1.21.0,<2.0.0
pandas>=1.3.0,<2.0.0
requests>=2.26.0,<3.0.0
"""

# 5. Package discovery and entry points
# setup.py or pyproject.toml defines entry points
"""
# pyproject.toml
[project.scripts]
my-cli = "my_package.cli:main"

# Allows: my-cli command after package installation
"""

# 6. Documentation
"""
# Use docstrings for all public functions, classes, and modules
# Follow Google, NumPy, or Sphinx docstring style
# Include examples in docstrings
# Use type hints in function signatures

def process_data(
    data: List[Dict[str, Any]],
    options: Optional[Dict[str, Any]] = None
) -> pd.DataFrame:
    """
    Process a list of dictionaries into a DataFrame.
    
    Args:
        data: List of dictionaries containing the data
        options: Optional processing options
    
    Returns:
        DataFrame with processed data
        
    Raises:
        ValueError: If data is empty or malformed
        
    Examples:
        >>> data = [{"id": 1, "name": "Alice"}]
        >>> process_data(data)
           id   name
        0   1  Alice
    """
    pass
"""

# 7. Testing modules
"""
# Use pytest for testing
# Place tests in separate directory or module

# tests/test_module.py
import pytest
from my_package.core import process_data

def test_process_data_basic():
    data = [{"id": 1, "name": "Alice"}]
    result = process_data(data)
    assert len(result) == 1
    assert result.iloc[0]['name'] == 'Alice'

def test_process_data_empty():
    with pytest.raises(ValueError):
        process_data([])
"""

# 8. Versioning and releases
"""
# Semantic versioning: MAJOR.MINOR.PATCH
# 1.0.0 - Breaking changes
# 1.1.0 - New features (backwards compatible)
# 1.1.1 - Bug fixes (backwards compatible)

# Store version in __init__.py
# Keep CHANGELOG.md for changes
# Use git tags for releases
"""`
    },
    {
      heading: "Advanced Module Patterns",
      body: "Advanced techniques for working with modules, including dynamic imports, module caching, and lazy loading.",
      code: `# 1. Lazy loading modules
class LazyLoader:
    def __init__(self, module_name):
        self.module_name = module_name
        self._module = None
    
    def __getattr__(self, name):
        if self._module is None:
            self._module = __import__(self.module_name)
        return getattr(self._module, name)

# Usage: expensive module only loaded when accessed
math = LazyLoader("math")
print(math.sqrt(16))  # Module loaded here

# 2. Dynamic imports for plugins
def load_plugin(module_path):
    """Load a module dynamically based on string path."""
    module_parts = module_path.split('.')
    module = __import__(module_parts[0])
    for part in module_parts[1:]:
        module = getattr(module, part)
    return module

# Load plugin dynamically
# plugin = load_plugin("plugins.audio_processor")

# 3. Module caching and reloading
import sys
import importlib

def safe_reload(module_name):
    """Reload a module safely, handling dependencies."""
    if module_name in sys.modules:
        module = sys.modules[module_name]
        importlib.reload(module)
        return module
    return None

# 4. Creating custom import hooks
import sys
from importlib.abc import MetaPathFinder
from importlib.machinery import SourceFileLoader

class CustomFinder(MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        # Custom logic to find modules
        # Return a spec if found, else None
        pass

# 5. Module-level singletons
class ModuleSingleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# 6. Using __import__ for conditional imports
def get_computation_module(use_fast=False):
    if use_fast:
        return __import__('fast_computation')
    else:
        return __import__('standard_computation')

# 7. Plugin architecture with entry points
"""
# Register plugins via setup.py entry points
# Use pkg_resources to discover plugins

import pkg_resources

def load_plugins():
    plugins = {}
    for entry_point in pkg_resources.iter_entry_points('my_app.plugins'):
        plugin_class = entry_point.load()
        plugins[entry_point.name] = plugin_class()
    return plugins
"""

# 8. Environment-based configuration
import os

class Config:
    # Load from environment variables
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///default.db')
    
    @classmethod
    def load_from_file(cls, config_file):
        # Load configuration from file
        import json
        with open(config_file) as f:
            config = json.load(f)
        for key, value in config.items():
            setattr(cls, key, value)

# 9. Module hooks with context managers
import importlib
from contextlib import contextmanager

@contextmanager
def module_context(module_name, replacement):
    """Temporarily replace a module."""
    original = sys.modules.get(module_name)
    sys.modules[module_name] = replacement
    try:
        yield
    finally:
        if original:
            sys.modules[module_name] = original
        else:
            del sys.modules[module_name]

# 10. Directory-based module discovery
def discover_modules(directory, base_package=""):
    """Discover modules in a directory."""
    import os
    import importlib.util
    
    modules = []
    for file in os.listdir(directory):
        if file.endswith('.py') and not file.startswith('_'):
            name = file[:-3]  # Remove .py
            full_name = f"{base_package}.{name}" if base_package else name
            modules.append(full_name)
    return modules

# 11. Mocking modules for testing
from unittest.mock import patch

# Patch module for testing
# with patch('os.path.exists') as mock_exists:
#     mock_exists.return_value = True
#     # os.path.exists() returns True during test

# 12. Vendorized modules (vendoring)
"""
# Include external libraries in your package
vendor/
    external_lib/
        __init__.py
        ...

# Helps avoid dependency conflicts
"""`
    }
  ]
}