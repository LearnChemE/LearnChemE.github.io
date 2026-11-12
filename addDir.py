import json
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
JSON_FILES = (
	ROOT / "home_page/output/demos.json",
	ROOT / "home_page/output/under-review.json",
)
CONTENT_FOLDERS = {"demos", "lab-experiments"}


def add_directory_and_index(item):
	"""Set directory and index from an item's site-relative href."""
	href = item["href"]
	relative_path = urlsplit(href).path.lstrip("/")
	parts = relative_path.split("/")

	for position, part in enumerate(parts[:-1]):
		if part in CONTENT_FOLDERS and position + 1 < len(parts):
			item["directory"] = "/".join(parts[: position + 2])
			item["index"] = relative_path
			return

	raise ValueError(f"Href is not under demos/ or lab-experiments/: {href}")


def main():
	for json_path in JSON_FILES:
		with json_path.open(encoding="utf-8") as source:
			items = json.load(source)

		for item in items:
			add_directory_and_index(item)

		with json_path.open("w", encoding="utf-8") as destination:
			json.dump(items, destination, ensure_ascii=False, indent=2, separators=(',', ':'))
			destination.write("\n")


if __name__ == "__main__":
	main()
