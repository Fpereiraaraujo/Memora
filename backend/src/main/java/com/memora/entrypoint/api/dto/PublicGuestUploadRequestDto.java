package com.memora.entrypoint.api.dto;

import java.util.List;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class PublicGuestUploadRequestDto {

	private MultipartFile file;
	private List<MultipartFile> files;

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

	public List<MultipartFile> getFiles() {
		return files;
	}

	public void setFiles(List<MultipartFile> files) {
		this.files = files;
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

	public List<MultipartFile> resolveFiles() {
		if (files != null && !files.isEmpty()) {
			return files.stream()
				.filter(currentFile -> currentFile != null && !currentFile.isEmpty())
				.toList();
		}

		if (file != null && !file.isEmpty()) {
			return List.of(file);
		}

		return List.of();
	}
}
