import type { Lesson } from "../types"


export const PYTHON_FILE_IO: Lesson = {
  id: "python-file-io",
  title: "File I/O and Exception Handling",
  category: "Python",
  content: [
    {
      heading: "Reading and Writing Files",
      body: "Use the `open()` function with context manager (`with` statement) for automatic file closing.",
      code: `# Writing to a file
with open("example.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("This is line 2.")

# Reading entire file
with open("example.txt", "r") as file:
    content = file.read()
    print(content)

# Reading line by line
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())

# Appending to file
with open("example.txt", "a") as file:
    file.write("\\nAppended line.")

# Reading with different modes
with open("example.txt", "r") as file:
    # Read first 10 characters
    print(file.read(10))
    # Read one line
    print(file.readline())
    # Read all lines as list
    lines = file.readlines()

# Reading binary files
with open("image.jpg", "rb") as file:
    binary_data = file.read()`,
      note: "Always use the `with` statement when working with files. It automatically closes the file, even if an exception occurs."
    },
    {
      heading: "File Modes and Operations",
      body: "Python supports various file modes for different operations. Understanding these modes is crucial for proper file handling.",
      code: `# File modes explained
# 'r' - Read (default)
# 'w' - Write (overwrites existing content)
# 'a' - Append (adds to end of file)
# 'x' - Create (exclusive creation, fails if file exists)
# 't' - Text mode (default)
# 'b' - Binary mode
# '+' - Read and write

# Reading and writing (r+ mode)
with open("example.txt", "r+") as file:
    content = file.read()
    print("Original:", content)
    file.write("\\nNew line added with r+ mode")

# Writing and reading (w+ mode)
with open("new_file.txt", "w+") as file:
    file.write("This is a new file")
    file.seek(0)  # Move cursor to beginning
    content = file.read()
    print(content)

# Creating a file (fails if exists)
try:
    with open("new_file.txt", "x") as file:
        file.write("This file shouldn't exist yet")
except FileExistsError:
    print("File already exists!")

# Reading large files efficiently
with open("large_file.txt", "r") as file:
    for line in file:  # Memory efficient
        process_line(line)

# Using file.tell() and file.seek()
with open("example.txt", "r+") as file:
    print(file.tell())  # Current position (0)
    file.write("Start of file")
    file.seek(10)  # Move to position 10
    print(file.tell())  # 10
    print(file.read(5))  # Read 5 characters from position 10`,
      note: "Use 'w' mode carefully as it overwrites the entire file. For appending without overwriting, use 'a' mode."
    },
    {
      heading: "Exception Handling - Try/Except/Else/Finally",
      body: "Exception handling allows you to gracefully handle errors and maintain program flow.",
      code: `# Basic try-except
try:
    num = int(input("Enter a number: "))
    result = 10 / num
    print(f"Result: {result}")
except ValueError:
    print("Invalid input! Please enter a number.")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# Try-except-else-finally
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found!")
else:
    print("File read successfully")
    print(content)
finally:
    try:
        file.close()
        print("File closed")
    except:
        pass

# Catching multiple exceptions
try:
    result = 10 / int(input("Enter a number: "))
except (ValueError, ZeroDivisionError) as e:
    print(f"Error: {e}")

# Getting exception details
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    print(f"Args: {e.args}")

# Raising exceptions
def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is not allowed")
    return a / b

try:
    divide(10, 0)
except ValueError as e:
    print(f"Error: {e}")

# Custom exceptions
class NegativeNumberError(Exception):
    pass

def square_root(n):
    if n < 0:
        raise NegativeNumberError("Cannot calculate square root of negative number")
    return n ** 0.5

try:
    print(square_root(-5))
except NegativeNumberError as e:
    print(f"Custom error: {e}")`,
      note: "The `finally` block always executes, making it perfect for cleanup operations like closing files or releasing resources."
    },
    {
      heading: "Working with CSV Files",
      body: "CSV (Comma-Separated Values) is a common format for data exchange. Python's csv module provides robust handling.",
      code: `import csv

# Writing CSV
data = [
    ["Name", "Age", "City", "Occupation"],
    ["Alice", 25, "NYC", "Engineer"],
    ["Bob", 30, "LA", "Designer"],
    ["Charlie", 35, "Chicago", "Manager"]
]

with open("people.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Writing CSV with custom delimiter
with open("data.tsv", "w", newline="") as file:
    writer = csv.writer(file, delimiter='\\t')
    writer.writerows(data)

# Reading CSV
with open("people.csv", "r", encoding="utf-8") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Reading CSV as dictionaries
with open("people.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['Name']} is {row['Age']} years old from {row['City']}")

# Writing CSV from dictionaries
fieldnames = ["Name", "Age", "City", "Occupation"]
people = [
    {"Name": "David", "Age": 28, "City": "Boston", "Occupation": "Developer"},
    {"Name": "Eva", "Age": 32, "City": "Seattle", "Occupation": "Architect"}
]

with open("people_dict.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(people)

# Handling CSV with quotes
data_with_quotes = [
    ["Name", "Description"],
    ["Alice", "Software Engineer, Python"],
    ["Bob", "Data Scientist, AI"],
]

with open("quoted.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file, quoting=csv.QUOTE_ALL)
    writer.writerows(data_with_quotes)

# Reading CSV with specific encoding
try:
    with open("people.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            print(row)
except UnicodeDecodeError:
    with open("people.csv", "r", encoding="latin-1") as file:
        reader = csv.reader(file)
        for row in reader:
            print(row)`,
      note: "Always specify `newline=''` when writing CSV files to prevent extra newline characters. Use `encoding='utf-8'` for international text support."
    },
    {
      heading: "Working with JSON Files",
      body: "JSON (JavaScript Object Notation) is widely used for data exchange. Python's json module handles serialization and deserialization.",
      code: `import json

# Writing JSON
data = {
    "name": "Alice",
    "age": 25,
    "city": "NYC",
    "hobbies": ["reading", "coding"],
    "address": {
        "street": "123 Main St",
        "zip": "10001"
    },
    "active": True,
    "score": 95.5
}

with open("data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2, sort_keys=True)

# Reading JSON
with open("data.json", "r", encoding="utf-8") as file:
    loaded_data = json.load(file)
    print(loaded_data["name"])
    print(loaded_data["hobbies"][0])
    print(loaded_data["address"]["street"])

# JSON string operations
json_string = '{"name": "Bob", "age": 30, "city": "LA"}'
parsed = json.loads(json_string)
print(parsed["name"])

# Convert Python dict to JSON string
python_dict = {"name": "Charlie", "age": 35}
json_string = json.dumps(python_dict, indent=2)
print(json_string)

# Pretty printing JSON
import json
data = {"name": "Alice", "age": 25, "hobbies": ["reading", "coding"]}
print(json.dumps(data, indent=4, sort_keys=True))

# Handling non-serializable objects
from datetime import datetime

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Person):
        return {"name": obj.name, "age": obj.age}
    raise TypeError(f"Type {type(obj)} not serializable")

person = Person("Alice", 25)
now = datetime.now()

data = {
    "person": person,
    "timestamp": now
}

with open("complex_data.json", "w") as file:
    json.dump(data, file, default=custom_serializer, indent=2)

# Custom JSON decoder
def custom_decoder(dict_obj):
    if "name" in dict_obj and "age" in dict_obj:
        return Person(dict_obj["name"], dict_obj["age"])
    return dict_obj

with open("complex_data.json", "r") as file:
    loaded = json.load(file, object_hook=custom_decoder)
    print(loaded["person"].name)`,
      note: "JSON supports basic data types: strings, numbers, booleans, arrays, objects, and null. For complex Python objects, define custom serialization functions."
    },
    {
      heading: "Working with Pickle Files",
      body: "Pickle is Python's native serialization format, capable of serializing any Python object. Use it with caution for security reasons.",
      code: `import pickle

# Writing to pickle file
data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "coding"],
    "scores": [98, 95, 92],
    "active": True
}

with open("data.pickle", "wb") as file:
    pickle.dump(data, file)

# Reading from pickle file
with open("data.pickle", "rb") as file:
    loaded_data = pickle.load(file)
    print(loaded_data)

# Pickling multiple objects
obj1 = {"name": "Alice", "age": 25}
obj2 = ["Bob", "Charlie", "David"]
obj3 = ("New York", "LA", "Chicago")

with open("multiple.pickle", "wb") as file:
    pickle.dump(obj1, file)
    pickle.dump(obj2, file)
    pickle.dump(obj3, file)

# Reading multiple pickled objects
with open("multiple.pickle", "rb") as file:
    try:
        while True:
            obj = pickle.load(file)
            print(obj)
    except EOFError:
        pass  # End of file

# Pickling custom classes
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def __repr__(self):
        return f"Student({self.name}, {self.grade})"

student = Student("Alice", "A")

with open("student.pickle", "wb") as file:
    pickle.dump(student, file)

with open("student.pickle", "rb") as file:
    loaded_student = pickle.load(file)
    print(loaded_student)

# Security considerations
# Only unpickle data from trusted sources
# Pickle can execute arbitrary code during unpickling

# Alternative: JSON for cross-language compatibility
# Use pickle only for Python-to-Python communication`,
      note: "Pickle is not secure against malicious data. Use JSON or other formats for untrusted data. Pickle is best for Python-specific serialization in trusted environments."
    },
    {
      heading: "File and Directory Operations (os/shutil)",
      body: "Python's os and shutil modules provide file system operations like moving, copying, and deleting files.",
      code: `import os
import shutil
from pathlib import Path

# Current working directory
print(os.getcwd())
os.chdir("/path/to/directory")
print(os.getcwd())

# Directory operations
os.mkdir("new_directory")  # Create directory
os.makedirs("dir1/dir2/dir3")  # Create nested directories

# List directory contents
for item in os.listdir("."):
    print(item)

# Check if path exists
print(os.path.exists("example.txt"))
print(os.path.isfile("example.txt"))
print(os.path.isdir("directory"))

# File information
print(os.path.getsize("example.txt"))
print(os.path.getmtime("example.txt"))  # Modification time
print(os.path.getctime("example.txt"))  # Creation time

# Path operations
path = "dir1/dir2/file.txt"
print(os.path.basename(path))  # file.txt
print(os.path.dirname(path))   # dir1/dir2
print(os.path.join("dir1", "dir2", "file.txt"))

# Copying files
shutil.copy("source.txt", "destination.txt")
shutil.copy2("source.txt", "destination.txt")  # Preserves metadata

# Moving/renaming files
shutil.move("old_name.txt", "new_name.txt")

# Removing files and directories
os.remove("file.txt")  # Delete file
os.rmdir("empty_directory")  # Delete empty directory
shutil.rmtree("directory")  # Delete directory and all contents

# Walk directory tree
for root, dirs, files in os.walk("."):
    print(f"Directory: {root}")
    for file in files:
        print(f"  File: {file}")

# Using pathlib (modern approach)
from pathlib import Path

path = Path("example.txt")
print(path.exists())
print(path.is_file())
print(path.parent)
print(path.stem)  # filename without extension
print(path.suffix)  # file extension

# Creating directories with pathlib
Path("new_dir").mkdir(exist_ok=True)
Path("dir1/dir2").mkdir(parents=True, exist_ok=True)

# Reading all files in a directory
for file_path in Path(".").glob("*.txt"):
    print(file_path)

# Recursive glob
for file_path in Path(".").glob("**/*.py"):
    print(file_path)`,
      note: "Pathlib provides an object-oriented approach to file system operations and is recommended for new code. It's more readable and cross-platform friendly."
    },
    {
      heading: "Working with Different File Formats",
      body: "Python supports various file formats beyond CSV and JSON. Here's how to work with common formats.",
      code: `# XML parsing (xml.etree.ElementTree)
import xml.etree.ElementTree as ET

# Creating XML
root = ET.Element("books")
book1 = ET.SubElement(root, "book", id="1")
ET.SubElement(book1, "title").text = "Python Programming"
ET.SubElement(book1, "author").text = "John Doe"
ET.SubElement(book1, "year").text = "2023"

book2 = ET.SubElement(root, "book", id="2")
ET.SubElement(book2, "title").text = "Data Science"
ET.SubElement(book2, "author").text = "Jane Smith"
ET.SubElement(book2, "year").text = "2022"

tree = ET.ElementTree(root)
tree.write("books.xml", encoding="utf-8", xml_declaration=True)

# Reading XML
tree = ET.parse("books.xml")
root = tree.getroot()

for book in root.findall("book"):
    title = book.find("title").text
    author = book.find("author").text
    print(f"Book: {title} by {author}")

# YAML (requires pyyaml: pip install pyyaml)
import yaml

# Writing YAML
data = {
    "name": "Alice",
    "age": 25,
    "address": {
        "street": "123 Main St",
        "city": "NYC"
    },
    "hobbies": ["reading", "coding"]
}

with open("data.yaml", "w") as file:
    yaml.dump(data, file, default_flow_style=False)

# Reading YAML
with open("data.yaml", "r") as file:
    loaded_data = yaml.safe_load(file)
    print(loaded_data)

# Excel files (requires openpyxl or pandas)
# pip install openpyxl
from openpyxl import Workbook, load_workbook

# Writing Excel
wb = Workbook()
ws = wb.active
ws.title = "People"

ws["A1"] = "Name"
ws["B1"] = "Age"
ws["C1"] = "City"

ws.append(["Alice", 25, "NYC"])
ws.append(["Bob", 30, "LA"])
ws.append(["Charlie", 35, "Chicago"])

wb.save("people.xlsx")

# Reading Excel
wb = load_workbook("people.xlsx")
ws = wb.active

for row in ws.iter_rows(values_only=True):
    print(row)

# Using pandas for easier data handling
# pip install pandas openpyxl
import pandas as pd

df = pd.read_excel("people.xlsx")
print(df)

# Write to Excel with pandas
df.to_excel("people_pandas.xlsx", index=False)`,
      note: "Choose the appropriate format based on your needs: XML for structured data, YAML for configuration, Excel for spreadsheet data. Install required packages via pip."
    },
    {
      heading: "Exception Best Practices and Patterns",
      body: "Learn best practices for exception handling to write robust, maintainable code.",
      code: `# Pattern 1: Don't swallow exceptions
# Bad
try:
    result = dangerous_operation()
except:
    pass  # Silent failure - DON'T DO THIS

# Good
try:
    result = dangerous_operation()
except Exception as e:
    print(f"Operation failed: {e}")
    raise  # Re-raise or handle appropriately

# Pattern 2: Specific exceptions first
try:
    result = int(input("Enter number: "))
    print(10 / result)
except ZeroDivisionError:
    print("Cannot divide by zero")
except ValueError:
    print("Invalid input")
except Exception as e:
    print(f"Unexpected error: {e}")

# Pattern 3: Resource cleanup with try-finally
file = None
try:
    file = open("data.txt", "r")
    content = file.read()
finally:
    if file:
        file.close()  # Always closes file

# Pattern 4: Context managers for resource management
with open("data.txt", "r") as file:
    content = file.read()  # Automatically closes file

# Pattern 5: Retry logic
import time

def retry_operation(max_retries=3, delay=1):
    for attempt in range(max_retries):
        try:
            # Risky operation
            return perform_operation()
        except Exception as e:
            if attempt == max_retries - 1:
                raise  # Re-raise on last attempt
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)  # Wait before retry

# Pattern 6: Exception chains
try:
    result = int("abc")
except ValueError as e:
    raise RuntimeError("Failed to convert input") from e

# Pattern 7: Logging exceptions
import logging
logging.basicConfig(level=logging.ERROR)

try:
    risky_operation()
except Exception as e:
    logging.error("Operation failed", exc_info=True)
    # exc_info=True includes stack trace

# Pattern 8: User-friendly error messages
def get_user_data():
    try:
        age = int(input("Enter your age: "))
        if age < 0 or age > 150:
            raise ValueError("Age must be between 0 and 150")
        return age
    except ValueError as e:
        print(f"Invalid input: {e}")
        return None

# Pattern 9: Custom exception hierarchy
class AppError(Exception):
    """Base exception for application"""
    pass

class ValidationError(AppError):
    """Raised when validation fails"""
    pass

class DataNotFoundError(AppError):
    """Raised when data is not found"""
    pass

def get_user(user_id):
    try:
        if user_id < 1:
            raise ValidationError("Invalid user ID")
        # Simulate database lookup
        if user_id > 100:
            raise DataNotFoundError(f"User {user_id} not found")
        return {"id": user_id, "name": "Alice"}
    except AppError as e:
        print(f"Application error: {e}")
        return None`,
      note: "Good exception handling is crucial for building reliable applications. Never use bare except blocks without logging or re-raising. Always be specific about which exceptions you're handling."
    },
    {
      heading: "Context Managers and Resource Management",
      body: "Context managers ensure proper resource cleanup. Python provides built-in context managers and supports custom ones.",
      code: `# Built-in context managers
# File handling
with open("file.txt", "r") as file:
    content = file.read()

# Lock acquisition
import threading
lock = threading.Lock()
with lock:
    # Critical section
    pass

# Database connections
import sqlite3
with sqlite3.connect("database.db") as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()

# Temporary files
import tempfile
with tempfile.TemporaryFile() as temp:
    temp.write(b"Temporary data")
    temp.seek(0)
    print(temp.read())

# Custom context manager using class
class ManagedFile:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        # Handle exceptions if needed
        return False  # Propagate exceptions

with ManagedFile("test.txt", "w") as file:
    file.write("Hello, World!")

# Custom context manager using contextlib
from contextlib import contextmanager

@contextmanager
def managed_file(filename, mode):
    file = open(filename, mode)
    try:
        yield file
    finally:
        file.close()

with managed_file("test.txt", "w") as file:
    file.write("Hello, World!")

# Nested context managers
with open("source.txt", "r") as source, open("dest.txt", "w") as dest:
    dest.write(source.read())

# Context manager for timing
import time
from contextlib import contextmanager

@contextmanager
def timer(name):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{name} took {elapsed:.2f} seconds")

with timer("Sleep operation"):
    time.sleep(1)

# Multiple context managers with contextlib.ExitStack
from contextlib import ExitStack

files = ["file1.txt", "file2.txt", "file3.txt"]
with ExitStack() as stack:
    open_files = [stack.enter_context(open(f, "r")) for f in files]
    # Work with multiple files
    for f in open_files:
        print(f.read())`,
      note: "Context managers are Python's way of ensuring resources are properly managed. The `with` statement makes code cleaner and prevents resource leaks. Always use them for files, locks, connections, and other resources."
    },
    {
      heading: "Real-World Example: Data Processing Pipeline",
      body: "Complete example combining file I/O, exception handling, and data processing in a practical scenario.",
      code: `import csv
import json
import logging
import os
from datetime import datetime
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('processing.log'),
        logging.StreamHandler()
    ]
)

class DataProcessor:
    def __init__(self, input_dir, output_dir, archive_dir):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.archive_dir = Path(archive_dir)
        self.stats = {
            'processed': 0,
            'errors': 0,
            'skipped': 0
        }
        
        # Create directories if they don't exist
        for dir_path in [self.input_dir, self.output_dir, self.archive_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def process_csv_file(self, file_path):
        """Process a single CSV file"""
        processed_data = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    try:
                        # Validate required fields
                        if not row.get('name') or not row.get('amount'):
                            self.stats['skipped'] += 1
                            continue
                        
                        # Data cleaning
                        row['name'] = row['name'].strip().title()
                        row['amount'] = float(row['amount'])
                        row['date'] = row.get('date', datetime.now().strftime('%Y-%m-%d'))
                        
                        # Additional processing
                        row['processed_at'] = datetime.now().isoformat()
                        
                        processed_data.append(row)
                        self.stats['processed'] += 1
                        
                    except ValueError as e:
                        self.stats['errors'] += 1
                        logging.error(f"Error processing row in {file_path.name}: {e}")
                    except Exception as e:
                        self.stats['errors'] += 1
                        logging.error(f"Unexpected error in {file_path.name}: {e}")
                        
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
            return None
        except PermissionError:
            logging.error(f"Permission denied: {file_path}")
            return None
        except Exception as e:
            logging.error(f"Error reading file {file_path.name}: {e}")
            return None
        
        return processed_data
    
    def save_processed_data(self, data, original_filename):
        """Save processed data to JSON"""
        if not data:
            return
        
        output_file = self.output_dir / f"{original_filename.stem}_processed.json"
        
        try:
            with open(output_file, 'w', encoding='utf-8') as file:
                json.dump(data, file, indent=2, ensure_ascii=False)
            logging.info(f"Saved processed data to {output_file}")
        except Exception as e:
            logging.error(f"Error saving {output_file}: {e}")
            raise
    
    def archive_file(self, file_path):
        """Archive processed file"""
        try:
            archive_path = self.archive_dir / file_path.name
            if archive_path.exists():
                # Add timestamp to avoid overwriting
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                archive_path = self.archive_dir / f"{file_path.stem}_{timestamp}{file_path.suffix}"
            
            os.rename(file_path, archive_path)
            logging.info(f"Archived {file_path.name}")
        except Exception as e:
            logging.error(f"Error archiving {file_path.name}: {e}")
    
    def process_directory(self):
        """Process all CSV files in input directory"""
        csv_files = list(self.input_dir.glob("*.csv"))
        
        if not csv_files:
            logging.warning("No CSV files found in input directory")
            return
        
        logging.info(f"Found {len(csv_files)} CSV files to process")
        
        for file_path in csv_files:
            logging.info(f"Processing {file_path.name}")
            
            try:
                processed_data = self.process_csv_file(file_path)
                
                if processed_data:
                    self.save_processed_data(processed_data, file_path)
                    self.archive_file(file_path)
                else:
                    logging.warning(f"No data processed from {file_path.name}")
                    
            except Exception as e:
                logging.error(f"Failed to process {file_path.name}: {e}")
                continue
    
    def get_stats(self):
        """Return processing statistics"""
        return self.stats

# Usage example
def main():
    # Configuration
    config = {
        'input_dir': 'data/input',
        'output_dir': 'data/output',
        'archive_dir': 'data/archive'
    }
    
    # Initialize processor
    processor = DataProcessor(**config)
    
    # Process files
    try:
        processor.process_directory()
    except KeyboardInterrupt:
        logging.info("Processing interrupted by user")
    except Exception as e:
        logging.error(f"Fatal error: {e}")
        raise
    finally:
        # Always print statistics
        stats = processor.get_stats()
        print("\\n=== Processing Statistics ===")
        print(f"Files processed: {stats['processed']}")
        print(f"Errors: {stats['errors']}")
        print(f"Skipped: {stats['skipped']}")
        print("==============================\\n")
    
    logging.info("Processing complete")

if __name__ == "__main__":
    main()`,
      note: "This real-world example demonstrates robust file processing with proper error handling, logging, data validation, and file management. It's a template for building production-ready data pipelines."
    }
  ]
}