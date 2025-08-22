package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Generic API response")
public class ApiResponse {
    
    @Schema(description = "Success status", example = "true")
    private boolean success;
    
    @Schema(description = "Response message", example = "Operation completed successfully")
    private String message;
    
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message);
    }
    
    public static ApiResponse error(String message) {
        return new ApiResponse(false, message);
    }
}
