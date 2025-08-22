package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Brand request")
public class BrandRequest {
    
    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 100, message = "Brand name must be between 2 and 100 characters")
    @Schema(description = "Brand name", example = "Nike")
    private String name;
}
