package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import java.util.List;

public interface ListPublicEventPhotosUseCase {

	List<Photo> execute(ListPublicEventPhotosParam param);
}
