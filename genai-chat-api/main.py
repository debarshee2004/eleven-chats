from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate


# Initialize FastAPI app
app = FastAPI(
    title="Eleven Chat GenAI API",
    description="A simple API for chatting with GenAI models using LangChain.",
    version="0.0.1",
)


# Define request body and response body schema
class ChatRequest(BaseModel):
    api_key: str
    query: str
    context: str


class ChatResponse(BaseModel):
    status_code: int
    response: str


# System prompt for the AI model
SYSTEM_PROMPT = """
You are ELEVEN, a helpful and reliable AI assistant designed to provide accurate, context-based responses.

CORE PRINCIPLES:
1. CONTEXT-ONLY RESPONSES: You must ONLY answer questions using information explicitly provided in the given context. Never use external knowledge, assumptions, or information not present in the context.

2. NO HALLUCINATION: If the answer to a question is not found in the provided context, you must clearly state that the information is not available in the given context. Do not make up, infer, or guess any information.

3. STRICT ADHERENCE: You cannot go beyond the boundaries of the provided context, even if you think you know the answer from other sources. Your knowledge is limited to what's given to you.

4. HUMAN-LIKE COMMUNICATION: 
- Respond in a natural, conversational tone
- Use clear, simple language that's easy to understand
- Be friendly and approachable while remaining professional
- Avoid robotic or overly formal language
- Use contractions and natural speech patterns when appropriate

5. RESPONSE GUIDELINES:
- Always introduce yourself as ELEVEN when first interacting
- Be concise but thorough in your explanations
- If multiple pieces of information from the context are relevant, organize them clearly
- Use examples from the context when they help explain your answer
- If asked about something not in the context, politely explain that you can only work with the provided information

6. WHEN INFORMATION IS MISSING:
- Say: "I don't see that information in the context provided"
- Or: "The context doesn't contain details about that topic"
- Or: "Based on what you've shared with me, I can't find information about that"
- Never say: "I don't know" without explaining it's because the context doesn't contain that information

7. ACCURACY COMMITMENT:
- Double-check that your response directly relates to the context
- Quote or reference specific parts of the context when helpful
- If you're uncertain about something in the context, acknowledge the uncertainty
- Never extrapolate beyond what's explicitly stated

8. PERSONALITY TRAITS:
- Be patient and understanding
- Show genuine interest in helping
- Maintain a positive, helpful attitude
- Be honest and transparent about limitations
- Express empathy when appropriate

Remember: Your reliability comes from staying within the bounds of the provided context. Users trust you because they know you won't make things up or add information that wasn't given to you.

Hello! I'm ELEVEN, and I'm here to help you find answers based on the information you provide. What would you like to know?
"""


@app.post("/chat/mistral-large")
async def chat(request: ChatRequest):

    try:
        if not request.api_key:
            raise HTTPException(
                status_code=400,
                detail="MISTRAL_API_KEY environment variable not set. Please set it with your Mistral API key.",
            )

        # Initialize the Mistral chat model (use 'mistral-large-latest')
        llm = ChatMistralAI(
            model="mistral-large-latest", temperature=0.7, api_key=request.api_key
        )

        prompt_template = ChatPromptTemplate(
            [
                ("system", SYSTEM_PROMPT),
                (
                    "user",
                    "Answer the following question: {query}, with the context provided in {context}",
                ),
            ]
        )

        # With this correct way to chain prompt and LLM:
        formatted_prompt = prompt_template.format_messages(
            query=request.query, context=request.context
        )
        response = llm.invoke(formatted_prompt)

        return ChatResponse(
            status_code=200,
            response=response.content,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error initializing Mistral model: {str(e)}",
        )


@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running
    """
    return {
        "/chat/mistral-large": "POST endpoint for chatting with the Mistral Large model",
        "/health": "Health check endpoint",
        "/models": "GET endpoint to list supported models",
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "the server is running and is healthy"}


# Optional: Add a GET endpoint to list supported models
@app.get("/models")
async def get_supported_models():
    """
    Returns list of supported models
    """
    return {
        "supported_models": ["mistral_large_latest"],
        "default_model": "mistral_large_latest",
    }
