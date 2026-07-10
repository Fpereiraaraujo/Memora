package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EventGuestCreateRequestDto(@NotBlank @Size(max = 160) String name, @Size(max = 40) String phone, @Size(max = 255) String email, @Size(max = 80) String guestGroup, @Min(0) @Max(10) int maxPlusOnes) { }
