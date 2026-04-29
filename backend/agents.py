"""Agent definitions — each agent takes input and produces output."""
import os
import asyncio
from typing import Optional
from models import NodeData, NodeType
from tools import web_search

MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or api_key == "your_openai_api_key_here":
        return None
    from openai import AsyncOpenAI
    return AsyncOpenAI(api_key=api_key)


async def call_llm(system_prompt: str, user_message: str, model: str = "gpt-4o-mini", temperature: float = 0.7) -> str:
    """Call the LLM or return a mock response."""
    client = get_openai_client()

    if MOCK_MODE or client is None:
        return await mock_llm_response(system_prompt, user_message)

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=temperature,
    )
    return response.choices[0].message.content


async def mock_llm_response(system_prompt: str, user_message: str) -> str:
    """Simulate AI responses for demo/testing without an API key."""
    await asyncio.sleep(1.2)  # Simulate API latency

    prompt_lower = system_prompt.lower()

    if "summarize" in prompt_lower or "summary" in prompt_lower:
        return (
            f"**Summary:**\n\n"
            f"This is a mock summary of the provided content. "
            f"The key points are: (1) The topic is relevant and well-structured, "
            f"(2) Multiple perspectives are covered, "
            f"(3) The information is current and actionable.\n\n"
            f"*[Mock mode — add your OpenAI API key for real AI responses]*"
        )
    elif "write" in prompt_lower or "content" in prompt_lower or "article" in prompt_lower:
        return (
            f"**Generated Content:**\n\n"
            f"This is mock-generated content based on your instructions. "
            f"In a real execution, this would be a full, well-crafted piece of writing "
            f"tailored to your specific requirements and context.\n\n"
            f"The content would include an introduction, main body with supporting details, "
            f"and a conclusion that ties everything together.\n\n"
            f"*[Mock mode — add your OpenAI API key for real AI responses]*"
        )
    elif "code" in prompt_lower or "program" in prompt_lower or "function" in prompt_lower:
        return (
            "```python\n"
            "# Mock generated code\n"
            "def example_function(input_data):\n"
            "    \"\"\"\n"
            "    This is a mock code response.\n"
            "    Add your OpenAI API key for real code generation.\n"
            "    \"\"\"\n"
            "    result = process(input_data)\n"
            "    return result\n"
            "```\n\n"
            "*[Mock mode — add your OpenAI API key for real AI responses]*"
        )
    elif "transform" in prompt_lower or "translate" in prompt_lower or "convert" in prompt_lower:
        return (
            f"**Transformed Output:**\n\n"
            f"This is a mock transformation of your input text. "
            f"The transformation has been applied according to your instructions.\n\n"
            f"*[Mock mode — add your OpenAI API key for real AI responses]*"
        )
    else:
        return (
            f"**AI Response:**\n\n"
            f"This is a mock AI response to: \"{user_message[:100]}...\"\n\n"
            f"In production mode with a valid API key, this would be a real, "
            f"contextually appropriate response from GPT.\n\n"
            f"*[Mock mode — add your OpenAI API key for real AI responses]*"
        )


# ─── Agent Implementations ────────────────────────────────────────────────────

async def run_input_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Text Input node — just passes through the user's text."""
    return data.inputText or "No input provided"


async def run_web_searcher_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Web Searcher — searches the web for the given query."""
    query = previous_output or data.prompt or "latest AI news"
    results = await web_search(query, max_results=5)
    return f"**Search Query:** {query}\n\n**Results:**\n\n{results}"


async def run_writer_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Writer — writes content based on instructions and context."""
    system_prompt = (
        "You are an expert content writer. Write clear, engaging, well-structured content. "
        "Use markdown formatting where appropriate."
    )
    custom_prompt = data.prompt or "Write a comprehensive piece about the following:"
    user_message = f"{custom_prompt}\n\nContext/Input:\n{previous_output or 'No context provided'}"

    return await call_llm(system_prompt, user_message, data.model or "gpt-4o-mini", data.temperature or 0.7)


async def run_summarizer_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Summarizer — condenses long text into key points."""
    system_prompt = (
        "You are an expert at summarizing information. "
        "Create concise, accurate summaries that capture the most important points. "
        "Use bullet points for clarity when appropriate."
    )
    custom_prompt = data.prompt or "Summarize the following content concisely:"
    user_message = f"{custom_prompt}\n\n{previous_output or 'No content to summarize'}"

    return await call_llm(system_prompt, user_message, data.model or "gpt-4o-mini", data.temperature or 0.3)


async def run_code_generator_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Code Generator — writes code based on instructions."""
    language = data.language or "Python"
    system_prompt = (
        f"You are an expert {language} developer. "
        f"Write clean, well-commented, production-ready {language} code. "
        f"Always include docstrings and handle edge cases. "
        f"Format code in markdown code blocks."
    )
    custom_prompt = data.prompt or f"Write {language} code for the following:"
    user_message = f"{custom_prompt}\n\nRequirements/Context:\n{previous_output or 'No requirements provided'}"

    return await call_llm(system_prompt, user_message, data.model or "gpt-4o-mini", data.temperature or 0.2)


async def run_transformer_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Transformer — transforms text (translate, reformat, rewrite, etc.)."""
    system_prompt = (
        "You are a text transformation expert. "
        "Apply the requested transformation precisely and completely."
    )
    custom_prompt = data.prompt or "Transform the following text:"
    user_message = f"Instruction: {custom_prompt}\n\nText to transform:\n{previous_output or 'No text provided'}"

    return await call_llm(system_prompt, user_message, data.model or "gpt-4o-mini", data.temperature or 0.5)


async def run_output_agent(data: NodeData, previous_output: Optional[str]) -> str:
    """Output node — displays the final result."""
    return previous_output or "No output received"


# ─── Agent Registry ───────────────────────────────────────────────────────────

AGENT_RUNNERS = {
    NodeType.INPUT: run_input_agent,
    NodeType.WEB_SEARCHER: run_web_searcher_agent,
    NodeType.WRITER: run_writer_agent,
    NodeType.SUMMARIZER: run_summarizer_agent,
    NodeType.CODE_GENERATOR: run_code_generator_agent,
    NodeType.TRANSFORMER: run_transformer_agent,
    NodeType.OUTPUT: run_output_agent,
}


async def run_agent(node_type: NodeType, data: NodeData, previous_output: Optional[str]) -> str:
    """Dispatch to the correct agent runner."""
    runner = AGENT_RUNNERS.get(node_type)
    if not runner:
        raise ValueError(f"Unknown agent type: {node_type}")
    return await runner(data, previous_output)
