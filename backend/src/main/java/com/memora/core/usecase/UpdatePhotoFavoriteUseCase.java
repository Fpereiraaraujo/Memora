package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.UpdatePhotoFavoriteParam;

public interface UpdatePhotoFavoriteUseCase {

	Photo execute(UpdatePhotoFavoriteParam param);
}
