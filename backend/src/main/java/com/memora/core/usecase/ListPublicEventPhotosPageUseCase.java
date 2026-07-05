package com.memora.core.usecase;

import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListPublicEventPhotosPageParam;

public interface ListPublicEventPhotosPageUseCase {

	PageResult<Photo> execute(ListPublicEventPhotosPageParam param);
}
