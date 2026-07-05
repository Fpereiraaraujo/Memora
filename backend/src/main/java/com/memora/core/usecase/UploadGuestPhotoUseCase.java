package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.UploadGuestPhotoParam;

public interface UploadGuestPhotoUseCase {

	Photo execute(UploadGuestPhotoParam param);
}
