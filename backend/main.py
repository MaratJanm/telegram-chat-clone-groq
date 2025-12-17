from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Optional
import uuid
import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get("DATABASE_URL")

db_conn: Optional[psycopg2.extensions.connection] = None


def get_db_connection():
    global db_conn
    if db_conn is None or db_conn.closed:
        if DATABASE_URL:
            try:
                db_conn = psycopg2.connect(DATABASE_URL)
                db_conn.autocommit = True
            except Exception as e:
                print(f"Database connection error: {e}")
                return None
    return db_conn


def init_db():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute('''
                    CREATE TABLE IF NOT EXISTS messages (
                        id UUID PRIMARY KEY,
                        text TEXT NOT NULL,
                        timestamp VARCHAR(10) NOT NULL,
                        is_outgoing BOOLEAN NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW()
                    )
                ''')
            print("Database initialized successfully!")
        except Exception as e:
            print(f"Database init error: {e}")


def close_db():
    global db_conn
    if db_conn and not db_conn.closed:
        db_conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    close_db()


app = FastAPI(title="Telegram Chat API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageCreate(BaseModel):
    text: str
    is_outgoing: bool = True


class Message(BaseModel):
    id: str
    text: str
    timestamp: str
    is_outgoing: bool


class MessagesResponse(BaseModel):
    messages: List[Message]


messages_memory: List[dict] = []


@app.get("/")
def root():
    return {"status": "ok", "service": "Telegram Chat API"}


@app.get("/api/messages", response_model=MessagesResponse)
def get_messages():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    'SELECT id, text, timestamp, is_outgoing FROM messages ORDER BY created_at ASC'
                )
                rows = cur.fetchall()
                messages = [
                    {
                        "id": str(row["id"]),
                        "text": row["text"],
                        "timestamp": row["timestamp"],
                        "is_outgoing": row["is_outgoing"]
                    }
                    for row in rows
                ]
                return {"messages": messages}
        except Exception as e:
            print(f"Error fetching messages: {e}")
    return {"messages": messages_memory}


@app.post("/api/messages", response_model=Message)
def create_message(message: MessageCreate):
    if not message.text.strip():
        raise HTTPException(status_code=400, detail="Message text cannot be empty")
    
    new_message = {
        "id": str(uuid.uuid4()),
        "text": message.text.strip(),
        "timestamp": datetime.now().strftime("%H:%M"),
        "is_outgoing": message.is_outgoing
    }
    
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute(
                    '''INSERT INTO messages (id, text, timestamp, is_outgoing) 
                       VALUES (%s, %s, %s, %s)''',
                    (new_message["id"], new_message["text"], 
                     new_message["timestamp"], new_message["is_outgoing"])
                )
        except Exception as e:
            print(f"Error saving message: {e}")
            messages_memory.append(new_message)
    else:
        messages_memory.append(new_message)
    
    return new_message


@app.delete("/api/messages")
def clear_messages():
    global messages_memory
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute('DELETE FROM messages')
        except Exception as e:
            print(f"Error clearing messages: {e}")
    messages_memory = []
    return {"status": "ok", "message": "All messages cleared"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)