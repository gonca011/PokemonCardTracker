from pathlib import Path
import json


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
CARDS_DIR = Path(__file__).resolve().parent / "cards"


def get_image_filenames(expansion_dir):
    return sorted(
        (
            file_path.name
            for file_path in expansion_dir.iterdir()
            if file_path.is_file() and file_path.suffix.lower() in IMAGE_EXTENSIONS
        ),
        key=str.casefold,
    )


def write_cards_json(expansion_dir, image_filenames):
    cards_json_path = expansion_dir / "cards.json"

    with cards_json_path.open("w", encoding="utf-8") as json_file:
        json.dump(image_filenames, json_file, ensure_ascii=False, indent=4)
        json_file.write("\n")


def generate_cards_json_files():
    if not CARDS_DIR.is_dir():
        raise FileNotFoundError(f"Pasta nao encontrada: {CARDS_DIR}")

    generated_count = 0

    for expansion_dir in sorted(CARDS_DIR.iterdir(), key=lambda path: path.name.casefold()):
        if not expansion_dir.is_dir():
            continue

        image_filenames = get_image_filenames(expansion_dir)
        write_cards_json(expansion_dir, image_filenames)
        generated_count += 1

    return generated_count


if __name__ == "__main__":
    total = generate_cards_json_files()
    print(f"cards.json gerados/substituidos: {total}")
