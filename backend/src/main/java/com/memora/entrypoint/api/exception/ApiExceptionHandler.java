package com.memora.entrypoint.api.exception;

import java.util.Map;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class ApiExceptionHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(ApiExceptionHandler.class);

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException exception) {
		LOGGER.warn("Business conflict: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(SecurityException.class)
	public ResponseEntity<Map<String, String>> handleSecurityException(SecurityException exception) {
		LOGGER.warn("Security error: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Map<String, String>> handleNotFoundException(NoSuchElementException exception) {
		LOGGER.warn("Resource not found: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().isEmpty()
			? "Validation failed"
			: exception.getBindingResult().getFieldErrors().getFirst().getDefaultMessage();
		LOGGER.warn("Validation error: {}", message);
		return ResponseEntity.badRequest().body(Map.of("error", message));
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<Map<String, String>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException exception) {
		LOGGER.warn("Upload too large: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
			.body(Map.of("error", "Cada envio aceita fotos de at\u00e9 20 MB. Tente novamente com uma imagem menor."));
	}

	@ExceptionHandler(TooManyRequestsException.class)
	public ResponseEntity<Map<String, String>> handleTooManyRequestsException(TooManyRequestsException exception) {
		LOGGER.warn("Rate limit hit: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
			.body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleUnexpectedException(Exception exception) {
		LOGGER.error("Unexpected application error", exception);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(Map.of("error", "Algo saiu do esperado por aqui. Tente novamente em instantes."));
	}
}
