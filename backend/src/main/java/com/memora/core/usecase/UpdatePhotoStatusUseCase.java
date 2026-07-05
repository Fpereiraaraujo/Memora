package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.UpdatePhotoStatusParam;

public interface UpdatePhotoStatusUseCase {

	Photo execute(UpdatePhotoStatusParam param);
}
