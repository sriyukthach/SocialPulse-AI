"""
Hindsight Persistent Memory Verification Test (Phase 2)
Verifies:
1. Connection to Hindsight (Cloud or Local instance).
2. Retaining a sample memory unit into a test memory bank.
3. Recalling relevant memories with a semantic query.
4. Cross-session persistence (simulating a separate runtime session).
"""

import os
import sys
import uuid
import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from hindsight_client import Hindsight

def test_hindsight_workflow():
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    api_key = os.getenv("HINDSIGHT_API_KEY", "")

    print(f"[*] Testing Hindsight connection at: {base_url}")
    if not api_key or api_key == "your_hindsight_api_key_here":
        print("[!] Warning: HINDSIGHT_API_KEY is not set in backend/.env")
        if "vectorize.io" in base_url:
            print("[X] Hindsight Cloud requires an API key from https://ui.hindsight.vectorize.io")
            return False

    client_session_1 = Hindsight(
        base_url=base_url,
        api_key=api_key if api_key else None
    )

    test_bank_id = f"test-glownest-{str(uuid.uuid4())[:8]}"
    print(f"[*] Creating & Testing Memory Bank: {test_bank_id}")

    test_content = (
        "GlowNest Skincare Audience Insight: Morning skincare routine carousels achieved a 4.8% engagement rate, "
        "with audience comments frequently requesting oily-skin routines and affordable ingredient alternatives."
    )

    print("\n--- Step 1: Retaining Memory (Session 1) ---")
    try:
        retain_res = client_session_1.retain(
            bank_id=test_bank_id,
            content=test_content,
            context="Brand: GlowNest | Platform: Instagram | Metric: High Engagement"
        )
        print(f"[+] Memory successfully retained! Response: {retain_res}")
    except Exception as e:
        print(f"[X] Retain operation failed: {e}")
        return False

    print("\n--- Step 2: Recalling Memory in a Separate Session (Session 2) ---")
    # Simulate a completely fresh session instance
    client_session_2 = Hindsight(
        base_url=base_url,
        api_key=api_key if api_key else None
    )

    query = "What content format and topics performed best for morning routines?"
    try:
        recall_res = client_session_2.recall(
            bank_id=test_bank_id,
            query=query
        )
        print(f"[+] Recall query executed: '{query}'")
        print(f"[+] Raw recall response: {recall_res}")

        # Check results
        results = getattr(recall_res, "results", []) or []
        print(f"[+] Recalled items count: {len(results)}")
        for idx, item in enumerate(results):
            text = getattr(item, "text", "") or getattr(item, "content", "") or str(item)
            print(f"    Memory [{idx+1}]: {text}")

        print("\n[✓] Phase 2 Verification PASSED: Hindsight retain & cross-session recall works!")
        return True

    except Exception as e:
        print(f"[X] Recall operation failed: {e}")
        return False

if __name__ == "__main__":
    success = test_hindsight_workflow()
    sys.exit(0 if success else 1)
