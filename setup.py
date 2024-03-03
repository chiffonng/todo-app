from setuptools import setup, find_packages

setup(
    name="todo-webapp",
    version="0.1.0",
    packages=["backend", "backend.app"],
    package_dir={"": "."},
)
