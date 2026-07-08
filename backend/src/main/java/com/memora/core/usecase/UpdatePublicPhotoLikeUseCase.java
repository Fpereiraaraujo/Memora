package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.UpdatePublicPhotoLikeParam;

public interface UpdatePublicPhotoLikeUseCase {

	Photo execute(UpdatePublicPhotoLikeParam param);
}
