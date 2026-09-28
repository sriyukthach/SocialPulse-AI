import os
import logging
import concurrent.futures
from typing import List, Dict, Any, Optional
from hindsight_client import Hindsight
from app.config import settings

logger = logging.getLogger(__name__)

class HindsightService:
    def __init__(self):
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.api_key = settings.HINDSIGHT_API_KEY if settings.HINDSIGHT_API_KEY else None
        self._executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)

    def _get_client(self) -> Hindsight:
        return Hindsight(
            base_url=self.base_url,
            api_key=self.api_key
        )

    def retain_post(self, brand_slug: str, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retains post performance, format effectiveness, and audience comments in Hindsight.
        Executes in a dedicated worker thread to avoid event loop conflicts.
        """
        def _run():
            client = self._get_client()
            topic = post_data.get("topic", "")
            fmt = post_data.get("format", "")
            likes = post_data.get("likes", 0)
            comments = post_data.get("comments_count", 0)
            shares = post_data.get("shares_count", 0)
            feedback = post_data.get("audience_feedback", "")
            caption = post_data.get("caption", "")
            date = post_data.get("posted_date", "")

            engagement_summary = f"{likes} likes, {comments} comments, {shares} shares"
            content = (
                f"Social Media Post Performance for {brand_slug.capitalize()}:\n"
                f"- Topic: {topic}\n"
                f"- Format: {fmt}\n"
                f"- Engagement Metrics: {engagement_summary}\n"
                f"- Caption snippet: {caption[:120]}...\n"
            )
            if feedback:
                content += f"- Audience Feedback & Reactions: {feedback}\n"
            if date:
                content += f"- Date: {date}\n"

            context = f"Brand: {brand_slug} | Content Category: {topic} | Format: {fmt}"
            res = client.retain(
                bank_id=brand_slug,
                content=content,
                context=context
            )
            return {"success": True, "bank_id": brand_slug, "items_count": getattr(res, "items_count", 1)}

        try:
            future = self._executor.submit(_run)
            return future.result(timeout=15.0)
        except Exception as e:
            logger.error(f"Error retaining memory in Hindsight: {e}")
            return {"success": False, "error": str(e)}

    def recall_memories(self, brand_slug: str, query: str, max_tokens: int = 4096) -> List[Dict[str, Any]]:
        """
        Recalls relevant memories and audience insights from Hindsight.
        Executes in a dedicated worker thread.
        """
        def _run():
            client = self._get_client()
            res = client.recall(
                bank_id=brand_slug,
                query=query,
                max_tokens=max_tokens
            )
            results = getattr(res, "results", []) or []
            memories = []
            for r in results:
                text = getattr(r, "text", "") or getattr(r, "content", "") or str(r)
                score = getattr(r, "score", None) or getattr(r, "relevance", None)
                mem_type = getattr(r, "type", "world")
                memories.append({
                    "text": text,
                    "relevance_score": score,
                    "type": mem_type,
                    "context": getattr(r, "context", None)
                })
            return memories

        try:
            future = self._executor.submit(_run)
            return future.result(timeout=15.0)
        except Exception as e:
            logger.error(f"Error recalling memories from Hindsight: {e}")
            return []

    def retain_memory(self, brand_slug: str, insight_text: str, context: str = "") -> Dict[str, Any]:
        """
        Retains a raw text insight/observation in Hindsight memory bank.
        Executes in worker thread with fallback error handling.
        """
        def _run():
            client = self._get_client()
            res = client.retain(
                bank_id=brand_slug,
                content=insight_text,
                context=context or "YouTube Data Intelligence"
            )
            return {"success": True, "bank_id": brand_slug, "response": str(res)}

        try:
            future = self._executor.submit(_run)
            return future.result(timeout=15.0)
        except Exception as e:
            logger.error(f"Error retaining insight memory in Hindsight: {e}")
            return {"success": False, "error": str(e)}

    def reflect(self, brand_slug: str, query: str) -> Optional[str]:
        """
        Runs Hindsight reflection over accumulated memories in a worker thread.
        """
        def _run():
            client = self._get_client()
            res = client.reflect(
                bank_id=brand_slug,
                query=query
            )
            return getattr(res, "text", "") or getattr(res, "content", "") or str(res)

        try:
            future = self._executor.submit(_run)
            return future.result(timeout=15.0)
        except Exception as e:
            logger.error(f"Error reflecting in Hindsight: {e}")
            return None

hindsight_service = HindsightService()
