package com.memora.core.usecase;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListEventPhotosParam;
import java.util.List;

public interface ListEventPhotosUseCase {

	List<Photo> execute(ListEventPhotosParam param);
}
