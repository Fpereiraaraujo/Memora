package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Photo;
import com.memora.dataprovider.database.entity.PhotoJpaEntity;

public final class PhotoDatabaseMapper {

	private PhotoDatabaseMapper() {
	}

	public static PhotoJpaEntity toEntity(Photo photo) {
		return PhotoJpaEntity.builder()
			.id(photo.getId())
			.eventId(photo.getEventId())
			.originalFilename(photo.getOriginalFilename())
			.objectKey(photo.getObjectKey())
			.contentType(photo.getContentType())
			.sizeBytes(photo.getSizeBytes())
			.status(photo.getStatus())
			.favorite(photo.isFavorite())
			.likesCount(photo.getLikesCount())
			.guestName(photo.getGuestName())
			.guestMessage(photo.getGuestMessage())
			.uploadGroupId(photo.getUploadGroupId())
			.createdAt(photo.getCreatedAt())
			.updatedAt(photo.getUpdatedAt())
			.build();
	}

	public static Photo toDomain(PhotoJpaEntity entity) {
		return Photo.builder()
			.id(entity.getId())
			.eventId(entity.getEventId())
			.originalFilename(entity.getOriginalFilename())
			.objectKey(entity.getObjectKey())
			.contentType(entity.getContentType())
			.sizeBytes(entity.getSizeBytes())
			.status(entity.getStatus())
			.favorite(entity.isFavorite())
			.likesCount(entity.getLikesCount())
			.guestName(entity.getGuestName())
			.guestMessage(entity.getGuestMessage())
			.uploadGroupId(entity.getUploadGroupId())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}
}
