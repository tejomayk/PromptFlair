import json

def analyze_prompt(prompt_text: str) -> str:
    """
    Analyzes the user's prompt and returns a list of suggestions as a JSON string.
    """
    suggestions = []
    
    # Rule 1: Length Check
    # Check if the prompt is shorter than 15 words.
    if len(prompt_text.split()) < 15:
        suggestions.append(
            "💡 **Specificity Tip:** Short prompts can be ambiguous. Try adding more context or specific details about what you want."
        )

    # Rule 2: Format Check
    # Check for task words without explicit format instructions.
    task_words = ["summarize", "list", "explain", "create", "write"]
    format_words = ["table", "list", "paragraph", "email", "json", "markdown"]
    
    if any(word in prompt_text.lower() for word in task_words) and not any(word in prompt_text.lower() for word in format_words):
        suggestions.append(
            "💡 **Format Tip:** Consider telling the AI how you want the output formatted. For example, 'in a bulleted list' or 'as a table'."
        )

    # Rule 3: Persona Check
    # Check if the prompt assigns a role to the AI.
    persona_phrases = ["act as", "you are a", "be a", "your role is"]
    
    if not any(phrase in prompt_text.lower() for phrase in persona_phrases):
        suggestions.append(
            "💡 **Persona Tip:** You can guide the AI's tone and style by giving it a role. For example, 'Act as an expert copywriter...'."
        )

    # Return the list of suggestions as a JSON formatted string.
    # This makes it easy for JavaScript to parse.
    return json.dumps(suggestions)