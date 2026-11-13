import argparse
import json
import re
from pathlib import Path

REVIEW_HTML = """
<!-- BEGIN: Under Review Warning Component (Delete this entire block to remove) -->
<div id="review-warning-banner" class="review-warning-container"><style>.review-warning-container{position:fixed;bottom:20px;right:20px;background-color:#fff3cd;color:#856404;border:1px solid #ffeeba;border-left:5px solid #ffc107;padding:16px 20px;box-shadow:0 4px 12px rgba(0,0,0,.15);border-radius:6px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;z-index:999999;display:flex;align-items:flex-start;gap:15px;max-width:350px;transition:opacity .3s ease,transform .3s ease}.review-warning-container.fade-out{opacity:0;transform:translateY(15px);pointer-events:none}.review-warning-content{flex-grow:1;font-size:14px;line-height:1.4;margin:0}.review-warning-content strong{display:block;margin-bottom:4px;font-size:15px;color:#664d03}.review-warning-close{background:0 0;border:none;color:#856404;font-size:22px;cursor:pointer;padding:0;line-height:.8;opacity:.5;transition:opacity .2s}.review-warning-close:hover{opacity:1}</style><div class="review-warning-content"><strong>⚠️ Simulation Under Review</strong>This content is still being reviewed for quality and accuracy and may be updated in the future. Feel free to <a href="https://learncheme.com/www.learncheme.com/contact-us">send us feedback</a>.</div><button id="review-warning-close-btn" class="review-warning-close" aria-label="Close warning">&times;</button><script>!function(){let e=document.getElementById("review-warning-close-btn"),n=document.getElementById("review-warning-banner");e&&n&&e.addEventListener("click",(()=>{n.classList.add("fade-out"),setTimeout((()=>n.remove()),300)}))}();</script></div>
<!-- END: Under Review Warning Component -->
"""

ROOT = Path(__file__).resolve().parent
UNDER_REVIEW_JSON = ROOT / "home_page" / "output" / "under-review.json"
BODY_OPEN = re.compile(r"<body\b[^>]*>", re.IGNORECASE)
BODY_CLOSE = re.compile(r"</body\s*>", re.IGNORECASE)
NORMALIZED_REVIEW_HTML = "".join(REVIEW_HTML.split())


def read_text(path):
	with path.open(encoding="utf-8", newline="") as source:
		return source.read()


def write_text(path, content):
	with path.open("w", encoding="utf-8", newline="") as destination:
		destination.write(content)


def find_review_html(content):
	"""Return source spans matching REVIEW_HTML with whitespace ignored."""
	normalized_chars = []
	source_positions = []
	for position, character in enumerate(content):
		if not character.isspace():
			normalized_chars.append(character)
			source_positions.append(position)

	normalized_content = "".join(normalized_chars)
	spans = []
	start = 0
	while True:
		match_start = normalized_content.find(NORMALIZED_REVIEW_HTML, start)
		if match_start == -1:
			return spans
		match_end = match_start + len(NORMALIZED_REVIEW_HTML)
		spans.append((source_positions[match_start], source_positions[match_end - 1] + 1))
		start = match_end


def process_index(index_path, action):
	content = read_text(index_path)
	matches = find_review_html(content)

	if action == "remove":
		for start, end in reversed(matches):
			content = content[:start] + content[end:]
		if matches:
			write_text(index_path, content)
		return f"removed {len(matches)} review banner(s)" if matches else "no review banner"

	body_open = BODY_OPEN.search(content)
	if body_open is None:
		raise ValueError(f"{index_path}: missing <body> tag")
	body_close = BODY_CLOSE.search(content, body_open.end())
	if body_close is None:
		raise ValueError(f"{index_path}: missing </body> tag")

	body_matches = [
		(start, end)
		for start, end in matches
		if body_open.end() <= start and end <= body_close.start()
	]
	if body_matches:
		return "already present"

	newline = "\r\n" if "\r\n" in content else "\n"
	insertion = newline + REVIEW_HTML.strip() + newline
	content = content[:body_close.start()] + insertion + content[body_close.start():]
	write_text(index_path, content)
	return "inserted review banner"


def main():
	parser = argparse.ArgumentParser(
		description="Ensure or remove the under-review banner in each listed simulation."
	)
	action = parser.add_mutually_exclusive_group(required=True)
	action.add_argument("--ensure", action="store_true", help="insert the banner if it is missing")
	action.add_argument("--remove", action="store_true", help="remove only the review banner")
	args = parser.parse_args()

	items = json.loads(read_text(UNDER_REVIEW_JSON))
	if not isinstance(items, list):
		parser.error(f"{UNDER_REVIEW_JSON} must contain a JSON array")

	mode = "remove" if args.remove else "ensure"
	for item in items:
		if not isinstance(item, dict) or not isinstance(item.get("index"), str):
			raise ValueError("Every under-review entry must have an index path")
		index_path = (ROOT / item["index"]).resolve()
		if not index_path.is_relative_to(ROOT) or not index_path.is_file():
			raise ValueError(f"Invalid or missing simulation index: {item['index']}")
		result = process_index(index_path, mode)
		print(f"{result}: {item.get('title', item['index'])} ({item['index']})")


if __name__ == "__main__":
	main()
