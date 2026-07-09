package com.memora.entrypoint.api.controller.definition;

import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventCheckoutRequestDto;
import com.memora.entrypoint.api.dto.EventCheckoutResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventPublicPageImageUploadResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PhotoFavoriteUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.dto.PhotoStatusUpdateRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

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

	@PostMapping("/api/events/{eventId}/checkout")
	@Operation(
		summary = "Create event checkout",
		description = "Creates an InfinitePay checkout link for the selected event plan.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Checkout created"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<EventCheckoutResponseDto> createCheckout(
		@PathVariable UUID eventId,
		@Valid @RequestBody EventCheckoutRequestDto request,
		Authentication authentication
	);

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

	@GetMapping("/api/events/{eventId}/qrcode")
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
	ResponseEntity<byte[]> qrcode(@PathVariable UUID eventId, Authentication authentication, HttpServletRequest request);

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

	@GetMapping("/api/events/{eventId}/photos/page")
	@Operation(
		summary = "List event photos paged",
		description = "Lists uploaded photos for the authenticated host event with pagination.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Photos listed"),
			@ApiResponse(responseCode = "401", description = "Unauthorized"),
			@ApiResponse(responseCode = "404", description = "Event not found")
		}
	)
	ResponseEntity<PageResponseDto<PhotoResponseDto>> pagedPhotos(
		@PathVariable UUID eventId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "30") int size,
		Authentication authentication
	);

	@PatchMapping("/api/events/{eventId}/photos/{photoId}/favorite")
	@Operation(
		summary = "Update photo favorite",
		description = "Marks or unmarks a photo as favorite for the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<PhotoResponseDto> updatePhotoFavorite(
		@PathVariable UUID eventId,
		@PathVariable UUID photoId,
		@Valid @RequestBody PhotoFavoriteUpdateRequestDto request,
		Authentication authentication
	);

	@PatchMapping("/api/events/{eventId}/photos/{photoId}/status")
	@Operation(
		summary = "Update photo status",
		description = "Updates a photo moderation status for the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<PhotoResponseDto> updatePhotoStatus(
		@PathVariable UUID eventId,
		@PathVariable UUID photoId,
		@Valid @RequestBody PhotoStatusUpdateRequestDto request,
		Authentication authentication
	);

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

	@GetMapping("/api/events/{eventId}/public-page")
	@Operation(
		summary = "Get event public page customization",
		description = "Returns the public page configuration for the authenticated host event.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageCustomizationResponseDto> getPublicPageCustomization(
		@PathVariable UUID eventId,
		Authentication authentication
	);

	@PutMapping("/api/events/{eventId}/public-page")
	@Operation(
		summary = "Update event public page customization",
		description = "Updates public page text configuration for the authenticated host event.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageCustomizationResponseDto> updatePublicPageCustomization(
		@PathVariable UUID eventId,
		@Valid @RequestBody EventPublicPageCustomizationUpdateRequestDto request,
		Authentication authentication
	);

	@PostMapping(value = "/api/events/{eventId}/public-page/cover-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(
		summary = "Upload event public page cover image",
		description = "Uploads the cover image used on the public event page.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageImageUploadResponseDto> uploadPublicPageCoverImage(
		@PathVariable UUID eventId,
		@RequestPart("file") MultipartFile file,
		Authentication authentication
	);

	@DeleteMapping("/api/events/{eventId}/public-page/cover-image")
	@Operation(
		summary = "Remove event public page cover image",
		description = "Removes the cover image currently used on the public event page.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageImageUploadResponseDto> removePublicPageCoverImage(
		@PathVariable UUID eventId,
		Authentication authentication
	);

	@PostMapping(value = "/api/events/{eventId}/public-page/highlight-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(
		summary = "Upload event public page highlight images",
		description = "Uploads up to 2 highlight images used on the public event page.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageImageUploadResponseDto> uploadPublicPageHighlightImages(
		@PathVariable UUID eventId,
		@RequestPart("files") List<MultipartFile> files,
		Authentication authentication
	);

	@DeleteMapping("/api/events/{eventId}/public-page/highlight-images")
	@Operation(
		summary = "Remove event public page highlight images",
		description = "Removes all highlight images currently used on the public event page.",
		security = { @SecurityRequirement(name = "bearerAuth") }
	)
	ResponseEntity<EventPublicPageImageUploadResponseDto> removePublicPageHighlightImages(
		@PathVariable UUID eventId,
		Authentication authentication
	);
}
