import { useState, useCallback } from 'react';

const STORAGE_KEY = 'spotnana_conversations';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

/**
 * Manages conversation history in localStorage.
 *
 * A conversation object:
 *   { id: string, title: string, createdAt: string, messages: Message[] }
 */
export function useConversations() {
  const [conversations, setConversations] = useState(loadFromStorage);

  /** Save the current messages as a new (or updated) conversation. */
  const saveConversation = useCallback((messages, existingId = null) => {
    if (!messages || messages.length === 0) return null;

    const userMsg = messages.find((m) => m.role === 'user');
    const title = userMsg
      ? userMsg.content.slice(0, 60) + (userMsg.content.length > 60 ? '…' : '')
      : 'Untitled conversation';

    setConversations((prev) => {
      let updated;
      if (existingId) {
        updated = prev.map((c) =>
          c.id === existingId ? { ...c, title, messages, updatedAt: new Date().toISOString() } : c
        );
      } else {
        const newConversation = {
          id: `conv_${Date.now()}`,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages,
        };
        updated = [newConversation, ...prev];
      }
      saveToStorage(updated);
      return updated;
    });

    return existingId ?? `conv_${Date.now()}`;
  }, []);

  /** Delete a conversation by id. */
  const deleteConversation = useCallback((id) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /** Clear all conversations. */
  const clearAll = useCallback(() => {
    setConversations([]);
    saveToStorage([]);
  }, []);

  return { conversations, saveConversation, deleteConversation, clearAll };
}
