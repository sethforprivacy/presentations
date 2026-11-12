# tinywallet

A minimal Bitcoin wallet key generator. `keygen.py` creates a 12-word BIP39 seed phrase,
saves it to `seed.txt`, and writes the wallet's public metadata to `wallet.json`.

`wallet.json` in this folder belongs to a real user's wallet, shared in a bug report.
Their `seed.txt` is not here.

Run the tests with:

```bash
python3 -m unittest -v
```
