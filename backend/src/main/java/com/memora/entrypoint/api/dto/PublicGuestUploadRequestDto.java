package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class PublicGuestUploadRequestDto {

	private MultipartFile file;

	@Size(max = 120)
	private String guestName;

	@Size(max = 280)
	private String guestMessage;

	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

	public String getGuestName() {
		return guestName;
	}

	public void setGuestName(String guestName) {
		this.guestName = guestName;
	}

	public String getGuestMessage() {
		return guestMessage;
	}

	public void setGuestMessage(String guestMessage) {
		this.guestMessage = guestMessage;
	}
}
