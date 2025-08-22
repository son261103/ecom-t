package com.example.ecomt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@Tag(name = "System", description = "System information APIs")
@Slf4j
public class DocsController {

    @GetMapping("/info")
    @Operation(summary = "Get system info", description = "Get basic system information")
    public ResponseEntity<Map<String, String>> getSystemInfo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        log.info("📡 API ACCESS - Time: {} | Endpoint: /api/system/info", timestamp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "System is running");
        response.put("timestamp", timestamp);
        response.put("swagger-url", "http://localhost:8080/docs");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/swagger-access")
    @Operation(summary = "Log Swagger access", description = "Log when someone accesses Swagger documentation")
    public ResponseEntity<Map<String, String>> logSwaggerAccess() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        log.info("🔍 SWAGGER DOCS ACCESS LOGGED - Time: {} | User accessed Swagger UI", timestamp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Swagger access logged successfully");
        response.put("timestamp", timestamp);
        response.put("note", "This endpoint logs when users access Swagger documentation");

        return ResponseEntity.ok(response);
    }
}
