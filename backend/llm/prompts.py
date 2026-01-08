def project_summary_prompt(parsed_result: dict) -> str:
    return f"""
You are an expert Senior Software Architect and Technical Writer.
Your task is to analyze the provided project metadata and generate a comprehensive, professional, and descriptive project summary report.

**Input Metadata:**
{parsed_result}

**Output Guidelines:**
- **STRICT MARKDOWN ONLY**: Do NOT use HTML tags.
- **Headers**: ALWAYS use `##` for main numbered sections AND bold the text (e.g., `## **1. Section Name**`) to ensure visibility.
- **Lists over Tables**: Use bullet points for descriptive sections.
- **Code Blocks**: Use ```text for directory trees.
- **Clarity**: distinct sections, clear spacing.

**Required Report Structure:**

# Project Deep-Dive Analysis

## **1. Executive Summary**
*Provide a high-level overview using bullet points.*
- **Project Scope**: A clear, detailed description of the project's purpose and goals.
- **Target Audience**: Who is this built for?
- **Core Value Proposition**: What makes it unique?

## **2. Technical Architecture**
*Explain the system design.*
- **Architectural Pattern**: (e.g., MVC, Microservices) and its implementation here.
- **Data Flow**: Step-by-step flow from user action to database.
- **Codebase Structure**:
    - Explain the logical grouping of folders.

## **3. Technology Stack Breakdown**
*Use a Markdown table for clarity.*

| Category | Technologies | Function/Responsibility |
| :--- | :--- | :--- |
| **Frontend** | ... | ... |
| **Backend** | ... | ... |
| **Database** | ... | ... |
| **Key Tools** | ... | ... |

## **4. Key Components**
*Highlight the most important files/modules.*

| Component | Type | Responsibility |
| :--- | :--- | :--- |
| ... | ... | ... |

## **5. Data Management**
- **Storage**: Databases or storage methods used.
- **Schema**: Brief overview of key data models.

## **6. API & Interfaces (If Applicable)**
- **Protocol**: (REST/GraphQL/etc.)
- **Key Endpoints**: Summary of main routes.

## **7. Conclusion & Maintainability**
- Assessment of code quality, modularity, and future scalability.
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