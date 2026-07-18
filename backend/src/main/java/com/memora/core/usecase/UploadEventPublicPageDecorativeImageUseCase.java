package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageDecorativeImageParam;

public interface UploadEventPublicPageDecorativeImageUseCase {

	EventPublicPageCustomization execute(UploadEventPublicPageDecorativeImageParam param);
}
