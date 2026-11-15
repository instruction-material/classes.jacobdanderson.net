"""Execute the checkpoint's supplied SQL and compare independent worked results."""
import argparse
import hashlib
import json
import sqlite3
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--proof", type=Path)
args = parser.parse_args()
fixture = json.loads((Path(__file__).parent / "fixtures/javascript-master-checkpoint-two-sources.json").read_text())
script = fixture["files"]["master-checkpoint-two"]["reference"]["library.sql"]
assert script == fixture["files"]["master-checkpoint-two"]["starter"]["library.sql"]
db = sqlite3.connect(":memory:")
try:
    db.executescript(script)
    assert db.execute("SELECT title FROM books WHERE shelf_id=1 ORDER BY id").fetchall() == [
        ("Moon Map",), ("River Robots",)
    ]
    assert db.execute(
        "SELECT books.title,bookshelves.label FROM books "
        "JOIN bookshelves ON books.shelf_id=bookshelves.id ORDER BY books.id"
    ).fetchall() == [("Moon Map", "Fiction"), ("River Robots", "Fiction"), ("Seed Lab", "Science")]
    db.execute("INSERT INTO books VALUES (13,'Star Garden',2)")
    assert db.execute("SELECT title FROM books WHERE id=13").fetchall() == [("Star Garden",)]
    db.execute("UPDATE books SET shelf_id=1 WHERE id=13")
    assert db.execute(
        "SELECT label FROM bookshelves JOIN books ON bookshelves.id=books.shelf_id WHERE books.id=13"
    ).fetchall() == [("Fiction",)]
    db.execute("DELETE FROM books WHERE id=13")
    assert db.execute("SELECT COUNT(*) FROM books").fetchone() == (3,)
    for statement, expected in [
        ("INSERT INTO books VALUES (14,'Invalid',99)", "FOREIGN KEY"),
        ("INSERT INTO books VALUES (10,'Duplicate',1)", "UNIQUE"),
    ]:
        try:
            db.execute(statement)
        except sqlite3.IntegrityError as error:
            assert expected in str(error), str(error)
        else:
            raise AssertionError("Expected constraint rejection")
finally:
    db.close()
proof = {"passed": True, "checks": 7, "sqlSHA256": hashlib.sha256(script.encode()).hexdigest(), "networkRequests": 0}
if args.proof:
    args.proof.parent.mkdir(parents=True, exist_ok=True)
    args.proof.write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps(proof))
