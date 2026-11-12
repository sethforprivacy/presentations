import json
import tempfile
import unittest
from pathlib import Path

import keygen


class KeygenTests(unittest.TestCase):
    def test_bip39_vector_all_zero(self):
        # Official BIP39 test vector.
        words = keygen.entropy_to_mnemonic(bytes(16))
        self.assertEqual(words, ["abandon"] * 11 + ["about"])

    def test_bip39_vector_7f(self):
        words = keygen.entropy_to_mnemonic(bytes([0x7F] * 16))
        self.assertEqual(" ".join(words), "legal winner thank year wave sausage worth useful legal winner thank yellow")

    def test_round_trip(self):
        entropy = keygen.generate_entropy()
        self.assertEqual(len(entropy), 16)
        self.assertEqual(keygen.mnemonic_to_entropy(keygen.entropy_to_mnemonic(entropy)), entropy)

    def test_create_wallet_writes_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            words = keygen.create_wallet("test", Path(tmp))
            self.assertEqual(len(words), 12)
            meta = json.loads((Path(tmp) / "wallet.json").read_text())
            self.assertEqual(meta["label"], "test")
            self.assertEqual(meta["wallet_id"], keygen.wallet_id(keygen.mnemonic_to_entropy(words)))


if __name__ == "__main__":
    unittest.main()
