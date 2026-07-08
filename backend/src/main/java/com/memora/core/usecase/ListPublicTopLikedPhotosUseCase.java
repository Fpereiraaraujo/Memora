package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListPublicTopLikedPhotosParam;
import java.util.List;

public interface ListPublicTopLikedPhotosUseCase {

	List<Photo> execute(ListPublicTopLikedPhotosParam param);
}
