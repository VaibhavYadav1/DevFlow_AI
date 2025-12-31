def project_summary_prompt(parsed_result: dict) -> str:
    return f"""
You are a senior software architect.

Given this parsed project metadata:
{parsed_result}

Generate a well-structured Markdown document using the exact format below:

1. Project Overview
    Brief description (3–4 bullet points)
    What problem the project solves
    Who it is for

2. Architecture explanation
    High-level architecture (bullet points)
    Explain data flow (Controller → Service → Database if applicable)
    Mention modular structure

3. Key components
    Use bullet lists grouped by layer:

    a. Frontend

      Component names

      Responsibilities

    b. Backend

      Controllers

      Services

      APIs

4. Database / Storage

    Databases used

    Purpose

4. Tech stack summary
Present this as a Markdown table:
| Layer    | Technology |
| -------- | ---------- |
| Frontend |            |
| Backend  |            |
| Database |            |
| Tools    |            |


- Headings → rendered as sections
- Bullet points → clean spacing
- Tables → structured visual layout
- Short content blocks → readable cards in UI
- Strict rules → no wall-of-text output

This is exactly how tools like:
- GitHub Copilot Docs
- Sourcegraph Cody
- IDE explainers

generate UI-friendly summaries.

"""

def mermaid_prompt(parsed_result: dict) -> str:
    return f"""
You are a code-to-diagram generator.

You are given parsed metadata of a software project:
{parsed_result}

Your task:
Generate Mermaid diagrams that can be rendered directly by a Mermaid library.

Diagrams required:
1. Class diagram
2. API flow diagram (only if API routes exist; otherwise return an empty string)

STRICT RULES:
- Do NOT use Markdown
- Do NOT wrap output in ```mermaid or ```
- Do NOT include explanations or comments
- Each diagram value MUST be a valid Mermaid definition starting with:
  - classDiagram
  - sequenceDiagram OR flowchart TD
- Mermaid code must be directly renderable without modification

Return EXACTLY this JSON structure and nothing else:

{{
  "class_diagram": "<valid mermaid diagram or empty string>",
  "api_flow": "<valid mermaid diagram or empty string>"
}}
"""