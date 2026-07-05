package com.memora.core.usecase;

import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListEventPhotosPageParam;

public interface ListEventPhotosPageUseCase {

	PageResult<Photo> execute(ListEventPhotosPageParam param);
}
