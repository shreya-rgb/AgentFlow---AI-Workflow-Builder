"""Built-in tools for agents."""
import asyncio
from typing import Optional


async def web_search(query: str, max_results: int = 5) -> str:
    """Search the web using DuckDuckGo (free, no API key needed)."""
    try:
        from duckduckgo_search import DDGS

        def _search():
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
            return results

        # Run in thread pool to avoid blocking
        loop = asyncio.get_running_loop()
        results = await loop.run_in_executor(None, _search)

        if not results:
            return f"No results found for: {query}"

        formatted = []
        for i, r in enumerate(results, 1):
            title = r.get("title", "No title")
            body = r.get("body", "No description")
            href = r.get("href", "")
            formatted.append(f"{i}. **{title}**\n   {body}\n   Source: {href}")

        return "\n\n".join(formatted)

    except Exception as e:
        return f"Search failed: {str(e)}. Proceeding with available knowledge."
