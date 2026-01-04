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
You are a STRICT code-to-mermaid diagram generator.

You are given parsed metadata of a software project:
{parsed_result}

Your task:
Generate Mermaid diagrams that can be rendered DIRECTLY by a Mermaid renderer
WITHOUT any modification.

OUTPUT REQUIREMENTS:
- Output ONLY valid JSON
- Output NOTHING outside the JSON
- Do NOT include explanations, comments, or markdown
- Do NOT wrap diagrams in ``` or ```mermaid
- Do NOT invent classes, methods, APIs, or relationships
- Use ONLY information present in the parsed metadata

DIAGRAM RULES:

CLASS DIAGRAM:
- Start with exactly: classDiagram
- Each class must use this syntax:
  class ClassName {{
    +methodName()
  }}
- Include ONLY public methods (+)
- Add relationships ONLY if clearly implied by usage/imports
- Prefer simple associations (-->)
- Avoid inheritance unless explicitly present

API FLOW DIAGRAM:
- Generate ONLY if API routes exist
- Use sequenceDiagram OR flowchart TD
- Start with exactly:
  - sequenceDiagram
  OR
  - flowchart TD
- If no API routes exist, return an empty string ""

MERMAID VALIDATION RULES:
- No duplicate class names
- No invalid characters in class or method names
- No trailing spaces or invalid indentation
- Mermaid must compile without errors

RETURN FORMAT (EXACT, NO VARIATIONS):

{{
  "class_diagram": "<valid mermaid diagram or empty string>",
  "api_flow": "<valid mermaid diagram or empty string>"
}}
"""