package com.example.ecomt.controller;

import com.example.ecomt.dto.ChatRequest;
import com.example.ecomt.dto.ChatResponse;
import com.example.ecomt.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Chat", description = "AI Chat API with product integration")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    @Operation(summary = "Send message to AI chat", description = "Send a message to the AI assistant and get a response with product suggestions")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.processChat(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    @Operation(summary = "Check chat service health", description = "Check if the chat service is running")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chat service is running");
    }
}
