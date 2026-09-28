import re
import logging
import requests
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class YouTubeService:
    BASE_URL = "https://www.googleapis.com/youtube/v3"

    @staticmethod
    def extract_handle_or_id(input_str: str) -> Dict[str, str]:
        """
        Parses various YouTube URL formats or handles:
        - https://www.youtube.com/@mkbhd
        - https://youtube.com/@mkbhd/videos
        - https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ
        - https://www.youtube.com/c/Veritasium
        - https://www.youtube.com/user/marquesbrownlee
        - @mkbhd
        - mkbhd
        """
        cleaned = input_str.strip()
        
        # Check for channel ID pattern (/channel/UC...)
        channel_id_match = re.search(r'youtube\.com/channel/(UC[a-zA-Z0-9_-]+)', cleaned)
        if channel_id_match:
            return {"type": "channel_id", "value": channel_id_match.group(1)}

        # Check for handle pattern (/@handle)
        handle_match = re.search(r'youtube\.com/@([a-zA-Z0-9_.-]+)', cleaned)
        if handle_match:
            return {"type": "handle", "value": handle_match.group(1)}

        # Check for custom URL (/c/customname)
        c_match = re.search(r'youtube\.com/c/([a-zA-Z0-9_.-]+)', cleaned)
        if c_match:
            return {"type": "query", "value": c_match.group(1)}

        # Check for user URL (/user/username)
        user_match = re.search(r'youtube\.com/user/([a-zA-Z0-9_.-]+)', cleaned)
        if user_match:
            return {"type": "user", "value": user_match.group(1)}

        # Raw handle or plain text query
        if cleaned.startswith('@'):
            return {"type": "handle", "value": cleaned[1:]}

        return {"type": "handle", "value": cleaned}

    def fetch_channel_details(self, input_str: str, api_key: str) -> Dict[str, Any]:
        """
        Fetches public channel statistics, metadata, and upload playlist ID from YouTube Data API v3.
        """
        if not api_key or api_key.strip() == "":
            raise ValueError(
                "YouTube API Key (YOUTUBE_API_KEY) is not configured in backend/.env. "
                "Please configure your Google YouTube Data API v3 key to analyze live YouTube channels."
            )

        parsed = self.extract_handle_or_id(input_str)
        p_type = parsed["type"]
        val = parsed["value"]

        items = []

        if p_type == "channel_id":
            url = f"{self.BASE_URL}/channels?part=snippet,statistics,contentDetails&id={val}&key={api_key}"
            res = requests.get(url, timeout=10)
            data = res.json()
            items = data.get("items", [])

        elif p_type == "handle":
            # Try forHandle first
            url = f"{self.BASE_URL}/channels?part=snippet,statistics,contentDetails&forHandle={val}&key={api_key}"
            res = requests.get(url, timeout=10)
            data = res.json()
            items = data.get("items", [])
            
            if not items and not val.startswith('@'):
                # Try forHandle with @
                url = f"{self.BASE_URL}/channels?part=snippet,statistics,contentDetails&forHandle=@{val}&key={api_key}"
                res = requests.get(url, timeout=10)
                data = res.json()
                items = data.get("items", [])

        elif p_type == "user":
            url = f"{self.BASE_URL}/channels?part=snippet,statistics,contentDetails&forUsername={val}&key={api_key}"
            res = requests.get(url, timeout=10)
            data = res.json()
            items = data.get("items", [])

        # Search fallback if not found directly
        if not items:
            search_url = f"{self.BASE_URL}/search?part=snippet&type=channel&q={val}&maxResults=1&key={api_key}"
            s_res = requests.get(search_url, timeout=10)
            s_data = s_res.json()
            s_items = s_data.get("items", [])
            if s_items:
                ch_id = s_items[0]["id"]["channelId"]
                url = f"{self.BASE_URL}/channels?part=snippet,statistics,contentDetails&id={ch_id}&key={api_key}"
                res = requests.get(url, timeout=10)
                items = res.json().get("items", [])

        if not items:
            raise ValueError(f"Unable to find public YouTube channel for '{input_str}'. Please check the URL or handle.")

        item = items[0]
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content_details = item.get("contentDetails", {})

        playlist_id = content_details.get("relatedPlaylists", {}).get("uploads", "")
        custom_url = snippet.get("customUrl", "")
        if custom_url and not custom_url.startswith('@'):
            custom_url = f"@{custom_url}"
        if not custom_url:
            custom_url = f"@{val}"

        thumbnails = snippet.get("thumbnails", {})
        thumb_url = (
            thumbnails.get("high", {}).get("url")
            or thumbnails.get("medium", {}).get("url")
            or thumbnails.get("default", {}).get("url", "")
        )

        return {
            "channel_id": item["id"],
            "title": snippet.get("title", val),
            "description": snippet.get("description", ""),
            "custom_url": custom_url.lower(),
            "slug": custom_url.lower().replace('@', ''),
            "thumbnail_url": thumb_url,
            "view_count": int(stats.get("viewCount", 0)),
            "subscriber_count": int(stats.get("subscriberCount", 0)) if "subscriberCount" in stats else None,
            "video_count": int(stats.get("videoCount", 0)),
            "uploads_playlist_id": playlist_id
        }

    def fetch_recent_videos(self, playlist_id: str, api_key: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Fetches the recent public uploads playlist items and their full statistics (views, likes, comments).
        """
        if not playlist_id:
            return []

        # Step 1: Get playlist items
        pl_url = f"{self.BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId={playlist_id}&maxResults={max_results}&key={api_key}"
        pl_res = requests.get(pl_url, timeout=10)
        pl_data = pl_res.json()

        video_ids = [
            item["contentDetails"]["videoId"]
            for item in pl_data.get("items", [])
            if "contentDetails" in item and "videoId" in item["contentDetails"]
        ]

        if not video_ids:
            return []

        # Step 2: Fetch detailed statistics for video IDs
        ids_str = ",".join(video_ids)
        v_url = f"{self.BASE_URL}/videos?part=snippet,statistics,contentDetails&id={ids_str}&key={api_key}"
        v_res = requests.get(v_url, timeout=10)
        v_data = v_res.json()

        videos = []
        for item in v_data.get("items", []):
            vid_id = item["id"]
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})

            # Format detection (Short vs Longform based on duration if available)
            duration_str = item.get("contentDetails", {}).get("duration", "")
            video_format = "Long-form Video"
            if "M" not in duration_str and "H" not in duration_str:
                # Under 60s
                video_format = "YouTube Short"

            # Fetch top comments for this video
            comments = self.fetch_video_comments(vid_id, api_key, max_comments=3)
            comments_text = " | ".join(comments) if comments else None

            videos.append({
                "video_id": vid_id,
                "title": snippet.get("title", "Untitled Video"),
                "description": snippet.get("description", ""),
                "published_at": snippet.get("publishedAt", "")[:10],
                "format": video_format,
                "view_count": int(stats.get("viewCount", 0)),
                "like_count": int(stats.get("likeCount", 0)) if "likeCount" in stats else None,
                "comment_count": int(stats.get("commentCount", 0)) if "commentCount" in stats else None,
                "comments": comments,
                "audience_feedback": comments_text
            })

        return videos

    def fetch_video_comments(self, video_id: str, api_key: str, max_comments: int = 3) -> List[str]:
        """
        Fetches top public comment text threads for a given video ID.
        Handles cases where comments are disabled gracefully.
        """
        url = f"{self.BASE_URL}/commentThreads?part=snippet&videoId={video_id}&maxResults={max_comments}&order=relevance&key={api_key}"
        try:
            res = requests.get(url, timeout=5)
            if res.status_code != 200:
                return []
            data = res.json()
            comments = []
            for item in data.get("items", []):
                top_comment = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
                text = top_comment.get("textDisplay", "").strip()
                if text:
                    # Clean simple HTML tags from comment text
                    text_clean = re.sub(r'<[^>]+>', '', text)
                    comments.append(text_clean[:200])
            return comments
        except Exception:
            return []

youtube_service = YouTubeService()
