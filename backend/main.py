from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import boto3
import jwt  # PyJWT library
import os
from datetime import datetime, timezone
from uuid import uuid4  # For generating unique IDs
from dotenv import load_dotenv

app = FastAPI()

# Load environment variables
load_dotenv()

# Environment variables
DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'Tasks')
AWS_REGION = os.getenv('REGION', 'us-west-2')
DYNAMODB_ENDPOINT = os.getenv('DYNAMODB_ENDPOINT')  # Optional, for LocalStack

# Configure boto3 based on the endpoint
if DYNAMODB_ENDPOINT and "localhost" in DYNAMODB_ENDPOINT:
    # Use dummy credentials for LocalStack
    boto3.setup_default_session(
        aws_access_key_id="dummy",
        aws_secret_access_key="dummy",
        region_name=AWS_REGION
    )

# DynamoDB resource
dynamodb = boto3.resource(
    'dynamodb',
    region_name=AWS_REGION,
    endpoint_url=DYNAMODB_ENDPOINT  # Use LocalStack endpoint if provided
)
table = dynamodb.Table(DYNAMODB_TABLE)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Models
class Todo(BaseModel):
    id: str
    title: str
    createdAt: str
    completedAt: Optional[str] = None

class TodoCreate(BaseModel):
    title: str

def get_email_from_token(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        # PyJWT's decode function requires a key, but we skip verification
        payload = jwt.decode(token, key="", algorithms=["none"], options={"verify_signature": False})
        return payload.get('email')
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/tasks", response_model=List[Todo])
def get_tasks(email: str = Depends(get_email_from_token)):
    response = table.query(
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={':email': email}
    )
    return response.get('Items', [])

@app.post("/tasks", response_model=Todo)
def create_task(todo: TodoCreate, email: str = Depends(get_email_from_token)):
    # Generate a unique ID and current timestamp
    task_id = str(uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # Create the task dictionary
    todo_dict = {
        "id": task_id,
        "email": email,
        "title": todo.title,
        "createdAt": created_at,
        "completedAt": None
    }

    # Save the task to DynamoDB
    table.put_item(Item=todo_dict)

    # Return the created task
    return Todo(**todo_dict)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, email: str = Depends(get_email_from_token)):
    table.delete_item(Key={'email': email, 'id': task_id})
    return {"message": "Task deleted"}

@app.put("/tasks/{task_id}/toggle", response_model=Todo)
def toggle_task(task_id: str, email: str = Depends(get_email_from_token)):
    # Fetch the task from DynamoDB
    response = table.get_item(Key={'email': email, 'id': task_id})
    if 'Item' not in response:
        raise HTTPException(status_code=404, detail="Task not found")

    item = response['Item']
    completed_at = datetime.now(timezone.utc).isoformat() if not item.get('completedAt') else None

    # Update the task's completion status
    table.update_item(
        Key={'email': email, 'id': task_id},
        UpdateExpression="SET completedAt = :completedAt",
        ExpressionAttributeValues={':completedAt': completed_at}
    )

    # Fetch the updated task from DynamoDB
    updated_response = table.get_item(Key={'email': email, 'id': task_id})
    if 'Item' not in updated_response:
        raise HTTPException(status_code=500, detail="Failed to fetch updated task")

    updated_item = updated_response['Item']
    return Todo(**updated_item)