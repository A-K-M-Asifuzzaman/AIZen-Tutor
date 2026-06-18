import type { Lesson } from "../types"

export const PYTHON_OOP: Lesson = {
  id: "python-oop",
  title: "Object-Oriented Programming",
  category: "Python",
  content: [
    {
      heading: "Classes and Objects Fundamentals",
      body: "Python supports object-oriented programming with classes, instances, attributes, and methods.",
      code: `class Dog:
    # Class attribute (shared by all instances)
    species = "Canis familiaris"
    
    def __init__(self, name, age):
        # Instance attributes
        self.name = name
        self.age = age
        self._energy = 100  # Protected attribute
        self.__breed = "Unknown"  # Private attribute (name mangling)
    
    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"
    
    # Instance method with parameter
    def eat(self, food):
        return f"{self.name} eats {food}"
    
    # Property decorator - getter
    @property
    def energy(self):
        return self._energy
    
    # Property setter
    @energy.setter
    def energy(self, value):
        if 0 <= value <= 100:
            self._energy = value
        else:
            raise ValueError("Energy must be between 0 and 100")
    
    # Property deleter
    @energy.deleter
    def energy(self):
        print(f"{self.name}'s energy is being reset")
        self._energy = 50
    
    # Class method
    @classmethod
    def get_species(cls):
        return cls.species
    
    # Static method
    @staticmethod
    def is_valid_age(age):
        return age >= 0 and age <= 30
    
    # Magic method for string representation
    def __str__(self):
        return f"{self.name} is {self.age} years old"
    
    # Magic method for debugging representation
    def __repr__(self):
        return f"Dog(name='{self.name}', age={self.age})"
    
    # Magic method for length
    def __len__(self):
        return self.age
    
    # Magic method for comparison
    def __eq__(self, other):
        if not isinstance(other, Dog):
            return False
        return self.name == other.name and self.age == other.age
    
    def __lt__(self, other):
        return self.age < other.age

# Creating instances
buddy = Dog("Buddy", 3)
max_dog = Dog("Max", 5)

print(buddy)                # Buddy is 3 years old
print(repr(buddy))          # Dog(name='Buddy', age=3)
print(buddy.bark())         # Buddy says Woof!
print(buddy.species)        # Canis familiaris
print(Dog.get_species())    # Canis familiaris
print(buddy.energy)         # 100
buddy.energy = 80           # Using setter
print(buddy.energy)         # 80
print(len(buddy))           # 3 (uses __len__)
print(buddy == max_dog)     # False
print(buddy < max_dog)      # True (uses __lt__)`
    },
    {
      heading: "Inheritance and Method Overriding",
      body: "Inheritance allows creating hierarchies of classes that share behavior and can override methods.",
      code: `class Animal:
    def __init__(self, name, age=0):
        self.name = name
        self.age = age
        self._legs = 0
    
    def speak(self):
        raise NotImplementedError("Subclass must implement speak()")
    
    def move(self):
        return f"{self.name} moves"
    
    def __str__(self):
        return f"{self.__class__.__name__}: {self.name}"
    
    def __repr__(self):
        return f"{self.__class__.__name__}(name='{self.name}', age={self.age})"

# Single inheritance
class Dog(Animal):
    def __init__(self, name, age, breed="Mixed"):
        # Call parent constructor
        super().__init__(name, age)
        self.breed = breed
        self._legs = 4
    
    def speak(self):
        return f"{self.name} says Woof!"
    
    def fetch(self):
        return f"{self.name} fetches the ball"
    
    def move(self):
        return f"{self.name} runs on {self._legs} legs"

class Cat(Animal):
    def __init__(self, name, age, indoor=True):
        super().__init__(name, age)
        self.indoor = indoor
        self._legs = 4
    
    def speak(self):
        return f"{self.name} says Meow!"
    
    def purr(self):
        return f"{self.name} purrs"

# Multiple inheritance
class Flyable:
    def __init__(self, max_height=100):
        self.max_height = max_height
    
    def fly(self):
        return f"Flying at {self.max_height} meters"
    
    def land(self):
        return "Landing..."

class Swimmable:
    def __init__(self, max_depth=50):
        self.max_depth = max_depth
    
    def swim(self):
        return f"Swimming at {self.max_depth} meters depth"
    
    def dive(self):
        return "Diving..."

class Duck(Animal, Flyable, Swimmable):
    def __init__(self, name, age, max_height=100, max_depth=50):
        Animal.__init__(self, name, age)
        Flyable.__init__(self, max_height)
        Swimmable.__init__(self, max_depth)
        self._legs = 2
    
    def speak(self):
        return f"{self.name} says Quack!"
    
    # Override methods to handle multiple inheritance
    def move(self):
        return "Duck can walk, swim, and fly"

# Usage
dog = Dog("Rex", 5, "German Shepherd")
cat = Cat("Whiskers", 3)
duck = Duck("Donald", 2)

print(dog.speak())          # Rex says Woof!
print(cat.speak())          # Whiskers says Meow!
print(duck.speak())         # Donald says Quack!
print(dog.move())           # Rex runs on 4 legs
print(duck.fly())           # Flying at 100 meters
print(duck.swim())          # Swimming at 50 meters depth
print(duck.land())          # Landing...
print(dog.fetch())          # Rex fetches the ball
print(cat.purr())           # Whiskers purrs

# Method Resolution Order (MRO)
print(Duck.__mro__)  # Shows the order Python looks for methods`
    },
    {
      heading: "Magic Methods (Dunder Methods)",
      body: "Magic methods define behavior for operators and built-in functions, enabling custom objects to work seamlessly with Python.",
      code: `class Vector:
    def __init__(self, x, y, z=0):
        self.x = x
        self.y = y
        self.z = z
    
    # Arithmetic operators
    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y, self.z + other.z)
    
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y, self.z - other.z)
    
    def __mul__(self, scalar):
        if isinstance(scalar, (int, float)):
            return Vector(self.x * scalar, self.y * scalar, self.z * scalar)
        return NotImplemented
    
    def __rmul__(self, scalar):
        return self.__mul__(scalar)
    
    def __truediv__(self, scalar):
        return Vector(self.x / scalar, self.y / scalar, self.z / scalar)
    
    # Comparison operators
    def __eq__(self, other):
        if not isinstance(other, Vector):
            return False
        return self.x == other.x and self.y == other.y and self.z == other.z
    
    def __lt__(self, other):
        return self.magnitude() < other.magnitude()
    
    def __le__(self, other):
        return self.magnitude() <= other.magnitude()
    
    # Unary operators
    def __neg__(self):
        return Vector(-self.x, -self.y, -self.z)
    
    def __pos__(self):
        return Vector(abs(self.x), abs(self.y), abs(self.z))
    
    # Container emulation
    def __len__(self):
        return 3
    
    def __getitem__(self, index):
        if index == 0:
            return self.x
        elif index == 1:
            return self.y
        elif index == 2:
            return self.z
        raise IndexError("Index out of range")
    
    def __setitem__(self, index, value):
        if index == 0:
            self.x = value
        elif index == 1:
            self.y = value
        elif index == 2:
            self.z = value
        else:
            raise IndexError("Index out of range")
    
    # String representations
    def __str__(self):
        return f"Vector({self.x}, {self.y}, {self.z})"
    
    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y}, z={self.z})"
    
    # Callable object
    def __call__(self, factor):
        return Vector(self.x * factor, self.y * factor, self.z * factor)
    
    # Context manager methods
    def __enter__(self):
        print("Entering vector context")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting vector context")
    
    # Additional methods
    def magnitude(self):
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5
    
    def dot(self, other):
        return self.x * other.x + self.y * other.y + self.z * other.z
    
    def cross(self, other):
        return Vector(
            self.y * other.z - self.z * other.y,
            self.z * other.x - self.x * other.z,
            self.x * other.y - self.y * other.x
        )

v1 = Vector(2, 3, 4)
v2 = Vector(4, 5, 6)

print(v1 + v2)              # Vector(6, 8, 10)
print(v2 - v1)              # Vector(2, 2, 2)
print(v1 * 3)               # Vector(6, 9, 12)
print(3 * v1)               # Vector(6, 9, 12) (uses __rmul__)
print(v1 / 2)               # Vector(1.0, 1.5, 2.0)
print(v1 == Vector(2, 3, 4)) # True
print(v1 < v2)              # True (smaller magnitude)
print(len(v1))              # 3
print(v1[0])                # 2
print(v1(2))                # Vector(4, 6, 8) (callable)
print(v1.dot(v2))           # 2*4 + 3*5 + 4*6 = 47
print(v1.cross(v2))         # Cross product

# Context manager usage
with Vector(1, 2, 3) as v:
    print(f"Inside context: {v}")`
    },
    {
      heading: "Abstract Base Classes and Protocols",
      body: "Abstract Base Classes (ABCs) define interfaces that subclasses must implement. Protocols provide duck typing support.",
      code: `from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable

# Abstract Base Class
class Shape(ABC):
    @abstractmethod
    def area(self):
        """Calculate area of the shape"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Calculate perimeter of the shape"""
        pass
    
    @abstractmethod
    def __str__(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
    
    def __str__(self):
        return f"Rectangle({self.width}x{self.height})"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius**2
    
    def perimeter(self):
        return 2 * 3.14159 * self.radius
    
    def __str__(self):
        return f"Circle(r={self.radius})"

# Protocol (structural subtyping)
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> str:
        ...

class Triangle:
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def draw(self):
        return f"Drawing triangle with base {self.base}"

class Square:
    def __init__(self, side):
        self.side = side
    
    def draw(self):
        return f"Drawing square with side {self.side}"
    
    def area(self):
        return self.side ** 2

class CircleDrawable(Circle, Drawable):
    def draw(self):
        return f"Drawing circle with radius {self.radius}"

def render_shape(shape: Shape):
    print(f"Area: {shape.area()}, Perimeter: {shape.perimeter()}")

def render_drawable(drawable: Drawable):
    print(drawable.draw())

# Usage
rect = Rectangle(5, 3)
circle = Circle(4)
triangle = Triangle(6, 4)

render_shape(rect)  # Area: 15, Perimeter: 16
render_shape(circle)  # Area: 50.26544, Perimeter: 25.13272
render_drawable(triangle)  # Drawing triangle with base 6
render_drawable(Square(5))  # Drawing square with side 5

# Check protocol compliance
print(isinstance(triangle, Drawable))  # True
print(isinstance("string", Drawable))  # False`
    },
    {
      heading: "Composition and Aggregation",
      body: "Composition allows building complex objects from simpler ones, promoting code reuse and flexibility.",
      code: `class Engine:
    def __init__(self, horsepower, cylinders=4):
        self.horsepower = horsepower
        self.cylinders = cylinders
        self.is_running = False
    
    def start(self):
        self.is_running = True
        return "Engine started"
    
    def stop(self):
        self.is_running = False
        return "Engine stopped"
    
    def __str__(self):
        return f"Engine({self.horsepower}HP, {self.cylinders} cyl)"

class Wheels:
    def __init__(self, count=4, type="all-season"):
        self.count = count
        self.type = type
    
    def rotate(self, speed):
        return f"Wheels rotating at {speed} RPM"
    
    def __str__(self):
        return f"Wheels({self.count}, {self.type})"

class Transmission:
    def __init__(self, type="automatic", gears=6):
        self.type = type
        self.gears = gears
        self.current_gear = 0
    
    def shift_up(self):
        if self.current_gear < self.gears:
            self.current_gear += 1
        return f"Gear {self.current_gear}"
    
    def shift_down(self):
        if self.current_gear > 0:
            self.current_gear -= 1
        return f"Gear {self.current_gear}"
    
    def __str__(self):
        return f"Transmission({self.type}, {self.gears} gears)"

# Composition: Car is composed of parts
class Car:
    def __init__(self, brand, model, color="White"):
        self.brand = brand
        self.model = model
        self.color = color
        self.engine = Engine(200)  # Composition
        self.wheels = Wheels(4)    # Composition
        self.transmission = Transmission("automatic", 6)  # Composition
        self.speed = 0
    
    def start(self):
        return f"{self.brand} {self.model}: {self.engine.start()}"
    
    def accelerate(self, amount=10):
        self.speed += amount
        gear = self.transmission.shift_up()
        return f"Accelerating to {self.speed} km/h, {gear}"
    
    def brake(self, amount=10):
        self.speed = max(0, self.speed - amount)
        gear = self.transmission.shift_down()
        return f"Braking to {self.speed} km/h, {gear}"
    
    def stop(self):
        self.speed = 0
        return f"{self.brand} {self.model}: {self.engine.stop()}"
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.color})"

# Aggregation: Fleet aggregates Car objects
class Fleet:
    def __init__(self, name):
        self.name = name
        self.cars = []  # Aggregation (cars exist independently)
    
    def add_car(self, car):
        self.cars.append(car)
        return f"Added {car} to fleet"
    
    def remove_car(self, car):
        self.cars.remove(car)
        return f"Removed {car} from fleet"
    
    def get_total_horsepower(self):
        return sum(car.engine.horsepower for car in self.cars)
    
    def __iter__(self):
        return iter(self.cars)

# Usage
car1 = Car("Toyota", "Camry", "Blue")
car2 = Car("Honda", "Civic", "Red")

print(car1.start())         # Toyota Camry: Engine started
print(car1.accelerate())    # Accelerating to 10 km/h, Gear 1
print(car1.accelerate(20))  # Accelerating to 30 km/h, Gear 2
print(car1.brake())         # Braking to 20 km/h, Gear 1
print(car1.stop())          # Toyota Camry: Engine stopped

fleet = Fleet("Company Cars")
fleet.add_car(car1)
fleet.add_car(car2)
print(f"Total HP: {fleet.get_total_horsepower()}")

for car in fleet:
    print(car)`
    },
    {
      heading: "Descriptors and Properties",
      body: "Descriptors control attribute access. Properties are a special case providing getter/setter/deleter functionality.",
      code: `# Descriptor protocol
class ValidatedAttribute:
    def __init__(self, min_value=0, max_value=100):
        self.min_value = min_value
        self.max_value = max_value
        self.data = {}
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return self.data.get(id(instance), self.min_value)
    
    def __set__(self, instance, value):
        if not isinstance(value, (int, float)):
            raise TypeError("Value must be numeric")
        if not (self.min_value <= value <= self.max_value):
            raise ValueError(f"Value must be between {self.min_value} and {self.max_value}")
        self.data[id(instance)] = value
    
    def __delete__(self, instance):
        if id(instance) in self.data:
            del self.data[id(instance)]

class Person:
    # Using descriptor
    age = ValidatedAttribute(0, 150)
    salary = ValidatedAttribute(0, 1000000)
    
    def __init__(self, name, age, salary):
        self.name = name
        self.age = age
        self.salary = salary

# Property decorator (cleaner than descriptors for simple cases)
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
        self._fahrenheit = self._celsius * 9/5 + 32
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9
    
    @property
    def kelvin(self):
        return self._celsius + 273.15

# Property with computed values and caching
class Circle:
    def __init__(self, radius):
        self._radius = radius
        self._area = None
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
        self._area = None  # Invalidate cache
    
    @property
    def diameter(self):
        return self.radius * 2
    
    @property
    def area(self):
        if self._area is None:
            print("Computing area...")  # Demonstration of lazy computation
            self._area = 3.14159 * self.radius ** 2
        return self._area

# Usage
person = Person("Alice", 25, 75000)
print(f"{person.name}: Age {person.age}  ")
person.age = 30
# person.age = 200  # Would raise ValueError

temp = Temperature(25)
print(f"{temp.celsius}°C = {temp.fahrenheit}°F = {temp.kelvin}K")
temp.celsius = 100
print(f"Boiling point: {temp.fahrenheit}°F")

circle = Circle(5)
print(f"Area: {circle.area}")  # Computing area...
print(f"Area: {circle.area}")  # Cached: no computation
circle.radius = 10  # Invalidates cache
print(f"New area: {circle.area}")  # Computing area...`
    },
    {
      heading: "Metaclasses",
      body: "Metaclasses define the behavior of classes themselves. They can intercept class creation and modify it.",
      code: `# Simple metaclass
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self, connection_string="default"):
        self.connection_string = connection_string
        self.connected = False
    
    def connect(self):
        self.connected = True
        return "Connected to " + self.connection_string

# Metaclass for automatic method registration
class RegistryMeta(type):
    def __new__(cls, name, bases, attrs):
        # Add a registry attribute to the class
        attrs['_registry'] = {}
        
        # Register all methods with special attributes
        for attr_name, attr_value in attrs.items():
            if callable(attr_value) and hasattr(attr_value, '_command'):
                attrs['_registry'][attr_name] = attr_value
        
        return super().__new__(cls, name, bases, attrs)

class Command:
    def command(self, name=None):
        def decorator(func):
            func._command = name or func.__name__
            return func
        return decorator

class Calculator(Command, metaclass=RegistryMeta):
    def __init__(self):
        self.history = []
    
    @Command.command('add')
    def add(self, a, b):
        result = a + b
        self.history.append(f"add({a}, {b}) = {result}")
        return result
    
    @Command.command('multiply')
    def multiply(self, a, b):
        result = a * b
        self.history.append(f"multiply({a}, {b}) = {result}")
        return result

    @Command.command()
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Division by zero")
        result = a / b
        self.history.append(f"divide({a}, {b}) = {result}")
        return result

# Metaclass for attribute validation at class creation
class ValidatedMeta(type):
    def __new__(cls, name, bases, attrs):
        # Ensure required attributes exist
        required = attrs.get('__required__', [])
        for attr in required:
            if attr not in attrs:
                raise TypeError(f"Class {name} missing required attribute: {attr}")
        
        # Add validation wrapper to __init__
        original_init = attrs.get('__init__')
        if original_init:
            def validated_init(self, *args, **kwargs):
                # Validate before creating instance
                if hasattr(self, '__validators__'):
                    for attr, validator in self.__validators__.items():
                        if attr in kwargs:
                            validator(kwargs[attr])
                original_init(self, *args, **kwargs)
            attrs['__init__'] = validated_init
        
        return super().__new__(cls, name, bases, attrs)

class User(metaclass=ValidatedMeta):
    __required__ = ['username', 'email']
    __validators__ = {
        'username': lambda x: isinstance(x, str) and len(x) >= 3,
        'email': lambda x: '@' in x and '.' in x
    }
    
    def __init__(self, username, email, age=None):
        self.username = username
        self.email = email
        self.age = age

# Usage
db1 = Database("postgres://localhost")
db2 = Database("mysql://localhost")
print(db1 is db2)  # True - Singleton pattern

calc = Calculator()
print(calc.add(5, 3))  # 8
print(calc.multiply(4, 3))  # 12
print(calc.divide(10, 2))  # 5.0
print(calc._registry)  # {'add': <function>, 'multiply': <function>, 'divide': <function>}

user = User("alice123", "alice@email.com")
# user = User("a", "invalid")  # Would raise TypeError due to validation`
    },
    {
      heading: "Context Managers and With Statements",
      body: "Context managers handle setup and cleanup using the 'with' statement.",
      code: `import time
from contextlib import contextmanager

# Class-based context manager
class Timer:
    def __init__(self, name="Operation"):
        self.name = name
    
    def __enter__(self):
        self.start = time.time()
        print(f"Starting {self.name}...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        if exc_type:
            print(f"{self.name} failed after {elapsed:.2f}s")
        else:
            print(f"{self.name} completed in {elapsed:.2f}s")
        return False  # Don't suppress exceptions

# Function-based context manager with @contextmanager
@contextmanager
def timed_block(name):
    start = time.time()
    print(f"Starting {name}...")
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{name} took {elapsed:.2f} seconds")

@contextmanager
def managed_resource(resource_name):
    print(f"Acquiring {resource_name}")
    resource = f"Resource-{resource_name}"
    try:
        yield resource
    finally:
        print(f"Releasing {resource_name}")

# Database-like context manager
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connected = False
    
    def __enter__(self):
        print(f"Connecting to {self.connection_string}")
        self.connected = True
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Disconnecting from database")
        self.connected = False
        if exc_type:
            print(f"Transaction rolled back: {exc_val}")
        else:
            print("Transaction committed")
        return False  # Don't suppress exceptions
    
    def execute(self, query):
        if not self.connected:
            raise RuntimeError("Not connected to database")
        return f"Executing: {query}"

# Nested context managers
class Transaction:
    def __init__(self, db):
        self.db = db
        self.started = False
    
    def __enter__(self):
        self.started = True
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.started = False
        return False

# Usage - Class-based
with Timer("Heavy Computation"):
    time.sleep(1)
    print("Done!")

# Usage - Function-based
with timed_block("Another Operation"):
    time.sleep(0.5)
    print("Finished!")

# Usage - Resource management
with managed_resource("File") as resource:
    print(f"Using {resource}")
    # Perform operations

# Usage - Database connection
with DatabaseConnection("postgres://localhost") as db:
    result = db.execute("SELECT * FROM users")
    print(result)
    # Exception here will trigger rollback

# Multiple context managers
with managed_resource("Resource1") as r1, managed_resource("Resource2") as r2:
    print(f"Working with {r1} and {r2}")

# Custom context manager for file operations
class FileManager:
    def __init__(self, filename, mode='r'):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        print("File closed automatically")
        # Log errors if any
        if exc_type:
            print(f"Error occurred: {exc_val}")

# With FileManager("example.txt", "w") as f:
#     f.write("Hello, World!")
#     raise RuntimeError("Something went wrong")  # This will still close the file`
    },
    {
      heading: "Advanced OOP Patterns",
      body: "Common design patterns implemented in Python.",
      code: `# 1. Factory Pattern
class AnimalFactory:
    @staticmethod
    def create_animal(animal_type, *args, **kwargs):
        if animal_type.lower() == "dog":
            return Dog(*args, **kwargs)
        elif animal_type.lower() == "cat":
            return Cat(*args, **kwargs)
        else:
            raise ValueError(f"Unknown animal type: {animal_type}")

# 2. Strategy Pattern
class SortingStrategy:
    def sort(self, data):
        raise NotImplementedError

class BubbleSort(SortingStrategy):
    def sort(self, data):
        result = data.copy()
        n = len(result)
        for i in range(n):
            for j in range(0, n-i-1):
                if result[j] > result[j+1]:
                    result[j], result[j+1] = result[j+1], result[j]
        return result

class QuickSort(SortingStrategy):
    def sort(self, data):
        if len(data) <= 1:
            return data.copy()
        pivot = data[0]
        left = [x for x in data[1:] if x <= pivot]
        right = [x for x in data[1:] if x > pivot]
        return self.sort(left) + [pivot] + self.sort(right)

class Sorter:
    def __init__(self, strategy=None):
        self.strategy = strategy or BubbleSort()
    
    def set_strategy(self, strategy):
        self.strategy = strategy
    
    def sort(self, data):
        return self.strategy.sort(data)

# 3. Observer Pattern
class Subject:
    def __init__(self):
        self._observers = []
        self._state = None
    
    def attach(self, observer):
        self._observers.append(observer)
    
    def detach(self, observer):
        self._observers.remove(observer)
    
    def notify(self):
        for observer in self._observers:
            observer.update(self)
    
    @property
    def state(self):
        return self._state
    
    @state.setter
    def state(self, value):
        self._state = value
        self.notify()

class Observer:
    def update(self, subject):
        pass

class LoggerObserver(Observer):
    def update(self, subject):
        print(f"State changed to: {subject.state}")

class EmailObserver(Observer):
    def update(self, subject):
        print(f"Sending email about state: {subject.state}")

# 4. Decorator Pattern (built-in)
from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg < 0:
                raise ValueError(f"Invalid value: {arg}")
        return func(*args, **kwargs)
    return wrapper

@validate_positive
def calculate_square_root(x):
    return x ** 0.5

# 5. Builder Pattern
class QueryBuilder:
    def __init__(self):
        self.query = {"select": [], "from": None, "where": []}
    
    def select(self, *fields):
        self.query["select"].extend(fields)
        return self
    
    def from_table(self, table):
        self.query["from"] = table
        return self
    
    def where(self, condition):
        self.query["where"].append(condition)
        return self
    
    def build(self):
        parts = ["SELECT " + ", ".join(self.query["select"])]
        parts.append("FROM " + self.query["from"])
        if self.query["where"]:
            parts.append("WHERE " + " AND ".join(self.query["where"]))
        return " ".join(parts)

# Usage
# Factory pattern
factory = AnimalFactory()
dog = factory.create_animal("dog", "Rex", 5, "German Shepherd")

# Strategy pattern
sorter = Sorter()
data = [64, 34, 25, 12, 22, 11, 90]
print(sorter.sort(data))  # Default bubble sort
sorter.set_strategy(QuickSort())
print(sorter.sort(data))  # Quick sort

# Observer pattern
subject = Subject()
logger = LoggerObserver()
emailer = EmailObserver()
subject.attach(logger)
subject.attach(emailer)
subject.state = "New State"  # Both observers will be notified

# Decorator pattern
print(calculate_square_root(16))  # 4.0
# print(calculate_square_root(-16))  # Raises ValueError

# Builder pattern
query = (QueryBuilder()
    .select("name", "age")
    .from_table("users")
    .where("age > 18")
    .where("active = true")
    .build())
print(query)  # SELECT name, age FROM users WHERE age > 18 AND active = true`
    },
    {
      heading: "Best Practices and Common Pitfalls",
      body: "Important guidelines for writing clean, maintainable object-oriented Python code.",
      code: `# 1. Composition over inheritance
# Bad: Deep inheritance hierarchy
class Vehicle:
    pass

class Car(Vehicle):
    pass

class SUV(Car):
    pass

# Good: Composition
class Engine:
    pass

class Wheels:
    pass

class Vehicle:
    def __init__(self):
        self.engine = Engine()
        self.wheels = Wheels()

# 2. Don't overuse private attributes
class User:
    def __init__(self, name, email):
        self.name = name  # Public
        self._email = email  # Protected (convention)
        self.__secret = None  # Name mangling (use sparingly)

# 3. Use __slots__ for memory optimization (when many instances)
class Point:
    __slots__ = ['x', 'y']
    def __init__(self, x, y):
        self.x = x
        self.y = y

# 4. Prefer @classmethod and @staticmethod over functions in classes
class Utility:
    @staticmethod
    def is_even(number):
        return number % 2 == 0
    
    @classmethod    def create_from_string(cls, string):
        return cls(*string.split(','))

# 5. Use dunder methods for built-in integration
class CustomList:
    def __init__(self, items):
        self.items = items
    
    def __len__(self):
        return len(self.items)
    
    def __getitem__(self, index):
        return self.items[index]
    
    def __iter__(self):
        return iter(self.items)

# 6. Use dataclasses for simple data containers
from dataclasses import dataclass, field
from typing import List

@dataclass
class Product:
    name: str
    price: float
    tags: List[str] = field(default_factory=list)
    in_stock: bool = True
    
    def total_price(self, quantity=1):
        return self.price * quantity

# 7. Use enums for constants
from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    PROCESSING = auto()
    COMPLETED = auto()
    FAILED = auto()

# 8. Use property for computed attributes
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

# 9. Use type hints
class Calculator:
    def add(self, a: int, b: int) -> int:
        return a + b
    
    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Division by zero")
        return a / b

# 10. Common pitfalls to avoid
# Pitfall 1: Mutable default arguments
class BadExample:
    def __init__(self, items=[]):  # Bad
        self.items = items

class GoodExample:
    def __init__(self, items=None):
        self.items = items or []

# Pitfall 2: Forgetting to call super().__init__()
class Child(Parent):
    def __init__(self):
        super().__init__()  # Always call super

# Pitfall 3: Overusing isinstance()
def process(value):
    if isinstance(value, int):
        # Bad: Tight coupling to types
        pass

# Better: Use duck typing or protocols

# Pitfall 4: Using class variables for mutable data
class MutableClass:
    shared_list = []  # Shared across all instances

class MutableClass:
    def __init__(self):
        self.list = []  # Each instance gets its own

# Pitfall 5: Not documenting classes and methods
class WellDocumented:
    """
    This class provides a clear example of documentation.
    
    Attributes:
        name (str): The name of the entity
        value (int): The current value
    """
    
    def process(self, input_data):
        """
        Process the input data and return the result.
        
        Args:
            input_data (list): List of values to process
            
        Returns:
            dict: Processed results organized by category
            
        Raises:
            ValueError: If input_data is empty
        """
        pass

# 11. Use composition for code reuse
class Logger:
    def log(self, message):
        print(f"LOG: {message}")

class ErrorHandler:
    def __init__(self, logger):
        self.logger = logger
    
    def handle_error(self, error):
        self.logger.log(str(error))
        # Handle error...

# 12. Use mixins for code reuse across unrelated classes
class LoggableMixin:
    def log(self, message):
        print(f"{self.__class__.__name__}: {message}")

class DataProcessor(LoggableMixin):
    def process(self):
        self.log("Processing started...")
        # Process data
        self.log("Processing complete")

# 13. Use context managers properly
# Always use 'with' for file operations, database connections, etc.
with open('file.txt', 'r') as file:
    content = file.read()
    # File automatically closed after block`

    }
  ]
}