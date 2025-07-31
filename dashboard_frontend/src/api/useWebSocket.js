import { useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useWebSocket provides a typed, reusable React hook for consuming a backend WebSocket stream.
 * Handles opening/closing, reconnecting, and message state.
 * @param {string} url - WebSocket endpoint URL (e.g. ws://localhost:3001/ws/stream)
 * @param {(message: any) => void} onMessage - Callback when new message arrives (receives parsed data)
 * @param {object} [opts] - extra { retryIntervalMs?: number }
 * @returns {object} { connected, lastMessage, error }
 */
export default function useWebSocket(url, onMessage, opts) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    let ws;
    let cleanupCalled = false;

    function connect() {
      setError(null);
      ws = new window.WebSocket(url);

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (typeof onMessage === "function") onMessage(data);
        } catch (e) {
          // fallback: try raw message
          setLastMessage(event.data);
          if (typeof onMessage === "function") onMessage(event.data);
        }
      };

      ws.onerror = (ev) => {
        setError("WebSocket error");
      };

      ws.onclose = () => {
        setConnected(false);
        if (!cleanupCalled) {
          // schedule reconnect
          reconnectTimeout.current = setTimeout(connect, opts?.retryIntervalMs ?? 4000);
        }
      };

      wsRef.current = ws;
    }

    connect();

    return () => {
      cleanupCalled = true;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (wsRef.current) wsRef.current.close();
    };
    // Only re-run when URL changes
    // eslint-disable-next-line
  }, [url]);

  return { connected, lastMessage, error };
}
