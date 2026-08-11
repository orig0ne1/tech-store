package com.dekalib.app.service;

import com.dekalib.app.dto.request.CreateChatMessageRequest;
import com.dekalib.app.dto.request.CreateChatRequest;
import com.dekalib.app.dto.response.ChatMessageResponse;
import com.dekalib.app.dto.response.ChatResponse;
import com.dekalib.app.entity.Chat;
import com.dekalib.app.entity.ChatMessage;
import com.dekalib.app.entity.ChatSender;
import com.dekalib.app.entity.ChatStatus;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.ChatMessageRepository;
import com.dekalib.app.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatService(ChatRepository chatRepository, ChatMessageRepository chatMessageRepository) {
        this.chatRepository = chatRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public ChatResponse create(CreateChatRequest request) {
        Chat chat = new Chat();
        chat.setName(request.name());
        chat.setEmail(request.email());
        chat.setStatus(ChatStatus.OPEN);
        Chat saved = chatRepository.saveAndFlush(chat);
        return toChatResponse(saved);
    }

    @Transactional(readOnly = true)
    public ChatResponse getById(String chatId) {
        return toChatResponse(getChatById(chatId));
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(String chatId) {
        getChatById(chatId);
        return chatMessageRepository.findByChatIdOrderByCreatedAtAsc(chatId).stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendMessage(String chatId, CreateChatMessageRequest request) {
        Chat chat = getChatById(chatId);
        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(ChatSender.CUSTOMER);
        message.setText(request.text());
        ChatMessage saved = chatMessageRepository.saveAndFlush(message);
        return toMessageResponse(saved);
    }

    private Chat getChatById(String chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new NotFoundException("CHAT_NOT_FOUND", "Chat not found"));
    }

    private ChatResponse toChatResponse(Chat chat) {
        return new ChatResponse(
                chat.getId(),
                chat.getName(),
                chat.getEmail(),
                chat.getStatus(),
                chat.getCreatedAt()
        );
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getSender(),
                message.getText(),
                message.getCreatedAt()
        );
    }
}
