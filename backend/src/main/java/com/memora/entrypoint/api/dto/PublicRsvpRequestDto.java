package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PublicRsvpRequestDto(@NotNull Boolean attending, @Min(0) @Max(10) int plusOnes, @Size(max = 160) String companionName, @Size(max = 120) String mealChoice, @Size(max = 500) String dietaryRestrictions, @Size(max = 500) String guestMessage) { }
