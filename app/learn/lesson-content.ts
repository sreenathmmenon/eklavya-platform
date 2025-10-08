export interface LessonContent {
  id: string;
  instructionsMarkdown: string;
  starterCode: string;
  solutionCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  aiHintPrompt: string;
}

export const LESSON_CONTENT: Record<string, LessonContent> = {
  '1-1': {
    id: '1-1',
    instructionsMarkdown: `# Prompt Engineering Fundamentals

## What You'll Learn
Master the art of crafting effective prompts for Claude and other LLMs.

## The Challenge
Write a Python function that generates prompts using best practices:

### Key Concepts:
1. **Clear Instructions** - Be specific about what you want
2. **Context Provision** - Give relevant background information
3. **Output Format** - Specify how you want the response
4. **Examples** - Show examples when helpful (few-shot learning)

## Your Task
Complete the \`generate_prompt()\` function that takes a task and returns a well-structured prompt following these principles.

### Example:
\`\`\`python
task = "Explain recursion"
prompt = generate_prompt(task)
# Should return a prompt with clear instructions, context, and format
\`\`\`

**Tip**: Good prompts have a structure: role, task, context, constraints, format.`,

    starterCode: `def generate_prompt(task: str) -> str:
    """
    Generate a well-structured prompt for an LLM.

    Args:
        task: The task you want the LLM to perform

    Returns:
        A well-crafted prompt string
    """
    # TODO: Build a prompt with:
    # 1. Role assignment (e.g., "You are an expert...")
    # 2. Clear task description
    # 3. Any necessary context
    # 4. Output format specification

    prompt = f"""
    # Your prompt here
    """

    return prompt


# Test your function
if __name__ == "__main__":
    task = "Explain recursion to a beginner"
    result = generate_prompt(task)
    print(result)

    # Good prompts should be:
    # - Clear and specific
    # - Include role/context
    # - Specify output format
    # - Be concise but complete
`,

    solutionCode: `def generate_prompt(task: str) -> str:
    """
    Generate a well-structured prompt for an LLM.

    Args:
        task: The task you want the LLM to perform

    Returns:
        A well-crafted prompt string
    """
    prompt = f"""You are an expert technical educator with a gift for clear explanations.

Task: {task}

Please provide your response following this structure:
1. Simple Definition: Explain the concept in one sentence
2. Key Principles: List 2-3 core principles
3. Practical Example: Show a real code example with comments
4. Common Pitfalls: Mention 1-2 mistakes beginners make

Keep your response concise (under 300 words) and use simple language.
Format your response in markdown for readability."""

    return prompt


# Test your function
if __name__ == "__main__":
    task = "Explain recursion to a beginner"
    result = generate_prompt(task)
    print(result)
    print("\\n✅ This prompt follows best practices:")
    print("- Assigns a role (expert educator)")
    print("- Gives clear task")
    print("- Specifies output structure")
    print("- Sets constraints (length, language)")
    print("- Requests markdown format")
`,

    testCases: [
      {
        input: 'task = "Explain recursion"',
        expectedOutput: 'Prompt should include role, task, structure, and format',
        description: 'Generate structured prompt'
      }
    ],

    aiHintPrompt: 'The learner is working on prompt engineering fundamentals. They need to create a function that generates well-structured prompts. Give them a hint about the key components: role assignment, clear task, context, output format. Be encouraging and specific.'
  },

  '1-2': {
    id: '1-2',
    instructionsMarkdown: `# RAG Architecture Basics

## What You'll Learn
Build your first Retrieval Augmented Generation (RAG) system.

## The Concept
RAG combines retrieval (finding relevant info) with generation (LLM responses):

\`\`\`
User Query → Retrieve Docs → Add to Prompt → LLM Response
\`\`\`

## Your Task
Implement a simple RAG function that:
1. Searches a knowledge base for relevant documents
2. Injects them into a prompt
3. Returns a complete prompt ready for Claude

### Example:
\`\`\`python
docs = ["Python is a programming language", "Python has dynamic typing"]
query = "What is Python?"
prompt = simple_rag(query, docs)
# Returns prompt with relevant docs + query
\`\`\`

**Key Insight**: RAG helps LLMs answer questions about data they weren't trained on!`,

    starterCode: `def simple_rag(query: str, documents: list[str], top_k: int = 2) -> str:
    """
    Simple RAG: Retrieve relevant documents and create a prompt.

    Args:
        query: User's question
        documents: List of knowledge base documents
        top_k: Number of documents to retrieve

    Returns:
        Complete prompt with context + query
    """
    # Step 1: Find relevant documents (simple keyword matching for now)
    # TODO: Implement simple keyword search
    # Hint: Check if query words appear in documents

    relevant_docs = []

    # Step 2: Build RAG prompt
    # TODO: Create prompt with format:
    # """
    # Context: <relevant docs>
    #
    # Question: <query>
    #
    # Answer based only on the context above.
    # """

    prompt = ""

    return prompt


# Test your RAG system
if __name__ == "__main__":
    knowledge_base = [
        "Python is a high-level programming language created by Guido van Rossum.",
        "Python uses dynamic typing and garbage collection.",
        "JavaScript is used for web development.",
        "Python is popular for data science and machine learning."
    ]

    query = "What is Python?"
    result = simple_rag(query, knowledge_base)
    print(result)
`,

    solutionCode: `def simple_rag(query: str, documents: list[str], top_k: int = 2) -> str:
    """
    Simple RAG: Retrieve relevant documents and create a prompt.

    Args:
        query: User's question
        documents: List of knowledge base documents
        top_k: Number of documents to retrieve

    Returns:
        Complete prompt with context + query
    """
    # Step 1: Simple keyword-based retrieval
    query_words = set(query.lower().split())

    # Score each document by keyword overlap
    doc_scores = []
    for doc in documents:
        doc_words = set(doc.lower().split())
        overlap = len(query_words & doc_words)
        doc_scores.append((doc, overlap))

    # Get top-k documents
    doc_scores.sort(key=lambda x: x[1], reverse=True)
    relevant_docs = [doc for doc, score in doc_scores[:top_k]]

    # Step 2: Build RAG prompt
    context = "\\n\\n".join(f"[{i+1}] {doc}" for i, doc in enumerate(relevant_docs))

    prompt = f"""You are a helpful assistant. Answer the question using ONLY the context provided below.

Context:
{context}

Question: {query}

Answer based only on the context above. If the context doesn't contain enough information, say so."""

    return prompt


# Test your RAG system
if __name__ == "__main__":
    knowledge_base = [
        "Python is a high-level programming language created by Guido van Rossum.",
        "Python uses dynamic typing and garbage collection.",
        "JavaScript is used for web development.",
        "Python is popular for data science and machine learning."
    ]

    query = "What is Python?"
    result = simple_rag(query, knowledge_base)
    print(result)
    print("\\n✅ RAG Components:")
    print("- Retrieved relevant documents")
    print("- Injected context into prompt")
    print("- Constrained answer to context only")
`,

    testCases: [
      {
        input: 'query = "What is Python?"',
        expectedOutput: 'Prompt with Python-related docs as context',
        description: 'Retrieve and format relevant context'
      }
    ],

    aiHintPrompt: 'The learner is building a RAG system. They need to: 1) Find relevant documents using keyword matching, 2) Format them as context, 3) Create a prompt that instructs the LLM to use only that context. Give them a hint about the structure.'
  },

  '1-3': {
    id: '1-3',
    instructionsMarkdown: `# Building with Claude API

## What You'll Learn
Integrate Claude into your applications using the Anthropic SDK.

## The Setup
\`\`\`python
from anthropic import Anthropic

client = Anthropic(api_key="your-key")
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

## Your Task
Build a function that:
1. Takes a user message
2. Calls Claude API
3. Returns the response text
4. Handles errors gracefully

**Important**: Always handle API errors and set reasonable max_tokens!`,

    starterCode: `# Note: This is example code. In the real app, use the /api/chat endpoint.

def call_claude(user_message: str, system_prompt: str = "") -> str:
    """
    Call Claude API and return the response.

    Args:
        user_message: The user's input
        system_prompt: Optional system instructions

    Returns:
        Claude's response text
    """
    # TODO: Implement Claude API call
    # 1. Create Anthropic client
    # 2. Build messages list
    # 3. Call client.messages.create()
    # 4. Extract text from response
    # 5. Handle errors with try/except

    try:
        # Your implementation here
        response_text = "Not implemented yet"

    except Exception as e:
        response_text = f"Error: {str(e)}"

    return response_text


# Test your function
if __name__ == "__main__":
    # This would work with a real API key
    response = call_claude(
        user_message="Explain Python in one sentence",
        system_prompt="You are a concise technical expert."
    )
    print(response)
`,

    solutionCode: `from anthropic import Anthropic

def call_claude(user_message: str, system_prompt: str = "") -> str:
    """
    Call Claude API and return the response.

    Args:
        user_message: The user's input
        system_prompt: Optional system instructions

    Returns:
        Claude's response text
    """
    try:
        # Create client (in production, use env variable for API key)
        client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

        # Build request
        kwargs = {
            "model": "claude-sonnet-4-5-20250929",
            "max_tokens": 1024,
            "messages": [
                {"role": "user", "content": user_message}
            ]
        }

        # Add system prompt if provided
        if system_prompt:
            kwargs["system"] = system_prompt

        # Call API
        response = client.messages.create(**kwargs)

        # Extract text
        response_text = response.content[0].text

        return response_text

    except Exception as e:
        return f"Error calling Claude: {str(e)}"


# Test your function
if __name__ == "__main__":
    response = call_claude(
        user_message="Explain Python in one sentence",
        system_prompt="You are a concise technical expert."
    )
    print(response)
    print("\\n✅ Best Practices:")
    print("- API key from environment variable")
    print("- Reasonable max_tokens limit")
    print("- Error handling with try/except")
    print("- System prompt for behavior control")
`,

    testCases: [
      {
        input: 'user_message = "Hello"',
        expectedOutput: 'Returns Claude response text',
        description: 'Basic API call'
      }
    ],

    aiHintPrompt: 'The learner is integrating Claude API. They need to: 1) Create Anthropic client, 2) Format messages correctly, 3) Extract text from response.content[0].text, 4) Add error handling. Give them a hint about the structure.'
  }
};
