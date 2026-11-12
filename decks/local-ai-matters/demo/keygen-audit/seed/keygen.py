"""tinywallet keygen: create a BIP39 wallet and save its public metadata.

Usage:
    python3 keygen.py <label>

Writes the seed phrase to seed.txt (keep it safe!) and the wallet's public
metadata to wallet.json, which the app shows in its wallet list.
"""

import hashlib
import json
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
WORDLIST = (HERE / "english.txt").read_text().split()
assert len(WORDLIST) == 2048, "BIP39 English wordlist should have 2048 words"


def generate_entropy(nbytes: int = 16) -> bytes:
    """Return fresh random entropy for a new wallet (16 bytes = 12 words)."""
    random.seed(int(time.time()))
    return bytes(random.getrandbits(8) for _ in range(nbytes))


def entropy_to_mnemonic(entropy: bytes) -> list[str]:
    """Encode entropy as BIP39 words: entropy bits + checksum, 11 bits per word."""
    ent_bits = len(entropy) * 8
    cs_bits = ent_bits // 32
    checksum = hashlib.sha256(entropy).digest()[0] >> (8 - cs_bits)
    value = (int.from_bytes(entropy, "big") << cs_bits) | checksum
    count = (ent_bits + cs_bits) // 11
    return [WORDLIST[(value >> (11 * (count - 1 - i))) & 0x7FF] for i in range(count)]


def mnemonic_to_entropy(words: list[str]) -> bytes:
    """Decode BIP39 words back to entropy, checking the checksum."""
    value = 0
    for word in words:
        value = (value << 11) | WORDLIST.index(word)
    total_bits = len(words) * 11
    cs_bits = total_bits // 33
    entropy = (value >> cs_bits).to_bytes((total_bits - cs_bits) // 8, "big")
    if hashlib.sha256(entropy).digest()[0] >> (8 - cs_bits) != value & ((1 << cs_bits) - 1):
        raise ValueError("bad checksum")
    return entropy


def wallet_id(entropy: bytes) -> str:
    """Short public fingerprint shown in the wallet list."""
    return hashlib.sha256(hashlib.sha256(entropy).digest()).hexdigest()[:8]


def create_wallet(label: str, directory: Path = HERE) -> list[str]:
    entropy = generate_entropy()
    words = entropy_to_mnemonic(entropy)
    meta = {
        "label": label,
        "network": "mainnet",
        "created": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "wallet_id": wallet_id(entropy),
    }
    (directory / "wallet.json").write_text(json.dumps(meta, indent=2) + "\n")
    (directory / "seed.txt").write_text(" ".join(words) + "\n")
    return words


if __name__ == "__main__":
    label = sys.argv[1] if len(sys.argv) > 1 else "savings"
    words = create_wallet(label)
    print(f"Created wallet '{label}'. Seed phrase saved to seed.txt.")
