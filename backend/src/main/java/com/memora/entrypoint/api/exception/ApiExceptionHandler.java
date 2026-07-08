package com.memora.entrypoint.api.exception;

import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException exception) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(SecurityException.class)
	public ResponseEntity<Map<String, String>> handleSecurityException(SecurityException exception) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Map<String, String>> handleNotFoundException(NoSuchElementException exception) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().isEmpty()
			? "Validation failed"
			: exception.getBindingResult().getFieldErrors().getFirst().getDefaultMessage();
		return ResponseEntity.badRequest().body(Map.of("error", message));
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<Map<String, String>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException exception) {
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
			.body(Map.of("error", "Cada envio aceita fotos de at\u00e9 20 MB. Tente novamente com uma imagem menor."));
	}

	@ExceptionHandler(TooManyRequestsException.class)
	public ResponseEntity<Map<String, String>> handleTooManyRequestsException(TooManyRequestsException exception) {
		return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
			.body(Map.of("error", exception.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleUnexpectedException(Exception exception) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(Map.of("error", "Algo saiu do esperado por aqui. Tente novamente em instantes."));
	}
}
