package com.memora.entrypoint.api.controller.definition;

import com.memora.entrypoint.api.dto.PublicEventResponseDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "public-events", description = "Public event access and guest uploads")
@Validated
public interface PublicEventControllerApi {

	@GetMapping("/api/public/events/{slug}")
	@Operation(
		summary = "Get public event",
		description = "Returns the public information for an event page.",
		responses = {
			@ApiResponse(responseCode = "200", description = "Event returned"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<PublicEventResponseDto> getPublicEvent(@PathVariable String slug);

	@GetMapping("/api/public/events/{slug}/photos")
	@Operation(
		summary = "List public event photos",
		description = "Lists public photos available on the event page.",
		responses = {
			@ApiResponse(responseCode = "200", description = "Photos listed"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<List<PhotoResponseDto>> listPhotos(@PathVariable String slug);

	@GetMapping("/api/public/events/{slug}/photos/page")
	@Operation(
		summary = "List public event photos paged",
		description = "Lists public event photos with pagination.",
		responses = {
			@ApiResponse(responseCode = "200", description = "Photos listed"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<PageResponseDto<PhotoResponseDto>> listPagedPhotos(
		@PathVariable String slug,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "30") int size
	);

	@PostMapping(value = "/api/public/events/{slug}/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(
		summary = "Upload guest photo",
		description = "Uploads a guest photo for the public event page.",
		responses = {
			@ApiResponse(responseCode = "201", description = "Photo uploaded"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<PublicGuestUploadResponseDto> uploadGuestPhoto(
		@PathVariable String slug,
		@Valid @ModelAttribute PublicGuestUploadRequestDto request,
		HttpServletRequest httpServletRequest
	);
}
