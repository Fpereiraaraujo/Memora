package com.memora.entrypoint.api.controller.definition;

import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "events", description = "Private event operations")
@Validated
public interface EventControllerApi {

	@PostMapping("/api/events")
	@Operation(
		summary = "Create event",
		description = "Creates a private event for the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "201", description = "Event created"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Unauthorized")
		}
	)
	ResponseEntity<EventCreateResponseDto> create(@Valid @RequestBody EventCreateRequestDto request, Authentication authentication);

	@GetMapping("/api/events")
	@Operation(
		summary = "List events",
		description = "Lists the private events owned by the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Events listed"),
			@ApiResponse(responseCode = "401", description = "Unauthorized")
		}
	)
	ResponseEntity<List<EventResponseDto>> list(Authentication authentication);

	@GetMapping("/api/events/{eventId}")
	@Operation(
		summary = "Get event",
		description = "Returns a private event owned by the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Event returned"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<EventResponseDto> get(@PathVariable UUID eventId, Authentication authentication);

	@GetMapping(value = "/api/events/{eventId}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
	@Operation(
		summary = "Get event QR code",
		description = "Returns the QR code image pointing to the public event page.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "QR code generated"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<byte[]> qrcode(@PathVariable UUID eventId, Authentication authentication);

	@GetMapping("/api/events/{eventId}/photos")
	@Operation(
		summary = "List event photos",
		description = "Lists uploaded photos for the authenticated host event.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Photos listed"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<List<PhotoResponseDto>> photos(@PathVariable UUID eventId, Authentication authentication);

	@PatchMapping("/api/events/{eventId}")
	@Operation(
		summary = "Update event",
		description = "Updates basic event information for the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Event updated"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<EventResponseDto> update(@PathVariable UUID eventId, @Valid @RequestBody EventUpdateRequestDto request, Authentication authentication);

	@PatchMapping("/api/events/{eventId}/status")
	@Operation(
		summary = "Update event status",
		description = "Activates or pauses an event for the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Event status updated"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<EventResponseDto> updateStatus(@PathVariable UUID eventId, @Valid @RequestBody EventStatusUpdateRequestDto request, Authentication authentication);
}
