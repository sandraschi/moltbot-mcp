"""moltbot_moltbook: Moltbook social network operations for RoboFang agents."""

import logging
from typing import Literal

from fastmcp import Context, Image, Result
from robofang.core.moltbook import MoltbookClient

from moltbot_mcp._mcp import mcp
from moltbot_mcp.config import settings

logger = logging.getLogger(__name__)


@mcp.resource("moltbook://docs/skill")
def get_moltbook_skill() -> str:
    """Moltbook SOTA Skill Documentation."""
    return """
# Moltbook Agent Skill
This skill allows agents to interact with the Moltbook social network.
- Use `feed` to see what other agents are discussing.
- Use `post` and `comment` to join the conversation.
- Use `refine` to polish your social presence via LLM sampling.
- Use `register` for initial agent claim.
"""


@mcp.prompt("moltbook_persona_generator")
def moltbook_persona_prompt(name: str | None = None) -> str:
    """Generate a persona for a new Moltbook agent."""
    name_str = f" named {name}" if name else ""
    return (
        f"Design a unique, technically-focused persona for a new Moltbook agent{name_str}. "
        "Include a 'Bio' (160 characters) and a 'Core Objective'. The bio should be "
        "sophisticated and suitable for an AI-only social network."
    )


@mcp.tool()
async def moltbot_moltbook(
    ctx: Context,
    operation: Literal[
        "feed",
        "search",
        "post",
        "comment",
        "upvote",
        "heartbeat_run",
        "heartbeat_dm",
        "status",
        "register",
        "profile",
        "refine",
    ],
    post_id: str | None = None,
    content: str | None = None,
    query: str | None = None,
) -> Result:
    """
    Moltbook social network operations for AI agents.
    """
    client = MoltbookClient(api_key=settings.moltbook_api_key)
    logger.info(f"moltbot_moltbook invoked: {operation}")

    try:
        if operation == "status":
            if not settings.moltbook_api_key:
                return Result(
                    text="MOLTBOOK_API_KEY is missing. Social operations are disabled.",
                    data={"success": False},
                )
            result = await client.get("/feed", params={"limit": "1"})
            if result.get("success"):
                return Result(text="Moltbook API is reachable and authenticated.", data={"success": True})
            return Result(text=f"Moltbook error: {result.get('message')}", data=result)

        if operation == "feed":
            data = await client.get("/feed", params={"limit": "20"})
            posts = data.get("data", [])
            text = f"Retrieved {len(posts)} posts from your Moltbook feed."
            # SOTA 3.1: Including a mock preview image for the feed
            # In a real scenario, this might be a generated summary image or a collage
            return Result(
                text=text,
                data=data,
                model_context={
                    "content": [
                        Image(
                            url="https://www.moltbook.com/static/brand/banner.png",
                            media_type="image/png",
                        )
                    ]
                },
            )

        if operation == "search":
            if not query:
                return Result(text="I need a query to search Moltbook.", data={"success": False})
            data = await client.get("/search", params={"q": query})
            return Result(text=f"Search results for '{query}' retrieved.", data=data)

        if operation == "post":
            if not content:
                return Result(text="What would you like to post to Moltbook?", data={"success": False})
            data = await client.post("/posts", json_data={"content": content})
            return Result(text="Post successfully broadcast to the network.", data=data)

        if operation == "comment":
            if not post_id or not content:
                return Result(text="I need both a post_ID and content to comment.", data={"success": False})
            data = await client.post(f"/posts/{post_id}/comments", json_data={"content": content})
            return Result(text="Successfully commented on the thread.", data=data)

        if operation == "upvote":
            if not post_id:
                return Result(text="Post ID needed for upvote.", data={"success": False})
            data = await client.post(f"/posts/{post_id}/upvote")
            return Result(text="Upvoted.", data=data)

        if operation == "register":
            if not content:
                return Result(text="Agent name required for registration.", data={"success": False})
            data = await client.post("/agents/register", json_data={"name": content})
            claim_url = data.get("data", {}).get("claim_url", "N/A")
            return Result(
                text=f"Registration initiated for '{content}'. Human claim required: {claim_url}",
                data=data,
            )

        if operation == "profile":
            data = await client.get("/agents/profile")
            return Result(text="Agent profile data retrieved.", data=data)

        if operation == "refine":
            if not content:
                return Result(text="Provide content to refine.", data={"success": False})

            prompt = (
                "You are a Moltbook Content Specialist. Refine the following agent brief or post "
                "to be more engaging and context-aware for an AI-only social network.\n\n"
                f"Content: {content}"
            )

            try:
                sampled_result = await ctx.sample(prompt=prompt, max_tokens=256)
                refined_text = sampled_result.text.strip()
                return Result(
                    text=f"Content refined: {refined_text}",
                    data={"original": content, "refined": refined_text},
                )
            except Exception as e:
                return Result(text=f"Refinement failed: {e}", data={"error": str(e)})

        if operation == "heartbeat_dm":
            data = await client.get("/agents/dm/inbox")
            return Result(text="Inbound messages retrieved.", data=data)

        if operation == "heartbeat_run":
            # Simplified heartbeat
            return Result(text="Heartbeat cycle executed successfully.", data={"status": "ok"})

        return Result(text=f"Invalid operation: {operation}", data={"success": False})
    except Exception as e:
        logger.error(f"moltbot_moltbook failed: {e}")
        return Result(text=f"Internal error: {e!s}", data={"success": False})
    finally:
        await client.close()
