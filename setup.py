import os

from setuptools import find_packages
from setuptools import setup

from typing import Dict
from typing import List


def get_version() -> str:

    version_filepath = os.path.join(os.path.dirname(__file__), "optdash", "version.py")
    with open(version_filepath) as f:
        for line in f:
            if line.startswith("__version__"):
                return line.strip().split()[-1][1:-1]
    assert False


def get_long_description() -> str:

    readme_filepath = os.path.join(os.path.dirname(__file__), "README.md")
    with open(readme_filepath) as f:
        return f.read()


def get_install_requires() -> List[str]:

    return [
        "optuna",
        "sklearn",  # For parameter importance.
        "sqlalchemy",
    ]


def get_tests_require() -> List[str]:

    return get_extras_require()["test"]


def get_extras_require() -> Dict[str, List[str]]:

    requirements: Dict[str, List[str]] = {
        "checking": ["black", "mypy", "flake8"],
        "doc": ["sphinx", "sphinx_rtd_theme"],
        "mysql": [],
        "postgres": [],
        "test": ["pytest", "pytest-dependency"],
    }

    return requirements


setup(
    name="optdash",
    version=get_version(),
    description="A third-party dashboard for optuna.",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    author="Yusuke Tsuzuku",
    author_email="ytsmiling@gmail.com",
    url="",
    packages=find_packages(),
    install_requires=get_install_requires(),
    tests_require=get_tests_require(),
    extras_require=get_extras_require(),
    package_data={"optdash": ["*/public/*"]},
    entry_points={
        "console_scripts": [
            "optdash = optdash.server:main",
        ],
    },
)
