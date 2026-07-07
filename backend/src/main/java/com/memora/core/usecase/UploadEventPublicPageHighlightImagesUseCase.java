package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageHighlightImagesParam;

public interface UploadEventPublicPageHighlightImagesUseCase {

	EventPublicPageCustomization execute(UploadEventPublicPageHighlightImagesParam param);
}
