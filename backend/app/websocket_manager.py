import json
import logging
from typing import List
from fastapi import WebSocket

logger = logging.getLogger("AetherOpsWS")

class WebSocketManager:
    """
    Manages active WebSocket connections for full-duplex real-time state synchronization
    across connected dashboards.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"Client disconnected. Active connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        payload = json.dumps(message)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.error(f"Error sending message to client: {e}")
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)

ws_manager = WebSocketManager()
