package com.dekalib.app.controller;

import com.dekalib.app.dto.request.CreateChatMessageRequest;
import com.dekalib.app.dto.request.CreateChatRequest;
import com.dekalib.app.dto.response.ChatMessageResponse;
import com.dekalib.app.dto.response.ChatResponse;
import com.dekalib.app.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
public class ChatController {
    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse create(@Valid @RequestBody CreateChatRequest request) {
        return chatService.create(request);
    }

    @GetMapping("/{chatId}")
    public ChatResponse getById(@PathVariable String chatId) {
        return chatService.getById(chatId);
    }

    @GetMapping("/{chatId}/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable String chatId) {
        return chatService.getMessages(chatId);
    }

    @PostMapping("/{chatId}/messages")
    public ChatMessageResponse sendMessage(
            @PathVariable String chatId,
            @Valid @RequestBody CreateChatMessageRequest request
    ) {
        return chatService.sendMessage(chatId, request);
    }
}
