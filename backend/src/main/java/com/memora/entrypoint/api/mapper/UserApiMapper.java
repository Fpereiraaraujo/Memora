package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.User;
import com.memora.entrypoint.api.dto.UserLoginResponseDto;
import com.memora.entrypoint.api.dto.UserProfileResponseDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;

public final class UserApiMapper {

	private UserApiMapper() {
	}

	public static UserRegisterResponseDto toRegisterResponse(User user) {
		return new UserRegisterResponseDto(user.getId(), user.getName(), user.getEmail());
	}

	public static UserLoginResponseDto toLoginResponse(String token, User user) {
		return new UserLoginResponseDto(token, user.getId(), user.getName(), user.getEmail());
	}

	public static UserProfileResponseDto toProfileResponse(User user) {
		return new UserProfileResponseDto(user.getId(), user.getName(), user.getEmail());
	}
}
