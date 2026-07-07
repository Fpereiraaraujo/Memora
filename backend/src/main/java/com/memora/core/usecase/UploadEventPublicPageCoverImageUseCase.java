package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageCoverImageParam;

public interface UploadEventPublicPageCoverImageUseCase {

	EventPublicPageCustomization execute(UploadEventPublicPageCoverImageParam param);
}
