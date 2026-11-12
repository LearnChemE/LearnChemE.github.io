import argparse
import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any
from playwright.sync_api import sync_playwright

COLLECTION_TYPES = {
    "under-review": "under-review",
    "demos": "in-browser",
    "lab-experiments": "lab-experiment",
}
DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parent / "home_page" / "output"


def collection_path(data_dir: Path, collection: str) -> Path:
    return data_dir / f"{collection}.json"


def read_entries(path: Path) -> list[dict[str, Any]]:
    entries = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(entries, list) or not all(isinstance(entry, dict) for entry in entries):
        raise ValueError(f"{path} must contain a JSON array of objects")
    return entries


def write_entries(path: Path, entries: list[dict[str, Any]]) -> None:
    original = path.read_text(encoding="utf-8")
    file_mode = path.stat().st_mode
    indent_match = re.search(r"\n([ \t]+)\S", original)
    indent = len(indent_match.group(1)) if indent_match else 2
    separators = (",", ": ") if re.search(r'"\s*:\s', original) else (",", ":")
    content = json.dumps(entries, indent=indent, separators=separators) + "\n"

    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=path.parent,
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            temporary_file.write(content)
        os.chmod(temporary_path, file_mode)
        os.replace(temporary_path, path)
    finally:
        if temporary_path is not None and temporary_path.exists():
            temporary_path.unlink()


def find_entry(entries: list[dict[str, Any]], identifier: str) -> int:
    matches = [
        index
        for index, entry in enumerate(entries)
        if identifier in (entry.get("title"), entry.get("href"))
    ]
    if not matches:
        raise ValueError(f"No simulation found with title or href {identifier!r}")
    if len(matches) > 1:
        raise ValueError(f"More than one simulation matches {identifier!r}; use its exact href")
    return matches[0]


def reject_duplicate(entries: list[dict[str, Any]], title: str, href: str) -> None:
    for entry in entries:
        if title == entry.get("title") or href == entry.get("href"):
            raise ValueError(f"A simulation with title {title!r} or href {href!r} already exists")


def add_simulation(args: argparse.Namespace) -> None:
    collection = collection_path(args.data_dir, args.collection)

    path = args.href
    # Make sure the path is a directory and not a file
    if path.is_file():
        href = path
        path = path.parent

    # Check if the path exists and is a file
    if not path.exists():
        # Create a new directory if it doesn't exist
        path.parent.mkdir(parents=True, exist_ok=True)

    # Resolve simulation href path
    # Check if there is a dist directory in the simulation path. If not, default to a local index file.
    if (path / "dist").exists():
        print(f"Found dist directory in {path}. Using index.html from dist.")
        href = str(path / "dist" / "index.html")
    else:
        print(f"No dist directory found in {path}. Defaulting to local index.html file.")
        href = str(path / "index.html")

    if args.title:
        title = args.title
    else:
        # If title is not provided, use the last directory name as the title
        title = path.name.split('/')[-1].replace('_', ' ').title()


    srcPath = args.src if args.src else str(path)

    entries = read_entries(collection)
    reject_duplicate(entries, args.title, args.href)
    entry = {
        "title": args.title,
        "href": href,
        "image": args.image,
        "tooltip": args.tooltip if args.tooltip is not None else args.title,
        "description": args.description,
        "src": srcPath,
        "simulation_type": COLLECTION_TYPES[args.collection],
    }
    entries.append(entry)
    # write_entries(collection, entries)
    print(f"Added to {collection}:\n{entry}")


def move_simulation(args: argparse.Namespace) -> None:
    source_path = collection_path(args.data_dir, args.source)
    destination_path = collection_path(args.data_dir, args.destination)
    if source_path == destination_path:
        raise ValueError("Source and destination collections must be different")

    source_entries = read_entries(source_path)
    destination_entries = read_entries(destination_path)
    source_index = find_entry(source_entries, args.identifier)
    entry = source_entries[source_index]
    reject_duplicate(destination_entries, entry.get("title", ""), entry.get("href", ""))

    source_entries.pop(source_index)
    entry["simulation_type"] = COLLECTION_TYPES[args.destination]
    destination_entries.append(entry)
    write_entries(destination_path, destination_entries)
    write_entries(source_path, source_entries)
    print(f"Moved {entry.get('title', args.identifier)!r} from {source_path} to {destination_path}")


def remove_simulation(args: argparse.Namespace) -> None:
    path = collection_path(args.data_dir, args.collection)
    entries = read_entries(path)
    index = find_entry(entries, args.identifier)
    entry = entries.pop(index)
    write_entries(path, entries)
    print(f"Removed {entry.get('title', args.identifier)!r} from {path}")


def list_simulations(args: argparse.Namespace) -> None:
    path = collection_path(args.data_dir, args.collection)
    for entry in read_entries(path):
        print(f"{entry.get('title', '(untitled)')}\t{entry.get('href', '')}")

def remove_titles(args: argparse.Namespace) -> None:
    path = collection_path(args.data_dir, args.collection)
    entries = read_entries(path)
    for entry in entries:
        index = entry.get("index")
        if index is not None:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(index)

                # Check the first element under the body tag to see if it's a title element
                body_children = page.query_selector_all("body > *")
                if body_children:
                    first_element = body_children[0]
                    # print the tag name of the first element
                    tag_name = first_element.evaluate("element => element.tagName")
                
                # Save the modified HTML back to the file
                # modified_html = page.content()
                # with open(index + '_modified.html', "w", encoding="utf-8") as f:
                #     f.write(modified_html)
                browser.close()
                
    print(f"Removed titles from all entries in {path}")

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Manage simulations in the home page JSON collections."
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"directory containing the collection JSON files (default: {DEFAULT_OUTPUT_DIR})",
    )
    subparsers = parser.add_subparsers(dest="action", required=True)

    # "add" subcommand
    add_parser = subparsers.add_parser("add", help="add a simulation to a collection")
    add_parser.add_argument("collection", choices=COLLECTION_TYPES)
    add_parser.add_argument("--title", required=True)
    add_parser.add_argument("--href", required=False)
    add_parser.add_argument("--src", required=True)
    add_parser.add_argument("--image", default="")
    add_parser.add_argument("--tooltip")
    add_parser.add_argument("--description", default="")
    add_parser.set_defaults(handler=add_simulation)

    # "move" subcommand
    move_parser = subparsers.add_parser("move", help="move a simulation between collections")
    move_parser.add_argument("source", choices=COLLECTION_TYPES)
    move_parser.add_argument("destination", choices=COLLECTION_TYPES)
    move_parser.add_argument("identifier", help="exact simulation title or href")
    move_parser.set_defaults(handler=move_simulation)

    # "remove" subcommand
    remove_parser = subparsers.add_parser("remove", help="remove a simulation from a collection")
    remove_parser.add_argument("collection", choices=COLLECTION_TYPES)
    remove_parser.add_argument("identifier", help="exact simulation title or href")
    remove_parser.set_defaults(handler=remove_simulation)

    # "list" subcommand
    list_parser = subparsers.add_parser("list", help="list simulations in a collection")
    list_parser.add_argument("collection", choices=COLLECTION_TYPES)
    list_parser.set_defaults(handler=list_simulations)

    # "titles" subcommand
    titles_parser = subparsers.add_parser("titles", help="remove titles from the pages in a collection")
    titles_parser.add_argument("collection", choices=COLLECTION_TYPES)
    titles_parser.set_defaults(handler=remove_titles)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.handler(args)
    except ValueError as error:
        parser.error(str(error))


if __name__ == "__main__":
    main()
