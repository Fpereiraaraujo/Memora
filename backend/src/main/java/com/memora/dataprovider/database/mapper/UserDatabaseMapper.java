package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.User;
import com.memora.dataprovider.database.entity.UserEntity;

public final class UserDatabaseMapper {

	private UserDatabaseMapper() {
	}

	public static UserEntity toEntity(User user) {
		return UserEntity.builder()
			.id(user.getId())
			.name(user.getName())
			.email(user.getEmail())
			.passwordHash(user.getPasswordHash())
			.role(user.getRole())
			.createdAt(user.getCreatedAt())
			.updatedAt(user.getUpdatedAt())
			.build();
	}

	public static User toDomain(UserEntity entity) {
		return User.builder()
			.id(entity.getId())
			.name(entity.getName())
			.email(entity.getEmail())
			.passwordHash(entity.getPasswordHash())
			.role(entity.getRole())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}
}
