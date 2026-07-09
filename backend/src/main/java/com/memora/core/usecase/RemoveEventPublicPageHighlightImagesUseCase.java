package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageHighlightImagesParam;

public interface RemoveEventPublicPageHighlightImagesUseCase {

	EventPublicPageCustomization execute(RemoveEventPublicPageHighlightImagesParam param);
}
